import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../../utils/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: any) => {
      const { data } = await api.post('/auth/register/email', formData);
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success('Registration successful! Check your email.');
      navigate('/verify-email', { state: { email: variables.email } });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    },
  });
};

export const useCheckGoogleSignup = () => {
  return useQuery({
    queryKey: ['googleSignupStatus'],
    queryFn: async () => {
      const response = await api.get('/users/me/google-signup');
      return response.data; 
      // Assuming it returns something like { isGoogleSignup: true, hasCompletedOnboarding: false }
    },
    // Don't refetch on window focus for this specific check to avoid flashing
    refetchOnWindowFocus: false, 
  });
};