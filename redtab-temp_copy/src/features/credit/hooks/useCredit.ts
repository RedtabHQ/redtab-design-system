import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { creditApi, type DrawdownData, type PostRepaymentData, type EligibilityParams } from '@services';
import type { Contract, CreditLine, CreditDecision, EligibilityResult, Repayment } from '@types';
import { contractKeys } from '@/features/contracts/hooks/useContracts';
import { scheduleKeys } from '@/features/contracts/hooks/useSchedules';

export const creditKeys = {
  all: ['credit'] as const,
  line: (merchantId: string) => [...creditKeys.all, 'line', merchantId] as const,
  decision: (merchantId: string) => [...creditKeys.all, 'decision', merchantId] as const,
  eligibility: (params: EligibilityParams) => [...creditKeys.all, 'eligibility', params] as const,
  repayments: (merchantId: string) => [...creditKeys.all, 'repayments', merchantId] as const,
};

/**
 * Hook to fetch credit line status for a merchant
 */
export function useCreditLineStatus(
  merchantId: string,
  options?: Omit<UseQueryOptions<CreditLine>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: creditKeys.line(merchantId),
    queryFn: () => creditApi.getCreditLineStatus(merchantId),
    enabled: !!merchantId,
    ...options,
  });
}

/**
 * Hook to get credit decision for a merchant
 */
export function useCreditDecision(
  merchantId: string,
  options?: Omit<UseQueryOptions<CreditDecision>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: creditKeys.decision(merchantId),
    queryFn: () => creditApi.getCreditDecision(merchantId),
    enabled: !!merchantId,
    ...options,
  });
}

/**
 * Hook to check merchant eligibility
 */
export function useEligibility(
  params: EligibilityParams,
  options?: Omit<UseQueryOptions<EligibilityResult>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: creditKeys.eligibility(params),
    queryFn: () => creditApi.checkEligibility(params),
    enabled: !!params.merchantId && !!params.supplierId,
    ...options,
  });
}

/**
 * Hook to get repayment history for a merchant
 */
export function useRepayments(
  merchantId: string,
  options?: Omit<UseQueryOptions<Repayment[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: creditKeys.repayments(merchantId),
    queryFn: () => creditApi.getRepayments(merchantId),
    enabled: !!merchantId,
    ...options,
  });
}

/**
 * Hook to process credit drawdown
 */
export function useDrawdown(
  options?: Omit<UseMutationOptions<Contract, Error, { merchantId: string; data: DrawdownData }>, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: ({ merchantId, data }: { merchantId: string; data: DrawdownData }) =>
      creditApi.drawdown({ merchantId, ...data }),
    onSuccess: (data, variables, context) => {
      const merchantId = variables.merchantId;
      queryClient.invalidateQueries({ queryKey: creditKeys.line(merchantId) });
      onSuccess?.(data, variables, context, {} as any);
    },
    ...restOptions,
  });
}

/**
 * Hook to post repayment
 */
export function usePostRepayment(
  options?: Omit<UseMutationOptions<Repayment, Error, PostRepaymentData>, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: (data: PostRepaymentData) => creditApi.postRepayment(data),
    onSuccess: (data, variables, context) => {
      // Invalidate all credit-related queries
      queryClient.invalidateQueries({ queryKey: creditKeys.all });

      if (variables?.contractId) {
        queryClient.invalidateQueries({ queryKey: contractKeys.detail(variables.contractId) });
        queryClient.invalidateQueries({ queryKey: scheduleKeys.all(variables.contractId) });
        queryClient.invalidateQueries({ queryKey: scheduleKeys.nextDue(variables.contractId) });
        queryClient.invalidateQueries({ queryKey: scheduleKeys.summary(variables.contractId) });
        // Invalidate lifecycle events to refresh with new repayment event
        queryClient.invalidateQueries({ queryKey: ['contracts', variables.contractId, 'lifecycle-events'] });
      }

      onSuccess?.(data, variables, context, {} as any);
    },
    ...restOptions,
  });
}

export function useCreditTiers() {
  return useQuery({
    queryKey: ['credit-tiers'],
    queryFn: () => creditApi.getCreditTiers(),
  });
}
