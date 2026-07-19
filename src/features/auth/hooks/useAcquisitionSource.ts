import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../utils/api'; 

export const useAcquisitionOptions = () => {
  return useQuery({
    queryKey: ['acquisition-options'],
    queryFn: async () => {
      const response = await api.get('/users/me/acquisition-source/options');
      return response.data; // Expecting the array of { value, label }
    }
  });
};

export const useSubmitAcquisitionSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { source: string; sourceOther?: string }) => {
      const response = await api.patch('/users/me/acquisition-source', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] }); 
      queryClient.invalidateQueries({ queryKey: ['me'] }); 
    }
  });
};