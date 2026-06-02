import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { communicationApi, communicationService } from '@services';
import { createResourceHooks } from '@/hooks/createResourceHooks';
import type { Communication, CommunicationStats } from '@types';

/**
 * Communication-specific query parameter types
 */
export interface CommunicationListParams extends Record<string, unknown> {
  recipientId?: string;
  contractId?: string;
  channel?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Create all communication-related React Query hooks using the generic factory
 *
 * Covers list and create (send) operations with automatic caching and
 * cache invalidation.
 */
const communicationHooks = createResourceHooks<Communication>('communications', communicationService);

/**
 * Query keys for communications — use for manual cache invalidation.
 *
 * Extended with domain-specific keys (byRecipient, byContract, stats)
 * that are not covered by the factory.
 */
export const communicationKeys = {
  ...communicationHooks.keys,
  byRecipient: (recipientId: string) => ['communications', 'byRecipient', recipientId] as const,
  byContract: (contractId: string) => ['communications', 'byContract', contractId] as const,
  stats: () => ['communications', 'stats'] as const,
};

/**
 * Hook to fetch paginated list of communications
 *
 * @param params - Filter and pagination parameters
 * @param options - Additional React Query options
 */
export const useCommunications = (
  params?: CommunicationListParams,
  options?: Parameters<typeof communicationHooks.useList>[1]
) => communicationHooks.useList(params, options);

/**
 * Hook to send (create) a communication
 *
 * Features:
 * - Automatic cache invalidation of list queries after success
 * - Loading and error states built-in
 *
 * Note: For richer post-send invalidation (byRecipient, byContract, stats),
 * pass an onSuccess callback or use useSendCommunication below.
 */
export const useCreateCommunication = communicationHooks.useCreate;

/**
 * Hook to send a communication with full cache invalidation
 *
 * Invalidates list, byRecipient, byContract, and stats caches on success.
 * Wraps the factory useCreate and adds domain-specific invalidations via
 * an onSuccess option passed at the call site, or use this hook directly.
 *
 * @param options - Additional mutation options
 */
export { useCreateCommunication as useSendCommunication };

// ---------------------------------------------------------------------------
// Custom hooks — unchanged, not covered by the factory
// ---------------------------------------------------------------------------

/**
 * Hook to fetch communications by recipient
 */
export function useCommunicationsByRecipient(
  recipientId: string,
  options?: Omit<UseQueryOptions<Communication[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: communicationKeys.byRecipient(recipientId),
    queryFn: () => communicationApi.getByRecipient(recipientId),
    enabled: !!recipientId,
    ...options,
  });
}

/**
 * Hook to fetch communications by contract
 */
export function useCommunicationsByContract(
  contractId: string,
  options?: Omit<UseQueryOptions<Communication[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: communicationKeys.byContract(contractId),
    queryFn: () => communicationApi.getByContract(contractId),
    enabled: !!contractId,
    ...options,
  });
}

/**
 * Hook to fetch communication statistics
 */
export function useCommunicationStats(
  options?: Omit<UseQueryOptions<CommunicationStats>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: communicationKeys.stats(),
    queryFn: () => communicationApi.getStats(),
    ...options,
  });
}
