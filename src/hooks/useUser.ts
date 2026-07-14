// src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  isVerified: boolean;
  country: string;
  businessType: string;
  hasSelectedBusinessType: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useUser = () => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await api.get('/users/me');
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return { 
    user: data, 
    isLoading, 
    isError, 
    refetch, 
    isFetching 
  };
};