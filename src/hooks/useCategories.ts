// Add this to src/pages/dashboard/api/useAssetsAndLiabilities.ts

import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

export interface CategoryItem {
  id: string;
  value: string;
  label: string;
}

/**
 * Fetches dynamic asset or liability categories from the backend finance configuration.
 * @param type - Expects 'ASSET' or 'LIABILITY' to route query caching correctly.
 */
export const useCategories = () => {
  return useQuery<CategoryItem[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      // Adjust this path endpoint match string to align exactly with your router config
      const { data } = await api.get('/finance/assets/categories');
      
      // Flexible normalization layer to unpack your server response layout cleanly
      return data?.data || data || [];
    },
    // Performance optimization tuning params
    staleTime: 1000 * 60 * 30, // Categories are static metadata; cache for 30 minutes
    gcTime: 1000 * 60 * 60,    // Keep garbage collection window open for 1 hour
  });
};