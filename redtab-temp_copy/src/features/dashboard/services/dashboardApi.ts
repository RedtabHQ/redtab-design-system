import { apiClient } from '@/lib/api';
import type {
  DashboardMetrics,
  TierDistribution,
  TrendData,
  Merchant,
  Supplier,
  UpcomingInstallment,
} from '@types';

export interface GetTrendsParams {
  startDate?: string;
  endDate?: string;
  interval?: 'day' | 'week' | 'month';
  days?: number;
  marketSegmentId?: string;
  timezone?: string;
}

// Portfolio Summary Types (aggregates 4 endpoints into 1)
export interface PortfolioSummary {
  overview: {
    totalMerchants: number;
    activeMerchants: number;
    totalContracts: number;
    activeContracts: number;
    totalDisbursed: number;
    totalRepaid: number;
    outstandingAmount: number;
    portfolioAtRisk: number;
    delinquencyRate: number;
    defaultRate: number;
  };
  tierDistribution: {
    T1: { count: number; totalCredit: number; avgScore: number };
    T2: { count: number; totalCredit: number; avgScore: number };
    T3: { count: number; totalCredit: number; avgScore: number };
  };
  riskMetrics: {
    totalExposure: number;
    highRiskMerchants: number;
    mediumRiskMerchants: number;
    lowRiskMerchants: number;
    concentrationRisk: number;
    defaultRate: number;
    averageUtilization: number;
  };
  paymentFlow: {
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
    totalVolume: number;
    averagePaymentSize: number;
    successRate: number;
  };
}

export const dashboardApi = {
  /**
   * Get consolidated portfolio summary (optimized endpoint)
   * Replaces 4 separate calls: overview, tier-distribution, risk-metrics, payment-flow
   */
  async getPortfolioSummary(marketSegmentId?: string): Promise<PortfolioSummary> {
    if (marketSegmentId) {
      return apiClient.get<PortfolioSummary>('/portfolio/summary', { params: { marketSegmentId } });
    }
    return apiClient.get<PortfolioSummary>('/portfolio/summary');
  },

  /**
   * Get portfolio overview metrics
   */
  async getOverview(marketSegmentId?: string): Promise<DashboardMetrics> {
    if (marketSegmentId) {
      return apiClient.get<DashboardMetrics>('/portfolio/overview', { params: { marketSegmentId } });
    }
    return apiClient.get<DashboardMetrics>('/portfolio/overview');
  },

  /**
   * Get tier distribution
   */
  async getTierDistribution(marketSegmentId?: string): Promise<TierDistribution[]> {
    if (marketSegmentId) {
      return apiClient.get<TierDistribution[]>('/portfolio/tier-distribution', { params: { marketSegmentId } });
    }
    return apiClient.get<TierDistribution[]>('/portfolio/tier-distribution');
  },

  /**
   * Get risk metrics
   */
  async getRiskMetrics(marketSegmentId?: string): Promise<{
    portfolioAtRisk: number;
    par30: number;
    par60: number;
    par90: number;
    delinquencyRate: number;
    defaultRate: number;
  }> {
    if (marketSegmentId) {
      return apiClient.get<{
        portfolioAtRisk: number;
        par30: number;
        par60: number;
        par90: number;
        delinquencyRate: number;
        defaultRate: number;
      }>('/portfolio/risk-metrics', { params: { marketSegmentId } });
    }
    return apiClient.get<{
      portfolioAtRisk: number;
      par30: number;
      par60: number;
      par90: number;
      delinquencyRate: number;
      defaultRate: number;
    }>('/portfolio/risk-metrics');
  },

  /**
   * Get payment flow metrics
   */
  async getPaymentFlow(marketSegmentId?: string): Promise<{
    totalDisbursed: number;
    totalRepaid: number;
    pendingDisbursements: number;
    expectedRepayments: number;
  }> {
    if (marketSegmentId) {
      return apiClient.get<{
        totalDisbursed: number;
        totalRepaid: number;
        pendingDisbursements: number;
        expectedRepayments: number;
      }>('/portfolio/payment-flow', { params: { marketSegmentId } });
    }
    return apiClient.get<{
      totalDisbursed: number;
      totalRepaid: number;
      pendingDisbursements: number;
      expectedRepayments: number;
    }>('/portfolio/payment-flow');
  },

  /**
   * Get top merchants
   */
  async getTopMerchants(limit: number = 10, marketSegmentId?: string): Promise<Merchant[]> {
    const params = { limit, ...(marketSegmentId && { marketSegmentId }) };
    return apiClient.get<Merchant[]>('/portfolio/top-merchants', { params });
  },

  /**
   * Get top suppliers
   */
  async getTopSuppliers(limit: number = 10, marketSegmentId?: string): Promise<Supplier[]> {
    const params = { limit, ...(marketSegmentId && { marketSegmentId }) };
    return apiClient.get<Supplier[]>('/portfolio/top-suppliers', { params });
  },

  /**
   * Get trend data
   */
  async getTrends(params?: GetTrendsParams & { marketSegmentId?: string }): Promise<TrendData[]> {
    return apiClient.get<TrendData[]>('/portfolio/trends', { params });
  },

  /**
   * Get average decision time metrics
   */
  async getDecisionTime(marketSegmentId?: string): Promise<{
    averageDecisionTimeMinutes: number;
    totalDecisions: number;
    avgApprovedTime: number;
    avgRejectedTime: number;
  }> {
    if (marketSegmentId) {
      return apiClient.get<{
        averageDecisionTimeMinutes: number;
        totalDecisions: number;
        avgApprovedTime: number;
        avgRejectedTime: number;
      }>('/portfolio/decision-time', { params: { marketSegmentId } });
    }
    return apiClient.get<{
      averageDecisionTimeMinutes: number;
      totalDecisions: number;
      avgApprovedTime: number;
      avgRejectedTime: number;
    }>('/portfolio/decision-time');
  },

  /**
   * Get upcoming installments summary (statistics)
   */
  async getUpcomingInstallmentsSummary(marketSegmentId?: string): Promise<{ totalAmountDue: number; totalAmountDueCurrency: string; currencySymbol: string; nextDueDate: string | null }> {
    return apiClient.get('/portfolio/upcoming-installments/summary', { params: { marketSegmentId } });
  },

  /**
   * Get paginated upcoming installments list
   */
  async getUpcomingInstallmentsList(params?: { limit?: number; page?: number; marketSegmentId?: string }): Promise<{ items: UpcomingInstallment[]; meta: { page: number; pageSize: number; total: number; totalPages: number } }> {
    return apiClient.get('/portfolio/upcoming-installments', { params });
  },
};
