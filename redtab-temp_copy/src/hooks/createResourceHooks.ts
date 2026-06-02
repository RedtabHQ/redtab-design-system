import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ApiService, FilterParams, PaginationParams } from '@services';
import type { PaginatedResponse } from '@types';

/**
 * Generic hook factory to create standardized React Query hooks for any resource
 *
 * This eliminates code duplication across resource-specific hooks and ensures
 * consistent patterns for queries, mutations, and cache invalidation.
 *
 * @param resourceName - The name of the resource (e.g., 'merchants', 'contracts')
 * @param service - The API service instance for this resource
 * @returns Object containing query key factory and all CRUD hooks
 *
 * @example
 * ```typescript
 * const merchantHooks = createResourceHooks<Merchant>('merchants', merchantService);
 * export const useMerchants = merchantHooks.useList;
 * export const useMerchant = merchantHooks.useDetail;
 * ```
 */
export function createResourceHooks<T>(
  resourceName: string,
  service: ApiService<T>
) {
  /**
   * Query key factory for organized cache management
   *
   * Structure:
   * - [resourceName] - All queries for this resource
   * - [resourceName, 'list'] - All list queries
   * - [resourceName, 'list', filters] - Specific list query with filters
   * - [resourceName, 'detail'] - All detail queries
   * - [resourceName, 'detail', id] - Specific detail query
   */
  const keys = {
    all: [resourceName] as const,
    lists: () => [...keys.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...keys.lists(), filters] as const,
    details: () => [...keys.all, 'detail'] as const,
    detail: (id: string) => [...keys.details(), id] as const,
  };

  /**
   * Hook to fetch paginated list of resources
   *
   * Features:
   * - Automatic caching with 5-minute stale time
   * - Keeps previous data visible during refetches (better UX)
   * - Supports pagination, filtering, sorting
   *
   * @param params - Query parameters (page, pageSize, filters, etc.)
   * @param options - Additional React Query options
   *
   * @example
   * ```typescript
   * const { data, isLoading, error } = useMerchants({
   *   page: 1,
   *   pageSize: 30,
   *   search: 'restaurant',
   *   status: 'VERIFIED'
   * });
   * ```
   */
  function useList<P extends PaginationParams & FilterParams = PaginationParams & FilterParams>(
    params?: P,
    options?: Omit<UseQueryOptions<PaginatedResponse<T>>, 'queryKey' | 'queryFn'>
  ) {
    return useQuery({
      queryKey: keys.list(params),
      queryFn: () => service.getAll(params),
      // Keep previous data visible while fetching new page (smoother UX)
      placeholderData: (previousData) => previousData,
      ...options,
    });
  }

  /**
   * Hook to fetch single resource by ID
   *
   * Features:
   * - Automatic caching
   * - Only fetches when ID is provided
   * - Can be conditionally enabled
   *
   * @param id - Resource ID
   * @param options - Additional React Query options
   *
   * @example
   * ```typescript
   * const { data: merchant, isLoading } = useMerchant('merchant-123');
   *
   * // Conditionally fetch
   * const { data } = useMerchant(id, { enabled: !!id });
   * ```
   */
  function useDetail(
    id: string,
    options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
  ) {
    return useQuery({
      queryKey: keys.detail(id),
      queryFn: () => service.getById(id),
      enabled: !!id, // Only fetch when ID is provided
      ...options,
    });
  }

  /**
   * Hook to create a new resource
   *
   * Features:
   * - Automatic cache invalidation of list queries after success
   * - Loading and error states built-in
   * - Supports onSuccess/onError callbacks
   *
   * @param options - Additional mutation options
   *
   * @example
   * ```typescript
   * const createMerchant = useCreateMerchant();
   *
   * createMerchant.mutate(
   *   { name: 'New Restaurant', email: 'test@example.com' },
   *   {
   *     onSuccess: (merchant) => {
   *       console.log('Created:', merchant);
   *       alert('Merchant created!');
   *     },
   *     onError: (error) => {
   *       alert('Failed to create merchant');
   *     }
   *   }
   * );
   * ```
   */
  function useCreate(options?: Omit<UseMutationOptions<T, Error, Partial<T>>, 'mutationFn'>) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: Partial<T>) => service.create(data),
      onSuccess: (data, variables, onMutateResult, context) => {
        // Invalidate all list queries to refetch with new item
        queryClient.invalidateQueries({ queryKey: keys.lists() });
        // Call user-provided onSuccess if exists
        if (options?.onSuccess) {
          options.onSuccess(data, variables, onMutateResult, context);
        }
      },
      ...options,
    });
  }

  /**
   * Hook to perform full update of a resource (PUT)
   *
   * Features:
   * - Automatic cache invalidation of both list and detail queries
   * - Loading and error states built-in
   * - Supports onSuccess/onError callbacks
   *
   * @param options - Additional mutation options
   *
   * @example
   * ```typescript
   * const updateMerchant = useUpdateMerchant();
   *
   * updateMerchant.mutate(
   *   { id: 'merchant-123', data: { status: 'VERIFIED' } },
   *   {
   *     onSuccess: () => {
   *       alert('Merchant approved!');
   *     }
   *   }
   * );
   * ```
   */
  function useUpdate(
    options?: Omit<UseMutationOptions<T, Error, { id: string; data: Partial<T> }>, 'mutationFn'>
  ) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
        service.update(id, data),
      onSuccess: (data, variables, onMutateResult, context) => {
        // Invalidate list queries (item might appear in different filters now)
        queryClient.invalidateQueries({ queryKey: keys.lists() });
        // Invalidate the specific item detail
        queryClient.invalidateQueries({ queryKey: keys.detail(variables.id) });
        // Call user-provided onSuccess if exists
        if (options?.onSuccess) {
          options.onSuccess(data, variables, onMutateResult, context);
        }
      },
      ...options,
    });
  }

  /**
   * Hook to perform partial update of a resource (PATCH)
   *
   * Features:
   * - Automatic cache invalidation of both list and detail queries
   * - Only sends changed fields to server
   * - Loading and error states built-in
   *
   * @param options - Additional mutation options
   *
   * @example
   * ```typescript
   * const patchMerchant = usePatchMerchant();
   *
   * // Only update specific fields
   * patchMerchant.mutate({
   *   id: 'merchant-123',
   *   data: { creditLimit: 50000 } // Only update credit limit
   * });
   * ```
   */
  function usePatch(
    options?: Omit<UseMutationOptions<T, Error, { id: string; data: Partial<T> }>, 'mutationFn'>
  ) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
        service.patch(id, data),
      onSuccess: (data, variables, onMutateResult, context) => {
        queryClient.invalidateQueries({ queryKey: keys.lists() });
        queryClient.invalidateQueries({ queryKey: keys.detail(variables.id) });
        if (options?.onSuccess) {
          options.onSuccess(data, variables, onMutateResult, context);
        }
      },
      ...options,
    });
  }

  /**
   * Hook to delete a resource
   *
   * Features:
   * - Automatic cache invalidation of list queries
   * - Loading and error states built-in
   * - Supports confirmation dialogs via onMutate
   *
   * @param options - Additional mutation options
   *
   * @example
   * ```typescript
   * const deleteMerchant = useDeleteMerchant();
   *
   * const handleDelete = (id: string, name: string) => {
   *   if (!confirm(`Delete ${name}?`)) return;
   *
   *   deleteMerchant.mutate(id, {
   *     onSuccess: () => {
   *       alert('Deleted successfully!');
   *     }
   *   });
   * };
   * ```
   */
  function useDelete(options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => service.delete(id),
      onSuccess: (data, variables, onMutateResult, context) => {
        // Invalidate list queries to refetch without deleted item
        queryClient.invalidateQueries({ queryKey: keys.lists() });
        // Remove the detail query from cache
        queryClient.removeQueries({ queryKey: keys.detail(variables) });
        // Call user-provided onSuccess if exists
        if (options?.onSuccess) {
          options.onSuccess(data, variables, onMutateResult, context);
        }
      },
      ...options,
    });
  }

  /**
   * Hook to delete multiple resources at once
   *
   * Features:
   * - Automatic cache invalidation of list queries
   * - Progress tracking via isPending state
   * - Atomic operation (all or nothing)
   *
   * @param options - Additional mutation options
   *
   * @example
   * ```typescript
   * const bulkDelete = useBulkDeleteMerchants();
   *
   * const handleBulkDelete = (selectedIds: string[]) => {
   *   if (!confirm(`Delete ${selectedIds.length} items?`)) return;
   *
   *   bulkDelete.mutate(selectedIds, {
   *     onSuccess: () => {
   *       alert(`Deleted ${selectedIds.length} items!`);
   *     }
   *   });
   * };
   * ```
   */
  function useBulkDelete(options?: Omit<UseMutationOptions<void, Error, string[]>, 'mutationFn'>) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (ids: string[]) => service.bulkDelete(ids),
      onSuccess: (data, variables, onMutateResult, context) => {
        // Invalidate list queries to refetch without deleted items
        queryClient.invalidateQueries({ queryKey: keys.lists() });
        // Remove all deleted items from detail cache
        variables.forEach(id => {
          queryClient.removeQueries({ queryKey: keys.detail(id) });
        });
        // Call user-provided onSuccess if exists
        if (options?.onSuccess) {
          options.onSuccess(data, variables, onMutateResult, context);
        }
      },
      ...options,
    });
  }

  return {
    keys,
    useList,
    useDetail,
    useCreate,
    useUpdate,
    usePatch,
    useDelete,
    useBulkDelete,
  };
}
