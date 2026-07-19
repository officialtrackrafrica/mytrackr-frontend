// src/hooks/useCashflow.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../../../utils/api';

export interface CashflowMetric {
  value: number;
  percentageChange: number;
  isPositive: boolean; // Controls whether green text or red text displays
}

export interface CashflowResponse {
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
  internalTransfers: {
    internalIn: number;
    internalOut: number;
  };
  monthlyBurnRate: number;
  cashBalance: number;
  monthsOfRunway: number;
  lowRunwayAlert: boolean;
  meta?: {
    businessName: string;
    statementPeriod: string;
  };
}

interface CashflowParams {
  startDate: string;
  endDate: string;
}

export const useCashflow = (params: CashflowParams) => {
  return useQuery<CashflowResponse>({
    queryKey: ['cashflow', params],
    queryFn: async () => {
      const { data } = await api.get('/reports/cash-flow', { params });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useDownloadCashflowReport = () => {
  return useMutation({
    mutationFn: async ({ dates, format }: { dates: { startDate: string, endDate: string }, format: 'pdf' | 'csv' }) => {
      
    
      const endpoint = format === 'csv' 
        ? '/reports/cash-flow/export' 
        : '/reports/cash-flow/export.pdf';

      const response = await api.get(endpoint, {
        params: dates,
        responseType: 'blob', // Crucial for handling file downloads
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MyTrackr_Cashflow_${dates.startDate}_to_${dates.endDate}.${format}`); 
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  });
};