import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { merchantPortalApi, type CreditLineStatus } from '../services/merchantPortalApi';
import type { Merchant, Contract } from '@/types';

// Query keys for cache management
export const merchantPortalKeys = {
  all: ['merchantPortal'] as const,
  profile: () => [...merchantPortalKeys.all, 'profile'] as const,
  creditLine: () => [...merchantPortalKeys.all, 'creditLine'] as const,
  contracts: () => [...merchantPortalKeys.all, 'contracts'] as const,
  activeContracts: () => [...merchantPortalKeys.contracts(), 'active'] as const,
};

/**
 * Hook to fetch current merchant profile
 *
 * @example
 * ```typescript
 * const { data: merchant, isLoading, error } = useMerchantProfile();
 * ```
 */
export function useMerchantProfile(
  options?: Omit<UseQueryOptions<Merchant>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: merchantPortalKeys.profile(),
    queryFn: () => merchantPortalApi.getMyProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook to fetch merchant credit line status
 *
 * @example
 * ```typescript
 * const { data: creditLine, isLoading } = useMerchantCreditLine();
 * ```
 */
export function useMerchantCreditLine(
  options?: Omit<UseQueryOptions<CreditLineStatus>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: merchantPortalKeys.creditLine(),
    queryFn: () => merchantPortalApi.getMyCreditLine(),
    staleTime: 1 * 60 * 1000, // 1 minute (credit changes frequently)
    ...options,
  });
}

/**
 * Hook to fetch merchant contracts with optional status filter
 *
 * @example
 * ```typescript
 * const { data, isLoading } = useMerchantContracts('ACTIVE');
 * ```
 */
export function useMerchantContracts(
  status?: string,
  options?: Omit<UseQueryOptions<{ items: Contract[] }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...merchantPortalKeys.contracts(), status],
    queryFn: () => merchantPortalApi.getMyContracts(status),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Hook to fetch merchant active contracts only
 *
 * @example
 * ```typescript
 * const { data, isLoading } = useMerchantActiveContracts();
 * ```
 */
export function useMerchantActiveContracts(
  options?: Omit<UseQueryOptions<{ items: Contract[] }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: merchantPortalKeys.activeContracts(),
    queryFn: () => merchantPortalApi.getMyActiveContracts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}
