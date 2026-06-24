// Add to src/hooks/useUser.ts (or your api hooks file)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../utils/api'; // Adjust path if needed

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  country: string;
  timezone: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await api.patch('/users/me', payload);
      return data;
    },
    onSuccess: () => {
      // Refresh the user data immediately after a successful update
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};