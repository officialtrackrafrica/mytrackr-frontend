// src/hooks/useAssetsAndLiabilities.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../utils/api';

export interface AssetListItem {
  id: string;
  name: string;
  value: number;
  currentValue: number;
  category: string;
}

export interface LiabilityListItem {
  id: string;
  name: string;
  value: number;
  currentValue: number;
  category: string;
}

interface QueryParams {
  page?: number;
}

// 1. Exported Hook for Assets
export const useAssets = (params: QueryParams) => {
  return useQuery<{ data: AssetListItem[]; totalPages: number }>({
    queryKey: ['assets', params],
    queryFn: async () => {
      const { data } = await api.get('/finance/assets', { params });
      return {
        data: data.data || [],
        totalPages: data.meta?.totalPages || 1
      };
    },
    staleTime: 1000 * 60 * 2,
  });
};

// 2. Exported Hook for Liabilities
export const useLiabilities = (params: QueryParams) => {
  return useQuery<{ data: LiabilityListItem[]; totalPages: number }>({
    queryKey: ['liabilities', params],
    queryFn: async () => {
      const { data } = await api.get('/finance/liabilities', { params });
      return {
        data: data.data || [],
        totalPages: data.meta?.totalPages || 1
      };
    },
    staleTime: 1000 * 60 * 2,
  });
};

export interface CreateAssetPayload {
  name: string;
  categoryId: string;
  purchaseValue: number;
  currentValue: number;
  purchaseDate: string;
  notes?: string;
  businessId: string;
}

export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAssetPayload) => {
      const { data } = await api.post('/finance/assets', payload);
      return data;
    },
    onSuccess: () => {
      // Instantly forces your assets table query key cache to refresh!
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

export interface CreateLiabilityPayload {
  name: string;
  liabilityTypeId: string; // matches your payload
  amountOwed: number;    // matches your payload
  originalAmount: number; // matches your payload
  dueDate: string;       // matches your payload
  notes?: string;
  businessId: string;
}

export const useCreateLiability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLiabilityPayload) => {
      const { data } = await api.post('/finance/liabilities', payload);
      return data;
    },
    onSuccess: () => {
      // Instantly forces your liabilities table query key cache to refresh!
      queryClient.invalidateQueries({ queryKey: ['liabilities'] });
    },
  });
};

export const useLiabilityTypes = () => {
  return useQuery({
    queryKey: ['liability-types'],
    queryFn: async () => {
      // Adjust the endpoint if your backend uses a different path
      const { data } = await api.get('/finance/liabilities/types');
      return data?.data || data || []; 
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 mins
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/finance/assets/${id}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  });
};

export const useUpdateLiability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/finance/liabilities/${id}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['liabilities'] }),
  });
};

// --- DELETE HOOKS ---
export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/finance/assets/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
  });
};

export const useDeleteLiability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/finance/liabilities/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['liabilities'] }),
  });
};