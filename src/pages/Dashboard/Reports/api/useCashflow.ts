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
    mutationFn: async (params: { startDate: string, endDate: string }) => {
      const response = await api.get('/reports/cash-flow/export.pdf', {
        params,
        responseType: 'blob', // Crucial for handling file downloads
      });

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a hidden link and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MyTrackr_Cashflow_${params.startDate}_to_${params.endDate}.pdf`); 
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  });
};