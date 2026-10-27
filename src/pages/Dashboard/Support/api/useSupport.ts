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

// 👉 1. Hook to fetch the full conversation thread for a single ticket
export const useTicketDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const response = await api.get(`/support/tickets/${id}`);
      return response.data;
    },
    // Only run this query if an ID is actually passed in (prevents errors when the drawer is closed)
    enabled: !!id, 
  });
};

// 2. Hook to send a reply
export const useReplyToTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { id: string; message: string; attachment?: File | null }) => {
      // Create a FormData object for multipart/form-data
      const formData = new FormData();
      formData.append("message", data.message);
      
      if (data.attachment) {
        formData.append("attachment", data.attachment);
      }

      // Axios will automatically set the correct multipart boundary headers
      const response = await api.post(`/support/tickets/${data.id}/replies`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};