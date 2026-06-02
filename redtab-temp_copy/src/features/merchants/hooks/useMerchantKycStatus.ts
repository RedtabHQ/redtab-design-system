import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { merchantService } from '@/lib/apiService';
import type { KycStatusResponse } from '@types';

/**
 * Hook to fetch KYC status and document list for a merchant
 *
 * Features:
 * - Fetches KYC verification status with progress
 * - Returns document list with individual statuses
 * - Caches data for 2 minutes
 *
 * @param merchantId - Merchant ID to fetch KYC status for
 * @param options - Query options
 * @returns Query result with KYC status data
 *
 * @example
 * ```tsx
 * const { data: kycStatus, isLoading } = useMerchantKycStatus('M123');
 *
 * if (kycStatus) {
 *   console.log(`Progress: ${kycStatus.progressPercentage}%`);
 *   kycStatus.documents.forEach(doc => {
 *     console.log(`${doc.type}: ${doc.status}`);
 *   });
 * }
 * ```
 */
export function useMerchantKycStatus(
  merchantId: string | null | undefined,
  options?: Omit<UseQueryOptions<KycStatusResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['merchant', merchantId, 'kyc-status'] as const,
    queryFn: async () => {
      if (!merchantId) throw new Error('Merchant ID is required');
      return merchantService.getKycStatus(merchantId);
    },
    enabled: !!merchantId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    ...options,
  });
}
