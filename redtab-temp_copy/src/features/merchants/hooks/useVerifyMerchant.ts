import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { merchantService } from '@services';
import type { Merchant, CreditTier } from '@types';
import { merchantDetailKeys } from './useMerchantDetail';

/**
 * Hook to verify/approve a merchant with tier assignment
 *
 * Features:
 * - Calls POST /merchants/:id/approve endpoint
 * - Automatic cache invalidation of merchant queries
 * - Loading and error states built-in
 * - Supports onSuccess/onError callbacks
 *
 * @returns Mutation object with mutate function
 *
 * @example
 * ```tsx
 * const verifyMerchant = useVerifyMerchant();
 *
 * verifyMerchant.mutate({
 *   id: 'M123',
 *   tier: 'T1',
 *   creditScore: 85,
 *   trustScore: 80,
 *   approvedLimit: 500000
 * });
 * ```
 */
export function useVerifyMerchant(
  options?: Omit<UseMutationOptions<Merchant, Error, VerifyMerchantParams>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: VerifyMerchantParams) => {
      const { id, tier, creditScore, trustScore, approvedLimit, scoringBreakdown, force, forceReason } = params;
      // Call POST /merchants/:id/approve endpoint
      const response = await merchantService.mutate<Merchant>(`${id}/approve`, {
        tier,
        creditScore,
        trustScore,
        approvedLimit,
        scoringBreakdown,
        ...(force && { force, forceReason }),
      });
      return response;
    },
    onSuccess: (_, { id }) => {
      // Invalidate merchant queries so they refetch
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.merchant(id) });
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.creditLine(id) });
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.riskExplanation(id) });
    },
    ...options,
  });
}

export interface VerifyMerchantParams {
  id: string;
  tier: CreditTier;
  creditScore: number;
  trustScore: number;
  approvedLimit: number;
  scoringBreakdown?: Record<string, unknown>;
  force?: boolean;
  forceReason?: string;
}
