import { useQuery } from '@tanstack/react-query';
import { merchantService } from '@services';
import type { Merchant, Supplier, PaginatedResponse } from '@/types';
import { createResourceHooks } from '@/hooks/createResourceHooks';
import type { UseQueryOptions } from '@tanstack/react-query';

/**
 * Merchant-specific query parameter types for type-safe filtering
 */
export interface MerchantListParams extends Record<string, unknown> {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'name' | 'creditScore' | 'status';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  category?: string;
  tier?: 'T1' | 'T2' | 'T3';
  minCreditScore?: number;
  maxCreditScore?: number;
  marketSegmentId?: string;
}

/**
 * Create all merchant-related React Query hooks using the generic factory
 *
 * This eliminates code duplication and ensures consistent patterns across all resources.
 * All hooks include automatic caching, loading states, error handling, and cache invalidation.
 */
const merchantHooks = createResourceHooks<Merchant>('merchants', merchantService);

/**
 * Query keys for merchants - use for manual cache invalidation
 *
 * @example
 * ```typescript
 * queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
 * queryClient.invalidateQueries({ queryKey: merchantKeys.detail('M123') });
 * ```
 */
export const merchantKeys = merchantHooks.keys;

/**
 * Hook to fetch paginated list of merchants
 *
 * Features:
 * - Automatic caching with 5-minute stale time
 * - Keeps previous data visible during refetches (smooth pagination UX)
 * - Supports pagination, filtering, sorting, and search
 *
 * @param params - Type-safe pagination and filter parameters
 * @returns Query result with merchants data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, isFetching } = useMerchants({
 *   page: 1,
 *   pageSize: 30,
 *   search: 'restaurant',
 *   status: 'VERIFIED',
 *   sortBy: 'createdAt',
 *   sortOrder: 'desc'
 * });
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * const merchants = data?.items || [];
 * ```
 */
export const useMerchants = (params?: MerchantListParams, options?: Omit<UseQueryOptions<PaginatedResponse<Merchant>>, 'queryKey' | 'queryFn'>) =>
  merchantHooks.useList(params, options);

/**
 * Hook to fetch a single merchant by ID
 *
 * Features:
 * - Automatic caching
 * - Only fetches when ID is provided
 * - Can be conditionally enabled
 *
 * @param id - Merchant ID
 * @param options - Query options (e.g., { enabled: !!id })
 * @returns Query result with merchant data
 *
 * @example
 * ```tsx
 * const { data: merchant, isLoading } = useMerchant('M123');
 *
 * // Conditionally fetch
 * const { data } = useMerchant(merchantId, { enabled: !!merchantId });
 * ```
 */
export const useMerchant = merchantHooks.useDetail;

/**
 * Hook to create a new merchant
 *
 * Features:
 * - Automatic cache invalidation of list queries after success
 * - Loading and error states built-in (isPending, isError)
 * - Supports onSuccess/onError callbacks
 *
 * @returns Mutation object with mutate function
 *
 * @example
 * ```tsx
 * const createMerchant = useCreateMerchant();
 *
 * createMerchant.mutate(
 *   {
 *     name: 'New Restaurant',
 *     email: 'restaurant@example.com',
 *     phone: '+977 1234567890',
 *     status: 'PENDING'
 *   },
 *   {
 *     onSuccess: (merchant) => {
 *       console.log('Created:', merchant);
 *       alert('Merchant created successfully!');
 *     },
 *     onError: (error) => {
 *       console.error('Failed:', error);
 *       alert('Failed to create merchant');
 *     }
 *   }
 * );
 * ```
 */
export const useCreateMerchant = merchantHooks.useCreate;

/**
 * Hook to perform full update of a merchant (PUT)
 *
 * Features:
 * - Automatic cache invalidation of both list and detail queries
 * - Loading and error states built-in
 * - Supports onSuccess/onError callbacks
 *
 * @returns Mutation object with mutate function
 *
 * @example
 * ```tsx
 * const updateMerchant = useUpdateMerchant();
 *
 * updateMerchant.mutate(
 *   {
 *     id: 'M123',
 *     data: {
 *       status: 'VERIFIED',
 *       creditLimit: 100000
 *     }
 *   },
 *   {
 *     onSuccess: () => {
 *       alert('Merchant approved!');
 *     }
 *   }
 * );
 * ```
 */
export const useUpdateMerchant = merchantHooks.useUpdate;

/**
 * Hook to perform partial update of a merchant (PATCH)
 *
 * Features:
 * - Only sends changed fields to server
 * - Automatic cache invalidation of both list and detail queries
 * - Loading and error states built-in
 *
 * @returns Mutation object with mutate function
 *
 * @example
 * ```tsx
 * const patchMerchant = usePatchMerchant();
 *
 * // Only update specific fields
 * patchMerchant.mutate({
 *   id: 'M123',
 *   data: { status: 'VERIFIED' } // Only update status
 * });
 * ```
 */
export const usePatchMerchant = merchantHooks.usePatch;

/**
 * Hook to delete a merchant
 *
 * Features:
 * - Automatic cache invalidation of list queries
 * - Removes detail query from cache
 * - Loading and error states built-in
 *
 * @returns Mutation object with mutate function
 *
 * @example
 * ```tsx
 * const deleteMerchant = useDeleteMerchant();
 *
 * const handleDelete = (id: string, name: string) => {
 *   if (!confirm(`Delete ${name}?`)) return;
 *
 *   deleteMerchant.mutate(id, {
 *     onSuccess: () => {
 *       alert('Deleted successfully!');
 *     },
 *     onError: (error) => {
 *       alert('Failed to delete merchant');
 *     }
 *   });
 * };
 * ```
 */
export const useDeleteMerchant = merchantHooks.useDelete;

/**
 * Hook to delete multiple merchants at once
 *
 * Features:
 * - Automatic cache invalidation of list queries
 * - Progress tracking via isPending state
 * - Atomic operation
 *
 * @returns Mutation object with mutate function
 *
 * @example
 * ```tsx
 * const bulkDeleteMerchants = useBulkDeleteMerchants();
 *
 * const handleBulkDelete = (selectedIds: string[]) => {
 *   if (!confirm(`Delete ${selectedIds.length} merchants?`)) return;
 *
 *   bulkDeleteMerchants.mutate(selectedIds, {
 *     onSuccess: () => {
 *       alert(`Deleted ${selectedIds.length} merchants!`);
 *     }
 *   });
 * };
 * ```
 */
export const useBulkDeleteMerchants = merchantHooks.useBulkDelete;

/**
 * Hook to fetch suppliers linked to a merchant through contracts
 *
 * @param merchantId - Merchant ID
 * @param params - Pagination parameters
 * @returns Query result with linked suppliers
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useMerchantLinkedSuppliers('M123', {
 *   page: 1,
 *   pageSize: 30
 * });
 *
 * const suppliers = data?.items || [];
 * ```
 */
export const useMerchantLinkedSuppliers = (
  merchantId: string | undefined,
  params?: { page?: number; pageSize?: number }
) => {
  return useQuery({
    queryKey: ['merchants', merchantId, 'linked-suppliers', params],
    queryFn: () => merchantService.getLinkedSuppliers<Supplier>(merchantId!, params),
    enabled: !!merchantId,
    staleTime: 5 * 60 * 1000,
  });
};
