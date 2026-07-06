// src/pages/auth/hooks/useAuthActions.ts
import { useMutation } from '@tanstack/react-query';
import { api } from '../../../utils/api';

// For the first step (ForgotPasswordPage)
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => api.post('/auth/forgot-password', { email })
  });
};

// For the final step (ResetPasswordPage)
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: any) => api.post('/auth/reset-password', data)
  });
};