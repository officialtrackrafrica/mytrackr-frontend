// src/hooks/useBilling.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../utils/api'; // Adjust to your Axios instance path

// 1. Fetch Current Active Plan
export const useCurrentPlan = () => {
  return useQuery({
    queryKey: ['billing', 'current-plan'],
    queryFn: async () => {
      // Adjust endpoint to match your Swagger docs
      const { data } = await api.get('/subscriptions/my-plan'); 
      return data?.data || data; 
    },
  });
};

// 2. Fetch Billing History (Invoices)
export const useBillingHistory = () => {
  return useQuery({
    queryKey: ['billing', 'history'],
    queryFn: async () => {
      const { data } = await api.get('/subscriptions/billing-history');
      return data || [];
    },
  });
};

// 3. Fetch Available Subscription Plans (For the upgrade modal)
export const useAvailablePlans = () => {
  return useQuery({
    queryKey: ['billing', 'available-plans'],
    queryFn: async () => {
      const { data } = await api.get('/subscriptions/plans');
      return data || [];
    },
  });
};

// 4. Upgrade/Change Plan Mutation

export interface SubscribePayload {
  planSlug: string;
  interval: 'monthly' | 'yearly' | string;
}

export const useUpgradePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubscribePayload) => {
      // Sends exactly { planSlug: "...", interval: "..." } to your backend
      const { data } = await api.post('/subscriptions/subscribe', payload); 
      return data;
    },
    onSuccess: () => {
      // Refresh billing data immediately
      queryClient.invalidateQueries({ queryKey: ['billing'] });
    },
  });
};

// Add to src/hooks/useBilling.ts

export const usePaymentMethod = () => {
  return useQuery({
    queryKey: ['billing', 'payment-method'],
    queryFn: async () => {
      //  Adjust this endpoint to match your Swagger docs
      const { data } = await api.get('/subscriptions/billing-card'); 
      return data; 
    },
  });
};