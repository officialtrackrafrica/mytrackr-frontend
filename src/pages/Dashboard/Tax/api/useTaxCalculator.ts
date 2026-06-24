// // src/hooks/useTaxCalculator.ts
// import { useMutation } from '@tanstack/react-query';
// import { api } from '../../../../utils/api';

// export interface TaxEstimatePayload {
//   year: number;
//   deductions?: {
//     healthInsurance?: number;
//     lifeInsurance?: number;
//     pension?: number;
//     housingFund?: number;
//     rent?: number;
//     extra?: number;
//   };
// }

// export interface TaxEstimateResponse {
//   year: number;
//   netProfit: number;
//   totalRevenue: number;
//   totalCogs: number;
//   totalExpenses: number;
//   totalAssets: number;
//   projection: {
//     monthsElapsed: number;
//     projectedAnnualNetProfit: number;
//   };
//   deductions: {
//     healthInsurance: number;
//     lifeInsurance: number;
//     pension: number;
//     housingFund: number;
//     rent: number;
//     extra: number;
//     total: number;
//   };
//   taxableProfit: number;
//   pitCalculation: {
//     chargeableIncome: number;
//     consolidatedReliefAllowance: number;
//     estimatedAnnualTax: number;
//     estimatedMonthlySetAside: number;
//     minimumTaxFloor: number;
//     minimumTaxApplied: boolean;
//     breakdown: {
//       bandLimit: string;
//       rate: string;
//       taxableAmount: number;
//       taxGenerated: number;
//     }[];
//   };
//   citCalculation: {
//     companySize: string;
//     companyCategory: string;
//     assessableProfit: number;
//     estimatedTaxableProfit: number;
//     taxRateApplied: string;
//     estimatedAnnualTax: number;
//     estimatedMonthlySetAside: number;
//     isExempt: boolean;
//     totalAssetsConsidered: number;
//   };
// }

// export const useCalculateTaxEstimate = () => {
//   return useMutation<TaxEstimateResponse, Error, TaxEstimatePayload>({
//     mutationFn: async (payload) => {
//       const { data } = await api.get('/tax/estimate', payload);
//       return data?.data || data;
//     },
//   });
// };

// src/pages/dashboard/api/useTaxCalculator.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../utils/api';

export interface TaxEstimateParams {
  year: number;
  healthInsurance?: number;
  lifeInsurance?: number;
  pension?: number;
  housingFund?: number;
  rent?: number;
  extra?: number;
}

export interface TaxEstimateResponse {
  year: number;
  netProfit: number;
  totalRevenue: number;
  totalCogs: number;
  totalExpenses: number;
  totalAssets: number;
  projection: {
    monthsElapsed: number;
    projectedAnnualNetProfit: number;
  };
  deductions: {
    healthInsurance: number;
    lifeInsurance: number;
    pension: number;
    housingFund: number;
    rent: number;
    extra: number;
    total: number;
  };
  taxableProfit: number;
  pitCalculation: {
    chargeableIncome: number;
    consolidatedReliefAllowance: number;
    estimatedAnnualTax: number;
    estimatedMonthlySetAside: number;
    minimumTaxFloor: number;
    minimumTaxApplied: boolean;
    breakdown: {
      bandLimit: string;
      rate: string;
      taxableAmount: number;
      taxGenerated: number;
    }[];
  };
  citCalculation: {
    companySize: string;
    companyCategory: string;
    assessableProfit: number;
    estimatedTaxableProfit: number;
    taxRateApplied: string;
    estimatedAnnualTax: number;
    estimatedMonthlySetAside: number;
    isExempt: boolean;
    totalAssetsConsidered: number;
  };
}
export const useTaxCalculatorEstimate = (params: TaxEstimateParams) => {
  return useQuery<TaxEstimateResponse>({
    queryKey: ['tax-estimate', params],
    queryFn: async () => {
      const { data } = await api.get('/tax/estimate', { 
        params: {
          year: params.year,
          // Explicitly map nested query keys if your backend expects brackets format:
          'deductions[healthInsurance]': params.healthInsurance,
          'deductions[lifeInsurance]': params.lifeInsurance,
          'deductions[pension]': params.pension,
          'deductions[housingFund]': params.housingFund,
          'deductions[rent]': params.rent,
          'deductions[extra]': params.extra,
        }
      });
      return data?.data || data;
    },
    enabled: false, 
    staleTime: 0,   
  });
};