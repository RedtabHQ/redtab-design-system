import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/features/dashboard/services/dashboardApi';
import type { GetTrendsParams, PortfolioSummary } from '@/features/dashboard/services/dashboardApi';

/**
 * Dashboard-specific query keys
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: (marketSegmentId?: string) => [...dashboardKeys.all, 'summary', marketSegmentId] as const,
  overview: (marketSegmentId?: string) => [...dashboardKeys.all, 'overview', marketSegmentId] as const,
  tierDistribution: (marketSegmentId?: string) => [...dashboardKeys.all, 'tier-distribution', marketSegmentId] as const,
  riskMetrics: (marketSegmentId?: string) => [...dashboardKeys.all, 'risk-metrics', marketSegmentId] as const,
  paymentFlow: (marketSegmentId?: string) => [...dashboardKeys.all, 'payment-flow', marketSegmentId] as const,
  topMerchants: (limit?: number) => [...dashboardKeys.all, 'top-merchants', limit] as const,
  topSuppliers: (limit?: number) => [...dashboardKeys.all, 'top-suppliers', limit] as const,
  trends: (params?: GetTrendsParams) => [...dashboardKeys.all, 'trends', params] as const,
  decisionTime: (marketSegmentId?: string) => [...dashboardKeys.all, 'decision-time', marketSegmentId] as const,
  upcomingInstallments: (params?: { limit?: number; page?: number; marketSegmentId?: string }) => [...dashboardKeys.all, 'upcoming-installments', params?.limit, params?.page, params?.marketSegmentId] as const,
};

/**
 * Hook to fetch consolidated portfolio summary (optimized)
 * Replaces 4 separate queries with a single call (80% faster)
 */
export const usePortfolioSummary = (marketSegmentId?: string) => {
  return useQuery({
    queryKey: dashboardKeys.summary(marketSegmentId),
    queryFn: () => dashboardApi.getPortfolioSummary(marketSegmentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch portfolio overview metrics
 */
export const useOverview = (marketSegmentId?: string) => {
  return useQuery({
    queryKey: dashboardKeys.overview(marketSegmentId),
    queryFn: () => dashboardApi.getOverview(marketSegmentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch tier distribution
 */
export const useTierDistribution = (marketSegmentId?: string) => {
  return useQuery({
    queryKey: dashboardKeys.tierDistribution(marketSegmentId),
    queryFn: () => dashboardApi.getTierDistribution(marketSegmentId),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch risk metrics
 */
export const useRiskMetrics = (marketSegmentId?: string) => {
  return useQuery({
    queryKey: dashboardKeys.riskMetrics(marketSegmentId),
    queryFn: () => dashboardApi.getRiskMetrics(marketSegmentId),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch payment flow metrics
 */
export const usePaymentFlow = (marketSegmentId?: string) => {
  return useQuery({
    queryKey: dashboardKeys.paymentFlow(marketSegmentId),
    queryFn: () => dashboardApi.getPaymentFlow(marketSegmentId),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch top merchants
 */
export const useTopMerchants = (limit: number = 10) => {
  return useQuery({
    queryKey: dashboardKeys.topMerchants(limit),
    queryFn: () => dashboardApi.getTopMerchants(limit),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch top suppliers
 */
export const useTopSuppliers = (limit: number = 10) => {
  return useQuery({
    queryKey: dashboardKeys.topSuppliers(limit),
    queryFn: () => dashboardApi.getTopSuppliers(limit),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch trend data
 */
export const useTrends = (params?: GetTrendsParams) => {
  return useQuery({
    queryKey: dashboardKeys.trends(params),
    queryFn: () => dashboardApi.getTrends(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch average decision time metrics
 */
export const useDecisionTime = (marketSegmentId?: string) => {
  return useQuery({
    queryKey: dashboardKeys.decisionTime(marketSegmentId),
    queryFn: () => dashboardApi.getDecisionTime(marketSegmentId),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch upcoming installments summary (statistics only)
 */
export const useUpcomingInstallmentsSummary = (marketSegmentId?: string) => {
  return useQuery({
    queryKey: [...dashboardKeys.upcomingInstallments({}), 'summary', marketSegmentId],
    queryFn: () => dashboardApi.getUpcomingInstallmentsSummary(marketSegmentId),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch paginated upcoming installments list
 */
export const useUpcomingInstallmentsList = (params?: { limit?: number; page?: number; marketSegmentId?: string }) => {
  return useQuery({
    queryKey: dashboardKeys.upcomingInstallments(params),
    queryFn: () => dashboardApi.getUpcomingInstallmentsList(params),
    staleTime: 2 * 60 * 1000,
  });
};

