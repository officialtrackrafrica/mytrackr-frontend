// src/hooks/useSupport.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../utils/api';

// 1. GET: Fetch all tickets
export const useTickets = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['support-tickets', params?.page],
    queryFn: async () => {
      // Adjust endpoint to match your backend route
      const { data } = await api.get('/support/tickets', { params });
      return data?.data || data;
    },
  });
};

// 2. POST: Create a new ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // We use FormData here so it can accept files!
    mutationFn: async (payload: FormData) => {
      const { data } = await api.post('/support/tickets', payload, {
        headers: {
          'Content-Type': 'multipart/form-data', // Crucial for file uploads
        },
      });
      return data;
    },
    onSuccess: () => {
      // Instantly refresh the tickets list when a new one is created
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    },
  });
};