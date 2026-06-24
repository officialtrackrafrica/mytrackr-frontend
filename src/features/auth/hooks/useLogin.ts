// src/features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../utils/api';
import { toast } from 'sonner';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: any) => {
      // credentials will be { email, password }
      const { data } = await api.post('/auth/login/email', credentials);
      return data;
    },
    onSuccess: () => {
      toast.success('Logged in successfully!');
      navigate('/dashboard'); // Redirect to the main app
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Invalid email or password';
      toast.error(message);
    },
  });
};