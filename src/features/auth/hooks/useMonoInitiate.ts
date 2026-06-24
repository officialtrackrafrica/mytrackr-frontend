import { useMutation } from '@tanstack/react-query';
import { api } from '../../../utils/api';
import { toast } from 'sonner';

export const useMonoInitiate = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/mono/initiate', {
        scope: "auth",
        redirect_url: window.location.origin + "/dashboard" 
      });
      console.log(data)
      return data; // This usually returns a 'mono_url' or 'token'
    },
    onSuccess: (data) => {
      // If the backend returns a direct link to the Mono widget:
      if (data?.data.mono_url || data?.data.link) {
        window.location.href = data?.data.mono_url || data.data.link;
      } else {
        console.error("Backend didn't return a link:", data);
        toast.error("Couldn't get Mono connection link");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to initialize Mono');
    },
  });
};