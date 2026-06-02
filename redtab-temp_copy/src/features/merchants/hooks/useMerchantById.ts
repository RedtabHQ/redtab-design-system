import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { merchantService } from '@/lib/apiService';
import type { Merchant } from '@types';

/**
 * Hook to fetch a single merchant by ID for server-side operations
 *
 * This hook is primarily used internally by other stores/services that need
 * to validate or fetch merchant data during operations.
 *
 * Features:
 * - Caches merchant data for 5 minutes
 * - Can be enabled/disabled conditionally
 * - Provides single merchant details
 *
 * @param id - Merchant ID to fetch
 * @param options - Query options
 * @returns Query result with merchant data
 *
 * @example
 * ```tsx
 * const { data: merchant } = useMerchantById('M123');
 * ```
 */
export function useMerchantById(
  id: string | null | undefined,
  options?: Omit<UseQueryOptions<Merchant>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['merchant', id] as const,
    queryFn: async () => {
      if (!id) throw new Error('Merchant ID is required');
      const response = await merchantService.getById(id);
      return response as Merchant;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });
}
