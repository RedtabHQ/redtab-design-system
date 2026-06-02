import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { transactionService, type FilterParams, type PaginationParams } from '@services';
import { apiClient } from '@/lib/api';
import type { Transaction, TransactionType, PaginatedResponse } from '@types';
import { createResourceHooks } from './createResourceHooks';

/**
 * Transaction-specific query parameter types for type-safe filtering
 */
export interface TransactionListParams extends PaginationParams, FilterParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'timestamp' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  type?: TransactionType;
  marketSegmentId?: string;
  status?: 'COMPLETED' | 'PENDING' | 'FAILED';
  merchantId?: string;
  contractId?: string;
  supplierId?: string;
  reconciled?: boolean;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  paymentChannel?: string;
}

/**
 * Create all transaction-related React Query hooks using the generic factory
 */
const transactionHooks = createResourceHooks<Transaction>('transactions', transactionService);

/**
 * Query keys for transactions - use for manual cache invalidation
 */
export const transactionKeys = transactionHooks.keys;

/**
 * Hook to fetch paginated list of transactions
 */
export const useTransactions = transactionHooks.useList<TransactionListParams>;

/**
 * Hook to fetch a single transaction by ID
 */
export const useTransaction = transactionHooks.useDetail;

/**
 * Hook to create a new transaction
 */
export const useCreateTransaction = transactionHooks.useCreate;

/**
 * Hook to update a transaction
 */
export const useUpdateTransaction = transactionHooks.useUpdate;

/**
 * Hook to partially update a transaction
 */
export const usePatchTransaction = transactionHooks.usePatch;

/**
 * Hook to delete a transaction
 */
export const useDeleteTransaction = transactionHooks.useDelete;

/**
 * Hook to bulk delete transactions
 */
export const useBulkDeleteTransactions = transactionHooks.useBulkDelete;

/**
 * Hook to fetch transactions scoped to a supplier
 * Uses GET /transactions/supplier/:supplierId
 */
export const useSupplierTransactions = (
  supplierId: string,
  params?: Omit<TransactionListParams, 'supplierId'>,
  options?: Omit<UseQueryOptions<PaginatedResponse<Transaction>>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: ['transactions', 'supplier', supplierId, params],
    queryFn: () => transactionService.getBySupplier(supplierId, params),
    enabled: !!supplierId,
    ...options,
  });

/**
 * Hook to fetch transactions scoped to a merchant
 * Uses GET /transactions/merchant/:merchantId
 */
export const useMerchantTransactions = (
  merchantId: string,
  params?: Omit<TransactionListParams, 'merchantId'>,
  options?: Omit<UseQueryOptions<PaginatedResponse<Transaction>>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: ['transactions', 'merchant', merchantId, params],
    queryFn: () => transactionService.getByMerchant(merchantId, params),
    enabled: !!merchantId,
    ...options,
  });

/**
 * Hook to fetch total volume of transactions matching filters
 * Uses GET /transactions/volume
 */
export const useTransactionVolume = (
  filters?: Omit<TransactionListParams, 'page' | 'pageSize'>,
  options?: Omit<UseQueryOptions<{ volume: number }>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: ['transactions', 'volume', filters],
    queryFn: async () => {
      const response = await apiClient.get<{ volume: number }>('/transactions/volume', { params: filters });
      return response;
    },
    ...options,
  });

/**
 * Hook to fetch KPI metrics (outbound/inbound volumes) for transactions
 * Uses GET /transactions/kpis
 */
export const useTransactionKPIs = (
  filters?: Omit<TransactionListParams, 'page' | 'pageSize' | 'type'> & { marketSegmentId?: string },
  options?: Omit<UseQueryOptions<{ outbound: number; inbound: number; total: number }>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: ['transactions', 'kpis', filters],
    queryFn: async () => {
      const response = await apiClient.get<{ outbound: number; inbound: number; total: number }>(
        '/transactions/kpis',
        { params: filters }
      );
      return response;
    },
    ...options,
  });

export type TransactionFlowRange = '7D' | '30D' | '90D' | 'YTD' | 'ALL';

export const useTransactionFlowDynamics = (
  filters?: Omit<TransactionListParams, 'page' | 'pageSize' | 'type' | 'startDate' | 'endDate'> & {
    range?: TransactionFlowRange;
    marketSegmentId?: string;
    timezone?: string;
  },
  options?: Omit<
    UseQueryOptions<{
      range: TransactionFlowRange;
      granularity: 'day' | 'month';
      points: Array<{
        bucketStart: string;
        label: string;
        outbound: number;
        inbound: number;
        total: number;
        net: number;
      }>;
    }>,
    'queryKey' | 'queryFn'
  >
) =>
  useQuery({
    queryKey: ['transactions', 'flow-dynamics', filters],
    queryFn: async () => {
      const response = await apiClient.get<{
        range: TransactionFlowRange;
        granularity: 'day' | 'month';
        points: Array<{
          bucketStart: string;
          label: string;
          outbound: number;
          inbound: number;
          total: number;
          net: number;
        }>;
      }>('/transactions/flow-dynamics', { params: filters });
      return response;
    },
    ...options,
  });
