// src/hooks/useAccounts.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

export interface MonoAccount {
  id: string;
  monoAccountId: string;
  name: string;
  currency: string;
  type: string;
  accountNumber: string;
  balance: number;
  bvn: string;
  institutionName: string;
  isSynced: boolean;
  businessId: string;
}

export const useAccounts = () => {
  const { data, isLoading, isError, refetch } = useQuery<MonoAccount[]>({
    queryKey: ['mono-accounts'],
    queryFn: async () => {
      const { data } = await api.get('/mono/accounts');
      return data;
    },
    // Keep data fresh, but don't over-fetch
    staleTime: 1000 * 60 * 2, 
  });

  return {
    accounts: data || [],
    isLoading,
    isError,
    refetch
  };
};