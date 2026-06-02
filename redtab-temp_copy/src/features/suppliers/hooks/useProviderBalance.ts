import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import type { PaginatedResponse, Contract } from '@/types';
import { providerBalanceApi, type ProviderOutstandingContractParams } from '../services';
import type {
  AutoRepayRunResult,
  ProviderBalance,
  ProviderBalanceTransaction,
  ProviderBalanceTransactionFilters,
} from '../types';
import type { Supplier } from '../types';

export interface AutoRepayVariables {
  providerId?: string;
}

export const providerBalanceKeys = {
  root: ['provider-balance'] as const,
  detail: (providerId?: string) => [...providerBalanceKeys.root, 'detail', providerId] as const,
  transactions: (
    providerId?: string,
    params?: ProviderBalanceTransactionFilters
  ) => [...providerBalanceKeys.root, 'transactions', providerId, params] as const,
  outstanding: (
    providerId?: string,
    params?: ProviderOutstandingContractParams
  ) => [...providerBalanceKeys.root, 'outstanding', providerId, params] as const,
};

export const useProviderBalance = <TData = ProviderBalance>(
  providerId?: string,
  options?: Omit<UseQueryOptions<ProviderBalance, Error, TData>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: providerBalanceKeys.detail(providerId),
    queryFn: () => providerBalanceApi.getBalance(providerId as string),
    enabled: Boolean(providerId) && (options?.enabled ?? true),
    ...options,
  });
};

export const useProviderBalanceTransactions = <TData = PaginatedResponse<ProviderBalanceTransaction>>(
  providerId?: string,
  params?: ProviderBalanceTransactionFilters,
  options?: Omit<UseQueryOptions<PaginatedResponse<ProviderBalanceTransaction>, Error, TData>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: providerBalanceKeys.transactions(providerId, params),
    queryFn: () => providerBalanceApi.getTransactions(providerId as string, params),
    enabled: Boolean(providerId) && (options?.enabled ?? true),
    ...options,
  });
};

export const useProviderOutstandingContracts = <TData = PaginatedResponse<Contract>>(
  providerId?: string,
  params?: ProviderOutstandingContractParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Contract>, Error, TData>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: providerBalanceKeys.outstanding(providerId, params),
    queryFn: () => providerBalanceApi.getOutstandingContracts(providerId as string, params),
    enabled: Boolean(providerId) && (options?.enabled ?? true),
    ...options,
  });
};

const convertSupplierBalanceToProviderBalance = (
  providerId?: string,
  fallback?: Supplier['supplierBalance']
): ProviderBalance | undefined => {
  if (!providerId || !fallback) {
    return undefined;
  }

  return {
    providerId,
    availableBalance: fallback.availableBalance ?? 0,
    pendingBalance: fallback.pendingBalance ?? 0,
    totalBalance: fallback.totalBalance ?? 0,
    lifetimeCredits: fallback.totalBalance ?? 0,
    lifetimeWithdrawals: 0,
    currency: fallback.currency ?? '',
    pendingReleaseDate: fallback.pendingReleaseDate,
    isFrozen: Boolean(fallback.isFrozen),
    frozenReason: fallback.frozenReason,
    updatedAt: undefined,
  };
};

type ProviderBalanceQueryOptions = Omit<
  UseQueryOptions<ProviderBalance, Error, ProviderBalance>,
  'queryKey' | 'queryFn'
>;

export const useProviderBalanceWithFallback = (
  providerId?: string,
  fallbackBalance?: Supplier['supplierBalance'],
  options?: Omit<ProviderBalanceQueryOptions, 'placeholderData'>
) => {
  const fallbackData = useMemo(
    () => convertSupplierBalanceToProviderBalance(providerId, fallbackBalance),
    [providerId, fallbackBalance]
  );

  const query = useProviderBalance(providerId, {
    ...options,
    placeholderData: fallbackData,
  });

  const normalized = query.data ?? fallbackData;

  return {
    ...query,
    providerBalance: normalized,
    fallbackData,
  };
};

export const useAutoRepay = (
  options?: UseMutationOptions<AutoRepayRunResult, Error, AutoRepayVariables | void>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation({
    ...restOptions,
    mutationFn: async (_variables?: AutoRepayVariables) => {
      return providerBalanceApi.triggerAutoRepay();
    },
    onSuccess: async (data, variables, context) => {
      if (variables?.providerId) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: providerBalanceKeys.detail(variables.providerId) }),
          queryClient.invalidateQueries({ queryKey: providerBalanceKeys.transactions(variables.providerId) }),
          queryClient.invalidateQueries({ queryKey: providerBalanceKeys.outstanding(variables.providerId) }),
        ]);
      } else {
        queryClient.invalidateQueries({ queryKey: providerBalanceKeys.root });
      }

      await onSuccess?.(data, variables, context, undefined as never);
    },
  });
};
