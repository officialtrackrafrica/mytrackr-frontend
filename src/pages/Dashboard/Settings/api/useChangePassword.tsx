import { useMutation } from '@tanstack/react-query';
import { api } from '../../../../utils/api'; // Adjust path based on your project structure

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: { oldPassword: string; newPassword: string }) => {
      const { data } = await api.post('/users/change-password', payload); 
      return data;
    },
  });
};