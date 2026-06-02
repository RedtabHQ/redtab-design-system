import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { dashboardApi } from '@/features/dashboard/services/dashboardApi';
import type { DashboardMetrics } from '@types';
import type { TierDistribution as TierDistributionAPI } from '@types';

// Types
interface RiskMetrics {
  totalExposure: number;
  highRiskMerchants: number;
  mediumRiskMerchants: number;
  lowRiskMerchants: number;
  concentrationRisk: number;
  defaultRate: number;
  averageUtilization: number;
}

interface TierStats {
  count: number;
  totalCredit: number;
  avgScore: number;
}

interface PortfolioOverview {
  totalMerchants: number;
  activeMerchants: number;
  totalSuppliers: number;
  activeSuppliers: number;
  totalCreditExposed: number;
  totalUtilization: number;
  averageCreditScore: number;
  portfolioHealthScore: number;
}

interface TierDistribution {
  T1: TierStats;
  T2: TierStats;
  T3: TierStats;
}

// Query keys
export const portfolioKeys = {
  all: ['portfolio'] as const,
  overview: (marketSegmentId?: string | null) => [...portfolioKeys.all, 'overview', marketSegmentId] as const,
  riskMetrics: (marketSegmentId?: string | null) => [...portfolioKeys.all, 'riskMetrics', marketSegmentId] as const,
  tierDistribution: (marketSegmentId?: string | null) => [...portfolioKeys.all, 'tierDistribution', marketSegmentId] as const,
};

// Hooks
export function usePortfolioOverview(
  marketSegmentId?: string | null,
  options?: Omit<UseQueryOptions<PortfolioOverview>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: portfolioKeys.overview(marketSegmentId),
    queryFn: async () => {
      const data = await dashboardApi.getOverview(marketSegmentId ?? undefined);
      const metrics = data as DashboardMetrics;
      return {
        totalMerchants: metrics.totalMerchants,
        activeMerchants: metrics.activeMerchants,
        totalSuppliers: 0,
        activeSuppliers: 0,
        totalCreditExposed: metrics.totalDisbursed,
        totalUtilization: metrics.outstandingAmount,
        averageCreditScore: 0,
        portfolioHealthScore: 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useRiskMetrics(
  marketSegmentId?: string | null,
  options?: Omit<UseQueryOptions<RiskMetrics>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: portfolioKeys.riskMetrics(marketSegmentId),
    queryFn: async () => {
      const data = await dashboardApi.getRiskMetrics(marketSegmentId ?? undefined);
      return {
        totalExposure: data.portfolioAtRisk,
        highRiskMerchants: 0,
        mediumRiskMerchants: 0,
        lowRiskMerchants: 0,
        concentrationRisk: 0,
        defaultRate: data.defaultRate,
        averageUtilization: data.delinquencyRate,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useTierDistribution(
  marketSegmentId?: string | null,
  options?: Omit<UseQueryOptions<TierDistribution>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: portfolioKeys.tierDistribution(marketSegmentId),
    queryFn: async () => {
      const data = await dashboardApi.getTierDistribution(marketSegmentId ?? undefined);

      // Convert array of tier distributions to object format
      const result: TierDistribution = {
        T1: { count: 0, totalCredit: 0, avgScore: 0 },
        T2: { count: 0, totalCredit: 0, avgScore: 0 },
        T3: { count: 0, totalCredit: 0, avgScore: 0 },
      };

      // Map API response to our format
      data.forEach((tier: TierDistributionAPI) => {
        if (tier.tier === 'T1') {
          result.T1 = {
            count: tier.count,
            totalCredit: tier.totalLimit,
            avgScore: tier.utilization,
          };
        } else if (tier.tier === 'T2') {
          result.T2 = {
            count: tier.count,
            totalCredit: tier.totalLimit,
            avgScore: tier.utilization,
          };
        } else if (tier.tier === 'T3') {
          result.T3 = {
            count: tier.count,
            totalCredit: tier.totalLimit,
            avgScore: tier.utilization,
          };
        }
      });

      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Export types
export type { PortfolioOverview, RiskMetrics, TierStats, TierDistribution };
