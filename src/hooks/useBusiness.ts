// src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

export interface Business {
  id: string;
  name: string;
  businessType: string;
  currency: string;
  userId: string;
  createdAt: string;
  updatedAt: string
}

export const useBusiness = () => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery<Business>({
    queryKey: ['business'],
    queryFn: async () => {
      const { data } = await api.get('/businesses/my-business');
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return { 
    business: data, 
    isLoading, 
    isError, 
    refetch, 
    isFetching 
  };
};

export const useBusinessTypes = () => {
  return useQuery({
    queryKey: ['business-types'],
    queryFn: async () => {
      //  Adjust this endpoint to match your actual backend route
      const { data } = await api.get('/businesses/types'); 
      return data?.data || data || []; 
    },
  });
};