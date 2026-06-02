import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { paymentApi, type CreatePaymentData, type ProcessPaymentData } from '@services';
import type { Payment, PaymentStats, PaginatedResponse } from '@types';
import { createResourceHooks } from '@/hooks/createResourceHooks';
import type { ApiService } from '@services';

/**
 * Payment-specific query parameter types for type-safe filtering
 */
export interface PaymentListParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}

/**
 * Adapter that wraps paymentApi to satisfy the ApiService<T> interface
 * required by createResourceHooks factory. Only list/detail/create are needed.
 */
const paymentServiceAdapter = {
  getAll: (params?: Record<string, unknown>) => paymentApi.getAll(params as Parameters<typeof paymentApi.getAll>[0]) as unknown as Promise<PaginatedResponse<Payment>>,
  getById: (id: string) => paymentApi.getById(id),
  create: (data: Partial<Payment>) => paymentApi.create(data as unknown as CreatePaymentData),
  update: (_id: string, _data: Partial<Payment>) => Promise.reject(new Error('Not implemented')) as Promise<Payment>,
  patch: (_id: string, _data: Partial<Payment>) => Promise.reject(new Error('Not implemented')) as Promise<Payment>,
  delete: (_id: string) => Promise.reject(new Error('Not implemented')) as Promise<void>,
  bulkDelete: (_ids: string[]) => Promise.reject(new Error('Not implemented')) as Promise<void>,
} as ApiService<Payment>;

/**
 * Create payment CRUD hooks using the generic factory.
 * Provides consistent caching, loading states, error handling, and cache invalidation.
 */
const paymentHooks = createResourceHooks<Payment>('payments', paymentServiceAdapter);

/**
 * Query keys for payments — use for manual cache invalidation
 *
 * @example
 * ```typescript
 * queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
 * queryClient.invalidateQueries({ queryKey: paymentKeys.detail('P123') });
 * ```
 */
export const paymentKeys = {
  ...paymentHooks.keys,
  byContract: (contractId: string) => ['payments', 'byContract', contractId] as const,
  byMerchant: (merchantId: string) => ['payments', 'byMerchant', merchantId] as const,
  bySupplier: (supplierId: string, params?: Record<string, unknown>) => ['payments', 'bySupplier', supplierId, params] as const,
  statistics: () => ['payments', 'statistics'] as const,
  supplierStats: (supplierId: string, params?: Record<string, unknown>) => ['payments', 'supplierStats', supplierId, params] as const,
};

/**
 * Hook to fetch paginated list of payments
 *
 * @param params - Pagination and filter parameters
 * @param options - Additional React Query options
 * @returns Query result with payments data
 */
export const usePayments = (
  params?: PaymentListParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Payment>>, 'queryKey' | 'queryFn'>
) => paymentHooks.useList(params, options);

/**
 * Hook to fetch a single payment by ID
 *
 * @param id - Payment ID
 * @param options - Additional React Query options
 * @returns Query result with payment data
 */
export const usePayment = paymentHooks.useDetail;

/**
 * Hook to create a new payment
 *
 * Features:
 * - Automatic cache invalidation of list queries and statistics after success
 *
 * @param options - Additional mutation options
 * @returns Mutation object with mutate function
 */
export function useCreatePayment(
  options?: Omit<UseMutationOptions<Payment, Error, CreatePaymentData>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentData) => paymentApi.create(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: paymentHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.statistics() });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      (options?.onSuccess as (...a: unknown[]) => void)?.(...args);
    },
    ...options,
  });
}

// ─── Custom domain-specific hooks (not mappable to factory) ──────────────────

export interface SupplierPaymentParams {
  page?: number;
  pageSize?: number;
  paymentType?: 'SUPPLIER_SETTLEMENT' | 'MERCHANT_REPAYMENT' | 'REFUND';
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  startDate?: string;
  endDate?: string;
}

export function useSupplierPaymentStats(
  supplierId: string,
  params?: Pick<SupplierPaymentParams, 'paymentType' | 'status'>,
) {
  return useQuery({
    queryKey: paymentKeys.supplierStats(supplierId, params as Record<string, unknown>),
    queryFn: () => paymentApi.getSupplierStats(supplierId, params),
    enabled: !!supplierId,
  });
}

export function usePaymentsByContract(
  contractId: string,
  options?: Omit<UseQueryOptions<Payment[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: paymentKeys.byContract(contractId),
    queryFn: () => paymentApi.getByContract(contractId),
    enabled: !!contractId,
    ...options,
  });
}

export function usePaymentsByMerchant(
  merchantId: string,
  options?: Omit<UseQueryOptions<Payment[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: paymentKeys.byMerchant(merchantId),
    queryFn: () => paymentApi.getByMerchant(merchantId),
    enabled: !!merchantId,
    ...options,
  });
}

export function usePaymentsBySupplier(
  supplierId: string,
  params?: SupplierPaymentParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Payment>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: paymentKeys.bySupplier(supplierId, params as Record<string, unknown>),
    queryFn: () => paymentApi.getBySupplier(supplierId, params),
    enabled: !!supplierId,
    ...options,
  });
}

export function usePaymentStatistics(
  options?: Omit<UseQueryOptions<PaymentStats>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: paymentKeys.statistics(),
    queryFn: () => paymentApi.getStatistics(),
    ...options,
  });
}

export function useProcessPayment(
  options?: Omit<UseMutationOptions<Payment, Error, { paymentId: string; data?: ProcessPaymentData }>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: string; data?: ProcessPaymentData }) =>
      paymentApi.process(paymentId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paymentHooks.keys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: paymentHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.statistics() });
    },
    ...options,
  });
}

export function useRetryPayment(
  options?: Omit<UseMutationOptions<Payment, Error, string>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => paymentApi.retry(paymentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paymentHooks.keys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: paymentHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.statistics() });
    },
    ...options,
  });
}

export function useCancelPayment(
  options?: Omit<UseMutationOptions<Payment, Error, string>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => paymentApi.cancel(paymentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paymentHooks.keys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: paymentHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.statistics() });
    },
    ...options,
  });
}
