// src/hooks/useIntegrations.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

export const useCreateIntegration = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/integrations', payload);
      return data; // Expected to return the integration object including the apiKey
    },
  });
};

export const useSendTestEvent = () => {
  return useMutation({
    mutationFn: async ({ apiKey, payload }: { apiKey: string; payload: any }) => {
      const { data } = await api.post('/integrations/events', payload, {
        headers: {
          'x-mytrackr-api-key': apiKey,
        },
      });
      return data;
    },
  });
};

export const useGetIntegrations = () => {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const { data } = await api.get('/integrations');
      // Adjust based on your standard API response structure
      return data?.data || data || []; 
    },
  });
};

interface ConnectPaystackPayload {
  secretKey: string;
}

export const useConnectPaystack = () => {
  return useMutation({
    mutationFn: async ({ secretKey }: ConnectPaystackPayload) => {
      const response = await api.post('/integrations/paystack/connect', 
        { secretKey: secretKey },
      );
      return response.data;
    }
  });
};