// src/hooks/useCashflow.ts
import { useQuery } from '@tanstack/react-query';
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