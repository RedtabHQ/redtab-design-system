import { policyService, type FilterParams, type PaginationParams } from '@services';
import type { Policy } from '@types';
import { createResourceHooks } from '@/hooks/createResourceHooks';

/**
 * Policy-specific query parameter types for type-safe filtering
 */
export interface PolicyListParams extends PaginationParams, FilterParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  isActive?: boolean;
}

/**
 * Create all policy-related React Query hooks using the generic factory
 */
const policyHooks = createResourceHooks<Policy>('policies', policyService);

/**
 * Query keys for policies - use for manual cache invalidation
 */
export const policyKeys = policyHooks.keys;

/**
 * Hook to fetch paginated list of policies
 */
export const usePolicies = policyHooks.useList<PolicyListParams>;

/**
 * Hook to fetch a single policy by ID
 */
export const usePolicy = policyHooks.useDetail;

/**
 * Hook to create a new policy
 */
export const useCreatePolicy = policyHooks.useCreate;

/**
 * Hook to update a policy
 */
export const useUpdatePolicy = policyHooks.useUpdate;

/**
 * Hook to partially update a policy
 */
export const usePatchPolicy = policyHooks.usePatch;

/**
 * Hook to delete a policy
 */
export const useDeletePolicy = policyHooks.useDelete;

/**
 * Hook to bulk delete policies
 */
export const useBulkDeletePolicies = policyHooks.useBulkDelete;
