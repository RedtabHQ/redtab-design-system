import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@services';

/**
 * Upcoming payment obligations response structure
 */
export interface UpcomingObligations {
  merchantId: string;
  windowDays: number;
  startDate?: string;
  endDate?: string;
  totals: {
    installmentsCount: number;
    principalFeeDue: number;
    principalFeeDueUsd?: number;
    penaltyDue: number;
    penaltyDueUsd?: number;
    totalOutstanding: number;
    totalOutstandingUsd?: number;
  };
  breakdown: Array<{
    currency: string;
    installmentsCount: number;
    principalFeeDue: number;
    principalFeeDueUsd?: number;
    penaltyDue: number;
    penaltyDueUsd?: number;
    totalOutstanding: number;
    totalOutstandingUsd?: number;
  }>;

  breakpoints: Array<{
    days: number;
    installmentsCount: number;
    principalFeeDue: number;
    principalFeeDueUsd?: number;
    penaltyDue: number;
    penaltyDueUsd?: number;
    totalOutstanding: number;
    totalOutstandingUsd?: number;
  }>;
}

/**
 * Query keys for upcoming obligations
 */
export const upcomingObligationsKeys = {
  all: ['upcomingObligations'] as const,
  byMerchant: (merchantId: string, days: number) =>
    [...upcomingObligationsKeys.all, merchantId, days] as const,
};

/**
 * Hook to fetch upcoming payment obligations for a merchant
 * @param merchantId - Merchant ID
 * @param days - Number of days to look ahead (1-365, default: 90)
 * @param options - React Query options
 * @returns Query result with upcoming obligations data
 */
export function useUpcomingObligations(
  merchantId: string,
  days: number = 90,
  options?: Omit<UseQueryOptions<UpcomingObligations>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: upcomingObligationsKeys.byMerchant(merchantId, days),
    queryFn: async () => {
      const response = await apiClient.get<UpcomingObligations>(
        `/merchants/${merchantId}/upcoming-obligations`,
        {
          params: { days },
        }
      );
      return response;
    },
    enabled: !!merchantId && days >= 1 && days <= 365,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    ...options,
  });
}
