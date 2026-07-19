import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../../../utils/api';

// src/hooks/useProfitAndLoss.ts
interface PLParams {
  startDate: string;
  endDate: string;
}

export interface PLLineItem {
  label: string; // e.g., "Money from product sales"
  amount: number;
  subCategory: string;
}

interface PLCategoryGroup {
  lines: PLLineItem[];
  total: number;
}

export interface PLDataResponse {
  revenue: PLCategoryGroup;
  cogs: PLCategoryGroup;
  grossProfit: number;
  grossProfitMargin: number;
  expenses: {
    operating: PLCategoryGroup;
    other: PLCategoryGroup;
    total: number;
  };
  netProfit: number;
  netProfitMargin: number;
  metadata: {
    uncategorisedCount: number;
    uncategorisedValue: number;
  };
}

export const useProfitAndLoss = (params: PLParams) => {
  return useQuery<PLDataResponse>({
    queryKey: ['profit-and-loss', params],
    queryFn: async () => {
      const { data } = await api.get('/reports/pnl', { params });
      return data;
    },
    // Don't spam the API while typing or clicking between dates rapidly
    staleTime: 1000 * 60 * 5, 
  });
};

export const useDownloadPnLReport = () => {
  return useMutation({
    mutationFn: async ({ dates, format }: { dates: { startDate: string, endDate: string }, format: 'pdf' | 'csv' }) => {
      
      const endpoint = format === 'csv' 
        ? '/reports/pnl/export' 
        : '/reports/pnl/export.pdf';

      const response = await api.get(endpoint, {
        params: dates,
        responseType: 'blob', // Crucial for handling file downloads
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MyTrackr_PnL_${dates.startDate}_to_${dates.endDate}.${format}`); 
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  });
};