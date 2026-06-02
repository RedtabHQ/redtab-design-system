import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { merchantService, creditApi, paymentApi } from '@services';
import { getRiskExplanation, AiInsightResult } from '@/lib/geminiService';
import type { Merchant, CreditLine, Contract, CreditScore, Payment } from '@types';
import { MerchantStatus } from '@types';

/**
 * Query keys for merchant detail page
 */
export const merchantDetailKeys = {
  all: ['merchantDetail'] as const,
  merchant: (merchantId: string) => [...merchantDetailKeys.all, 'merchant', merchantId] as const,
  creditLine: (merchantId: string) => [...merchantDetailKeys.all, 'creditLine', merchantId] as const,
  scoringHistory: (merchantId: string) => [...merchantDetailKeys.all, 'scoringHistory', merchantId] as const,
  merchantPayments: (merchantId: string) => [...merchantDetailKeys.all, 'payments', merchantId] as const,
  riskExplanation: (merchantId: string) => [...merchantDetailKeys.all, 'riskExplanation', merchantId] as const,
};

/**
 * Hook to fetch full merchant details with error handling
 */
export function useMerchantDetail(
  merchantId: string,
  options?: Omit<UseQueryOptions<Merchant>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: merchantDetailKeys.merchant(merchantId),
    queryFn: async () => {
      return merchantService.getById(merchantId);
    },
    enabled: !!merchantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    ...options,
  });
}

/**
 * Hook to fetch credit line status for a merchant
 */
export function useMerchantCreditLine(
  merchantId: string,
  options?: Omit<UseQueryOptions<CreditLine>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: merchantDetailKeys.creditLine(merchantId),
    queryFn: async () => {
      return creditApi.getCreditLineStatus(merchantId);
    },
    enabled: !!merchantId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    ...options,
  });
}

/**
 * Hook to fetch scoring history for a merchant
 */
export function useMerchantScoringHistory(
  merchantId: string,
  options?: Omit<UseQueryOptions<CreditScore[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: merchantDetailKeys.scoringHistory(merchantId),
    queryFn: async () => {
      const response = await creditApi.getScoringHistory(merchantId);
      return response || [];
    },
    enabled: !!merchantId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    ...options,
  });
}

/**
 * Hook to fetch merchant payments
 */
export function useMerchantPayments(
  merchantId: string,
  options?: Omit<UseQueryOptions<Payment[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: merchantDetailKeys.merchantPayments(merchantId),
    queryFn: async () => {
      const response = await paymentApi.getByMerchant(merchantId);
      return response || [];
    },
    enabled: !!merchantId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    ...options,
  });
}

/**
 * Hook to approve a merchant
 */
export function useApproveMerchant(
  options?: Omit<UseMutationOptions<Merchant, Error, { merchantId: string; data?: Record<string, unknown> }>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ merchantId, data }: { merchantId: string; data?: Record<string, unknown> }) =>
      merchantService.patch(merchantId, { status: MerchantStatus.VERIFIED, ...data }),
    onSuccess: (_, { merchantId }) => {
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.merchant(merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.creditLine(merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.riskExplanation(merchantId) });
    },
    ...options,
  });
}

/**
 * Hook to reject a merchant
 */
export function useRejectMerchant(
  options?: Omit<UseMutationOptions<Merchant, Error, { merchantId: string; reason?: string }>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ merchantId, reason }: { merchantId: string; reason?: string }) =>
      merchantService.patch(merchantId, {
        status: MerchantStatus.REJECTED,
        rejectionReason: reason,
      }),
    onSuccess: (_, { merchantId }) => {
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.merchant(merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.riskExplanation(merchantId) });
    },
    ...options,
  });
}

/**
 * Hook to suspend a merchant
 */
export function useSuspendMerchant(
  options?: Omit<UseMutationOptions<Merchant, Error, { merchantId: string; reason?: string }>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ merchantId, reason }: { merchantId: string; reason?: string }) =>
      merchantService.patch(merchantId, {
        status: MerchantStatus.SUSPENDED,
        suspensionReason: reason,
      }),
    onSuccess: (_, { merchantId }) => {
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.merchant(merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.creditLine(merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.riskExplanation(merchantId) });
    },
    ...options,
  });
}

/**
 * Hook to reactivate a suspended merchant
 */
export function useReactivateMerchant(
  options?: Omit<UseMutationOptions<Merchant, Error, string>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (merchantId: string) =>
      merchantService.patch(merchantId, { status: MerchantStatus.VERIFIED }),
    onSuccess: (_, merchantId) => {
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.merchant(merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.creditLine(merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.riskExplanation(merchantId) });
    },
    ...options,
  });
}

/**
 * Hook to verify KYC for a merchant
 */
export function useVerifyMerchantKYC(
  options?: Omit<UseMutationOptions<Merchant, Error, string>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (merchantId: string) =>
      merchantService.patch(merchantId, { kycVerified: true }),
    onSuccess: (_, merchantId) => {
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.merchant(merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantDetailKeys.riskExplanation(merchantId) });
    },
    ...options,
  });
}

/**
 * Hook to fetch risk explanation for a merchant
 */
export function useRiskExplanation(
  merchant: Merchant | undefined | null,
  options?: Omit<UseQueryOptions<AiInsightResult>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: merchantDetailKeys.riskExplanation(merchant?.id || ''),
    queryFn: async (): Promise<AiInsightResult> => {
      if (!merchant) {
        return { content: 'AI assessment unavailable at this time.', generatedAt: '', cached: false };
      }
      try {
        return await getRiskExplanation(merchant);
      } catch (error) {
        console.error('Failed to load AI insight:', error);
        return { content: 'AI assessment unavailable at this time.', generatedAt: '', cached: false };
      }
    },
    enabled: !!merchant,
    staleTime: 30 * 60 * 1000, // 30 minutes — AI calls are expensive, invalidated on data changes
    gcTime: 60 * 60 * 1000, // 1 hour — keep in cache longer since refetch is costly
    retry: 1,
    ...options,
  });
}
