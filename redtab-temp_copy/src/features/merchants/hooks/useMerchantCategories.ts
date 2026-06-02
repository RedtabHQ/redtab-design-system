import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { categoryService } from '@/lib/apiService';

interface MerchantCategory {
  id: string;
  name: string;
}

/**
 * Hook to fetch active categories for dropdown selection
 * Categories are now unified for both merchants and suppliers
 *
 * @returns Query result with active categories
 *
 * @example
 * ```tsx
 * const { data: categories, isLoading } = useActiveMerchantCategories();
 *
 * if (isLoading) return <LoadingSpinner />;
 *
 * return (
 *   <Select
 *     options={categories?.map(cat => ({
 *       value: cat.id,
 *       label: cat.name
 *     }))}
 *   />
 * );
 * ```
 */
export const useActiveMerchantCategories = (
  options?: Omit<UseQueryOptions<MerchantCategory[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<MerchantCategory[], Error> => {
  return useQuery({
    queryKey: ['categories', 'active'],
    queryFn: async () => {
      const response = await categoryService.getAll({
        status: 'ACTIVE',
        pageSize: 100,
        page: 1
      });

      return (response.items || []) as MerchantCategory[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};
