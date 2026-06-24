import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../utils/api'; 

export const useActivityLogs = (params: { page: number; limit?: number }) => {
  return useQuery({
    queryKey: ['activity-logs', params.page],
    queryFn: async () => {
      const { data } = await api.get('/users/me/activity-logs', { 
        params: {
          page: params.page,
          limit: params.limit || 10,
        }
      });
      return data; 
    },
  });
};