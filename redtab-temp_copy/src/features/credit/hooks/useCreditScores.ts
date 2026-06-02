import { creditScoreService, type FilterParams, type PaginationParams } from '@services';
import type { CreditScore } from '@types';
import { createResourceHooks } from '@/hooks/createResourceHooks';

/**
 * Credit score-specific query parameter types for type-safe filtering
 */
export interface CreditScoreListParams extends PaginationParams, FilterParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'overallScore' | 'merchantId';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  minScore?: number;
  maxScore?: number;
  merchantId?: string;
}

/**
 * Create all credit score-related React Query hooks using the generic factory
 */
const creditScoreHooks = createResourceHooks<CreditScore>('credit-scores', creditScoreService);

/**
 * Query keys for credit scores - use for manual cache invalidation
 */
export const creditScoreKeys = creditScoreHooks.keys;

/**
 * Hook to fetch paginated list of credit scores
 */
export const useCreditScores = creditScoreHooks.useList<CreditScoreListParams>;

/**
 * Hook to fetch a single credit score by ID
 */
export const useCreditScore = creditScoreHooks.useDetail;

/**
 * Hook to create a new credit score
 */
export const useCreateCreditScore = creditScoreHooks.useCreate;

/**
 * Hook to update a credit score
 */
export const useUpdateCreditScore = creditScoreHooks.useUpdate;

/**
 * Hook to partially update a credit score
 */
export const usePatchCreditScore = creditScoreHooks.usePatch;

/**
 * Hook to delete a credit score
 */
export const useDeleteCreditScore = creditScoreHooks.useDelete;

/**
 * Hook to bulk delete credit scores
 */
export const useBulkDeleteCreditScores = creditScoreHooks.useBulkDelete;
