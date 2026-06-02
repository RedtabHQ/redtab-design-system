import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { categoryService as supplierCategoryService } from '@/lib/apiService';
import type { SupplierCategory } from '@types';
import { createResourceHooks } from '@/hooks/createResourceHooks';
import { PaginatedResponse } from '@/types';

/**
 * Supplier Category-specific query parameter types for type-safe filtering
 */
export interface SupplierCategoryListParams extends Record<string, string | number | boolean | undefined> {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'name' | 'code';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
}

/**
 * Create all supplier category-related React Query hooks using the generic factory
 */
const supplierCategoryHooks = createResourceHooks<SupplierCategory>(
  'supplierCategories',
  supplierCategoryService
);

/**
 * Query keys for supplier categories - use for manual cache invalidation
 */
export const supplierCategoryKeys = supplierCategoryHooks.keys;

/**
 * Hook to fetch paginated list of supplier categories
 */
export const useSupplierCategories = (
  params?: SupplierCategoryListParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<SupplierCategory>>, 'queryKey' | 'queryFn'>
) => supplierCategoryHooks.useList(params, options);

/**
 * Hook to fetch a single supplier category by ID
 */
export const useSupplierCategory = supplierCategoryHooks.useDetail;

/**
 * Hook to create a new supplier category
 */
export const useCreateSupplierCategory = supplierCategoryHooks.useCreate;

/**
 * Hook to update a supplier category
 */
export const useUpdateSupplierCategory = supplierCategoryHooks.useUpdate;

/**
 * Hook to partially update a supplier category
 */
export const usePatchSupplierCategory = supplierCategoryHooks.usePatch;

/**
 * Hook to delete a supplier category
 */
export const useDeleteSupplierCategory = supplierCategoryHooks.useDelete;

/**
 * Hook to bulk delete supplier categories
 */
export const useBulkDeleteSupplierCategories = supplierCategoryHooks.useBulkDelete;

/**
 * Hook to fetch active supplier categories for dropdown selection
 *
 * @returns Query result with active categories
 *
 * @example
 * ```tsx
 * const { data: categories, isLoading } = useActiveSupplierCategories();
 *
 * if (isLoading) return <LoadingSpinner />;
 *
 * return (
 *   <Select
 *     options={categories?.map(cat => ({
 *       value: cat.id,
 *       label: cat.name
 *     }))}
 *   />
 * );
 * ```
 */
export const useActiveSupplierCategories = (
  options?: Omit<UseQueryOptions<SupplierCategory[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...supplierCategoryKeys.all, 'active'],
    queryFn: async () => {
      const result = await supplierCategoryService.getAll({
        status: 'ACTIVE',
        pageSize: 1000,
        page: 1,
      } as SupplierCategoryListParams);
      return result.items || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};
