import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../../../utils/api'; 

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: async () => {
      //     Adjust this endpoint to match your actual GET route
      const { data } = await api.get('/users/me/notification-preferences'); 
      return data?.data || data; 
    },
  });
};

export const useUpdateNotificationPreferences = () => {

  return useMutation({
    mutationFn: async (payload: any) => {
      //  Adjust this endpoint to match your actual PATCH route
      const { data } = await api.patch('/users/me/notification-preferences', payload);
      return data;
    },
    // We don't invalidate queries here on success because the UI toggle already updated instantly, 
    // and invalidating might cause a visual flicker.
  });
};