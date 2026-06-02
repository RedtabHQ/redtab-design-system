import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { supplierService } from '@services';
import type { Supplier, SettlementMode, Merchant, PaginatedResponse } from '@/types';
import { createResourceHooks } from '@/hooks/createResourceHooks';

/**
 * Supplier-specific query parameter types for type-safe filtering
 */
export interface SupplierListParams extends Record<string, unknown> {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'name' | 'supplierFeeRate';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  supplierCategoryId?: string;
  isVerified?: boolean;
  settlementMode?: SettlementMode;
  minFeeRate?: number;
  maxFeeRate?: number;
  marketSegmentId?: string;
}

/**
 * Create all supplier-related React Query hooks using the generic factory
 */
const supplierHooks = createResourceHooks<Supplier>('suppliers', supplierService);

/**
 * Query keys for suppliers - use for manual cache invalidation
 */
export const supplierKeys = supplierHooks.keys;

/**
 * Hook to fetch paginated list of suppliers
 */
export const useSuppliers = (params?: SupplierListParams, options?: Omit<UseQueryOptions<PaginatedResponse<Supplier>>, 'queryKey' | 'queryFn'>) =>
  supplierHooks.useList(params, options);

/**
 * Hook to fetch a single supplier by ID
 */
export const useSupplier = supplierHooks.useDetail;

/**
 * Hook to create a new supplier
 */
export const useCreateSupplier = supplierHooks.useCreate;

/**
 * Hook to update a supplier
 */
export const useUpdateSupplier = supplierHooks.useUpdate;

/**
 * Hook to partially update a supplier
 */
export const usePatchSupplier = supplierHooks.usePatch;

/**
 * Hook to delete a supplier
 */
export const useDeleteSupplier = supplierHooks.useDelete;

/**
 * Hook to bulk delete suppliers
 */
export const useBulkDeleteSuppliers = supplierHooks.useBulkDelete;

/**
 * Hook to fetch merchants linked to a supplier through contracts
 *
 * @param supplierId - Supplier ID
 * @param params - Pagination parameters
 * @returns Query result with linked merchants
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useSupplierLinkedMerchants('S123', {
 *   page: 1,
 *   pageSize: 30
 * });
 *
 * if (isLoading) return <LoadingSpinner />;
 *
 * const merchants = data?.items || [];
 * ```
 */
export const useSupplierLinkedMerchants = (
  supplierId: string,
  params?: { page?: number; pageSize?: number }
) => {
  return useQuery({
    queryKey: ['suppliers', supplierId, 'linked-merchants', params],
    queryFn: () => supplierService.getLinkedMerchants<Merchant>(supplierId, params),
    enabled: !!supplierId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to block a supplier
 *
 * @param options - Mutation options
 * @returns Mutation for blocking a supplier
 *
 * @example
 * ```tsx
 * const blockSupplierMutation = useBlockSupplier();
 *
 * const handleBlock = async () => {
 *   await blockSupplierMutation.mutateAsync({
 *     supplierId: 'S123',
 *     reason: 'Fraudulent activity'
 *   });
 * };
 * ```
 */
export const useBlockSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ supplierId, reason }: { supplierId: string; reason: string }) =>
      supplierService.blockSupplier(supplierId, reason),
    onSuccess: (data) => {
      // Invalidate supplier queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

/**
 * Hook to unblock a supplier
 *
 * @param options - Mutation options
 * @returns Mutation for unblocking a supplier
 *
 * @example
 * ```tsx
 * const unblockSupplierMutation = useUnblockSupplier();
 *
 * const handleUnblock = async () => {
 *   await unblockSupplierMutation.mutateAsync({
 *     supplierId: 'S123',
 *     reason: 'Issue resolved'
 *   });
 * };
 * ```
 */
export const useUnblockSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ supplierId, reason }: { supplierId: string; reason: string }) =>
      supplierService.unblockSupplier(supplierId, reason),
    onSuccess: (data) => {
      // Invalidate supplier queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};
