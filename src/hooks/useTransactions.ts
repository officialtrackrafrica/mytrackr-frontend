import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';

export interface Transaction {
  id: string;
  date: string;
  name: string;
  amount: number;
  direction: 'CREDIT' | 'DEBIT';
  description: string;
  category: string;
  subCategory?: string;
  isCategorised: boolean;
}

interface TransactionParams {
  page?: number;
  limit?: number;
  search?: string;
  isCategorised?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const useTransactions = (params: TransactionParams) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => {
      //  BULLETPROOF CLEANING: Remove undefined, null, and empty strings
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => {
          if (Array.isArray(v)) return v.length > 0; // Drop empty arrays
          return v !== undefined && v !== null && v !== ''; 
        })
        .map(([k, v]) => {
            if (Array.isArray(v)) return [k, v.join(',')];
            return [k, v];
          })
      );
      
      const { data } = await api.get('/finance/transactions', { params: cleanParams });
      return data;
    },
  });
};

export interface CreateTransactionPayload {
  date: string;
  name: string;
  amount: number;
  direction: 'CREDIT' | 'DEBIT';
  description: string;
  categoryId: string;
  subCategoryId?: string | null,
  notes?: string;
  bankAccountId?: string;
}

export const useTransactionCategories = () => {
  return useQuery({
    queryKey: ['transaction-categories'],
    queryFn: async () => {
      const { data } = await api.get('/finance/categories');
      return data?.data || data || []; 
      // Assumes structure: [{ id: '...', name: '...', subCategories: [{ id: '...', name: '...' }] }]
    },
    staleTime: 1000 * 60 * 30,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTransactionPayload) => {
      const { data } = await api.post('/finance/transactions', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export interface UpdateTransactionCategoryPayload {
  id: string;
  categoryId?: string;
  subCategoryId?: string | null;
}

export const useUpdateTransactionCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, categoryId, subCategoryId }: UpdateTransactionCategoryPayload) => {
      // Build the request body dynamically based on what was updated
      const payload: Record<string, any> = {};
      if (categoryId !== undefined) payload.categoryId = categoryId;
      if (subCategoryId !== undefined) payload.subCategoryId = subCategoryId;

      // Ensure the URL perfectly matches your Swagger docs
      const { data } = await api.patch(`/finance/linked-accounts/transactions/${id}/category`, payload);
      return data;
    },
    onSuccess: () => {
      // This is the magic line that stops the dropdown from "snapping back".
      // It forces the table to refetch the fresh data immediately after saving.
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; [key: string]: any }) => {
      // Uses the endpoint from your provided schema image
      const { data } = await api.patch(`/finance/transactions/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/finance/transactions/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useUploadStatement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, autoCategorize }: { file: File; autoCategorize: boolean }) => {
      const formData = new FormData();
      formData.append('file', file); 

      const { data } = await api.post('/finance/transactions/upload-pdf', formData, {
        params: { autoCategorize }, 
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      return data;
    },
    onSuccess: () => {
      // Refresh the transactions table immediately after a successful upload
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};