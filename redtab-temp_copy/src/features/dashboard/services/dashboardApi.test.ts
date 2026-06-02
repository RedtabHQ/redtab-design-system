import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dashboardApi } from './dashboardApi';
import { apiClient } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('dashboardApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOverview', () => {
    it('should fetch portfolio overview metrics', async () => {
      const mockMetrics = {
        totalMerchants: 50,
        activeMerchants: 45,
        totalContracts: 150,
        activeContracts: 140,
        totalDisbursed: 5000000,
        totalRepaid: 2500000,
        outstandingAmount: 2500000,
        portfolioAtRisk: 10,
        delinquencyRate: 6.67,
        defaultRate: 0.67,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockMetrics);

      const result = await dashboardApi.getOverview();

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/overview');
      expect(result).toEqual(mockMetrics);
    });

    it('should handle error when fetching overview', async () => {
      const mockError = new Error('Failed to fetch overview');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(dashboardApi.getOverview()).rejects.toThrow('Failed to fetch overview');
    });
  });

  describe('getTierDistribution', () => {
    it('should fetch tier distribution data', async () => {
      const mockDistribution = [
        { tier: 'A', count: 20, percentage: 40 },
        { tier: 'B', count: 15, percentage: 30 },
        { tier: 'C', count: 10, percentage: 20 },
        { tier: 'D', count: 5, percentage: 10 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockDistribution);

      const result = await dashboardApi.getTierDistribution();

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/tier-distribution');
      expect(result).toEqual(mockDistribution);
    });

    it('should handle empty tier distribution', async () => {
      vi.mocked(apiClient.get).mockResolvedValue([]);

      const result = await dashboardApi.getTierDistribution();

      expect(result).toEqual([]);
    });
  });

  describe('getRiskMetrics', () => {
    it('should fetch risk metrics', async () => {
      const mockRiskMetrics = {
        portfolioAtRisk: 15000,
        par30: 5.2,
        par60: 3.1,
        par90: 1.8,
        delinquencyRate: 4.5,
        defaultRate: 1.2,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockRiskMetrics);

      const result = await dashboardApi.getRiskMetrics();

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/risk-metrics');
      expect(result).toEqual(mockRiskMetrics);
    });

    it('should handle error when fetching risk metrics', async () => {
      const mockError = new Error('Unable to calculate risk metrics');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(dashboardApi.getRiskMetrics()).rejects.toThrow('Unable to calculate risk metrics');
    });
  });

  describe('getPaymentFlow', () => {
    it('should fetch payment flow metrics', async () => {
      const mockPaymentFlow = {
        totalDisbursed: 500000,
        totalRepaid: 350000,
        pendingDisbursements: 50000,
        expectedRepayments: 200000,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockPaymentFlow);

      const result = await dashboardApi.getPaymentFlow();

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/payment-flow');
      expect(result).toEqual(mockPaymentFlow);
    });

    it('should handle error when fetching payment flow', async () => {
      const mockError = new Error('Payment flow data unavailable');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(dashboardApi.getPaymentFlow()).rejects.toThrow('Payment flow data unavailable');
    });
  });

  describe('getTopMerchants', () => {
    it('should fetch top merchants with default limit', async () => {
      const mockMerchants = [
        { id: '1', name: 'Merchant A', totalBorrowed: 100000 },
        { id: '2', name: 'Merchant B', totalBorrowed: 90000 },
        { id: '3', name: 'Merchant C', totalBorrowed: 80000 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockMerchants);

      const result = await dashboardApi.getTopMerchants();

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/top-merchants', {
        params: { limit: 10 },
      });
      expect(result).toEqual(mockMerchants);
    });

    it('should fetch top merchants with custom limit', async () => {
      const mockMerchants = [
        { id: '1', name: 'Merchant A', totalBorrowed: 100000 },
        { id: '2', name: 'Merchant B', totalBorrowed: 90000 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockMerchants);

      const result = await dashboardApi.getTopMerchants(5);

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/top-merchants', {
        params: { limit: 5 },
      });
      expect(result).toEqual(mockMerchants);
    });

    it('should handle empty merchant list', async () => {
      vi.mocked(apiClient.get).mockResolvedValue([]);

      const result = await dashboardApi.getTopMerchants();

      expect(result).toEqual([]);
    });
  });

  describe('getTopSuppliers', () => {
    it('should fetch top suppliers with default limit', async () => {
      const mockSuppliers = [
        { id: '1', name: 'Supplier A', totalTransactions: 50000 },
        { id: '2', name: 'Supplier B', totalTransactions: 45000 },
        { id: '3', name: 'Supplier C', totalTransactions: 40000 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockSuppliers);

      const result = await dashboardApi.getTopSuppliers();

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/top-suppliers', {
        params: { limit: 10 },
      });
      expect(result).toEqual(mockSuppliers);
    });

    it('should fetch top suppliers with custom limit', async () => {
      const mockSuppliers = [
        { id: '1', name: 'Supplier A', totalTransactions: 50000 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockSuppliers);

      const result = await dashboardApi.getTopSuppliers(3);

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/top-suppliers', {
        params: { limit: 3 },
      });
      expect(result).toEqual(mockSuppliers);
    });
  });

  describe('getTrends', () => {
    it('should fetch trend data without parameters', async () => {
      const mockTrends = [
        { date: '2024-01-01', value: 100000, metric: 'disbursements' },
        { date: '2024-01-02', value: 120000, metric: 'disbursements' },
        { date: '2024-01-03', value: 110000, metric: 'disbursements' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockTrends);

      const result = await dashboardApi.getTrends();

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/trends', { params: undefined });
      expect(result).toEqual(mockTrends);
    });

    it('should fetch trend data with date range', async () => {
      const mockTrends = [
        { date: '2024-01-01', value: 100000, metric: 'disbursements' },
        { date: '2024-01-02', value: 120000, metric: 'disbursements' },
      ];

      const params = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        interval: 'day' as const,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockTrends);

      const result = await dashboardApi.getTrends(params);

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/trends', { params });
      expect(result).toEqual(mockTrends);
    });

    it('should fetch trend data with weekly interval', async () => {
      const mockTrends = [
        { date: '2024-W01', value: 500000, metric: 'disbursements' },
        { date: '2024-W02', value: 550000, metric: 'disbursements' },
      ];

      const params = {
        interval: 'week' as const,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockTrends);

      const result = await dashboardApi.getTrends(params);

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/trends', { params });
      expect(result).toEqual(mockTrends);
    });

    it('should fetch trend data with monthly interval', async () => {
      const mockTrends = [
        { date: '2024-01', value: 2000000, metric: 'disbursements' },
        { date: '2024-02', value: 2200000, metric: 'disbursements' },
      ];

      const params = {
        interval: 'month' as const,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockTrends);

      const result = await dashboardApi.getTrends(params);

      expect(apiClient.get).toHaveBeenCalledWith('/portfolio/trends', { params });
      expect(result).toEqual(mockTrends);
    });
  });

});
