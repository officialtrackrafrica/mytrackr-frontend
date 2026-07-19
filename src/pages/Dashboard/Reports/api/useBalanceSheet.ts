// src/hooks/useBalanceSheet.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../utils/api';

interface BSParams {
  startDate: string;
  endDate: string;
}
export interface BankAccountItem {
  id: string;
  name: string;
  balance: number;
}

export interface BalanceSheetResponse {
  summary: {
    totalAssets: number;
    totalLiabilities: number;
    ownersEquity: number;
    cashAvailable: number;
    businessPropertiesAndValuables: number;
    outstandingDebts: number;
    ownerInvestments: number;
    retainedProfits: number;
    ownerWithdrawals: number;
  };
  assets: {
    bankAccounts: BankAccountItem[];
    cashAndBankBalances: number;
    businessAssets: any[];
    businessAssetsTotal: number;
    totalAssets: number;
  };
  liabilities: {
    activeLiabilities: any[];
    totalLiabilities: number;
  };
  equity: {
    capitalContributed: number;
    ownerInvestments: number;
    retainedProfit: number;
    retainedProfits: number;
    ownerWithdrawals: number;
    ownersEquity: number;
    ownersMoney: number;
  };
  integrityCheck: {
    equation: string;
    difference: number;
    isValid: boolean;
  };
}

  export const useBalanceSheet = (params: BSParams) => {
    return useQuery<BalanceSheetResponse>({
      queryKey: ['balance-sheet', params],
      queryFn: async () => {
        const { data } = await api.get('/reports/balance-sheet', { params });
        return data;
      },
      staleTime: 1000 * 60 * 5,
    });
  };