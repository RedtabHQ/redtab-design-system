import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { merchantService } from '@/lib/apiService';
import type { MerchantScoreBreakdown } from '@types';

/**
 * Hook to fetch detailed score breakdown for a merchant
 *
 * Features:
 * - Fetches capacity and intention indicators
 * - Provides risk factor analysis
 * - Caches data for 5 minutes
 * - Can be enabled/disabled conditionally
 *
 * @param merchantId - Merchant ID to fetch breakdown for
 * @param options - Query options
 * @returns Query result with score breakdown data
 *
 * @example
 * ```tsx
 * const { data: breakdown, isLoading } = useMerchantScoreBreakdown(merchant.id);
 * if (breakdown) {
 *   console.log('Capacity:', breakdown.capacityScore);
 *   console.log('Bank Cash Flow:', breakdown.capacityIndicators?.bankCashFlow);
 * }
 * ```
 */
export function useMerchantScoreBreakdown(
  merchantId: string | null | undefined,
  options?: Omit<UseQueryOptions<MerchantScoreBreakdown>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['merchant-score-breakdown', merchantId] as const,
    queryFn: async () => {
      if (!merchantId) throw new Error('Merchant ID is required');
      const response = await merchantService.getScoreBreakdown<MerchantScoreBreakdown>(merchantId);
      return response;
    },
    enabled: !!merchantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });
}
