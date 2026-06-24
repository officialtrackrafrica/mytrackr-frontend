import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../utils/api';
import { toast } from 'sonner';

export const useVerifyOTP = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: { email: string; code: string }) => {
      const { data } = await api.post('/auth/verify-otp', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Email verified successfully!');
      navigate('/subscribe');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    },
  });
};