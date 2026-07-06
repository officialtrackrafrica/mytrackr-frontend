// src/hooks/useDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';
import type { AxiosError } from 'axios';

interface DashboardMetrics {
  revenue: number;
  expenses: number;
  netProfit: number;
  cashBalance: number;
  uncategorisedCount: number;
  burnRate: number;
}

export const useDashboardMetrics = (startDate: string, endDate: string) => {
  return useQuery<any, AxiosError>({
    // Include dates in the queryKey so it automatically refetches when the user changes the dropdown!
    queryKey: ['dashboard-metrics', startDate, endDate], 
    queryFn: async () => {
      const { data } = await api.get('/dashboard', {
        params: { startDate, endDate } // Passing the required query parameters
      });
      return (data?.data || data) as DashboardMetrics;
    },
    enabled: !!startDate && !!endDate, // Wait until dates are calculated before fetching
  });
};