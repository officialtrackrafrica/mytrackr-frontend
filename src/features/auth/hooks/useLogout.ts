import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../utils/api';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/logout');
      return data;
    },
    onSettled: () => {
      // 1. Wipe all sensitive MyTrackr data from the React Query memory cache
      queryClient.clear();
      
      // 2. Perform a hard redirect to wipe any remaining React state and return to login
      window.location.href = '/login'; 
    },
  });
};