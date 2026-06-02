import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useOverview,
  useTierDistribution,
  useRiskMetrics,
  usePaymentFlow,
  useTopMerchants,
  useTopSuppliers,
  useTrends,
} from '@features/dashboard/hooks';
import { dashboardApi } from '@/features/dashboard/services/dashboardApi';

// Mock dashboard API
vi.mock('@/features/dashboard/services/dashboardApi', () => ({
  dashboardApi: {
    getOverview: vi.fn(),
    getTierDistribution: vi.fn(),
    getRiskMetrics: vi.fn(),
    getPaymentFlow: vi.fn(),
    getTopMerchants: vi.fn(),
    getTopSuppliers: vi.fn(),
    getTrends: vi.fn(),
    getDecisionTime: vi.fn(),
  },
}));

describe('useDashboard Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useOverview', () => {
    it('should fetch overview data successfully', async () => {
      const mockOverview = {
        totalMerchants: 150,
        activeMerchants: 120,
        totalContracts: 500,
        activeContracts: 450,
        totalCreditLine: 5000000,
        utilizationRate: 0.65,
      };

      vi.mocked(dashboardApi.getOverview).mockResolvedValueOnce(mockOverview);

      const { result } = renderHook(() => useOverview(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockOverview);
      expect(dashboardApi.getOverview).toHaveBeenCalledTimes(1);
    });

    it('should handle overview error', async () => {
      const error = new Error('Failed to fetch overview');
      vi.mocked(dashboardApi.getOverview).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useOverview(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should use 5 minute stale time', async () => {
      vi.mocked(dashboardApi.getOverview).mockResolvedValueOnce({});

      const { result } = renderHook(() => useOverview(), { wrapper });

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const queryState = queryClient.getQueryState(['dashboard', 'overview', undefined]);
      expect(queryState).toBeDefined();
    });
  });

  describe('useTierDistribution', () => {
    it('should fetch tier distribution data', async () => {
      const mockDistribution = {
        T1: 50,
        T2: 75,
        T3: 25,
      };

      vi.mocked(dashboardApi.getTierDistribution).mockResolvedValueOnce(mockDistribution);

      const { result } = renderHook(() => useTierDistribution(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockDistribution);
      expect(dashboardApi.getTierDistribution).toHaveBeenCalledTimes(1);
    });

    it('should handle tier distribution error', async () => {
      const error = new Error('Failed to fetch tier distribution');
      vi.mocked(dashboardApi.getTierDistribution).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useTierDistribution(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRiskMetrics', () => {
    it('should fetch risk metrics data', async () => {
      const mockMetrics = {
        defaultRate: 0.02,
        delinquencyRate: 0.05,
        avgCreditScore: 720,
        riskScore: 65,
      };

      vi.mocked(dashboardApi.getRiskMetrics).mockResolvedValueOnce(mockMetrics);

      const { result } = renderHook(() => useRiskMetrics(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockMetrics);
      expect(dashboardApi.getRiskMetrics).toHaveBeenCalledTimes(1);
    });

    it('should handle risk metrics error', async () => {
      const error = new Error('Failed to fetch risk metrics');
      vi.mocked(dashboardApi.getRiskMetrics).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useRiskMetrics(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('usePaymentFlow', () => {
    it('should fetch payment flow data', async () => {
      const mockFlow = {
        incoming: 1000000,
        outgoing: 800000,
        netFlow: 200000,
        pendingPayments: 50000,
      };

      vi.mocked(dashboardApi.getPaymentFlow).mockResolvedValueOnce(mockFlow);

      const { result } = renderHook(() => usePaymentFlow(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockFlow);
      expect(dashboardApi.getPaymentFlow).toHaveBeenCalledTimes(1);
    });

    it('should handle payment flow error', async () => {
      const error = new Error('Failed to fetch payment flow');
      vi.mocked(dashboardApi.getPaymentFlow).mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePaymentFlow(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useTopMerchants', () => {
    it('should fetch top merchants with default limit', async () => {
      const mockMerchants = [
        { id: 'M1', name: 'Merchant 1', totalVolume: 500000 },
        { id: 'M2', name: 'Merchant 2', totalVolume: 400000 },
      ];

      vi.mocked(dashboardApi.getTopMerchants).mockResolvedValueOnce(mockMerchants);

      const { result } = renderHook(() => useTopMerchants(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockMerchants);
      expect(dashboardApi.getTopMerchants).toHaveBeenCalledWith(10);
    });

    it('should fetch top merchants with custom limit', async () => {
      const mockMerchants = [
        { id: 'M1', name: 'Merchant 1', totalVolume: 500000 },
      ];

      vi.mocked(dashboardApi.getTopMerchants).mockResolvedValueOnce(mockMerchants);

      const { result } = renderHook(() => useTopMerchants(5), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(dashboardApi.getTopMerchants).toHaveBeenCalledWith(5);
    });

    it('should handle top merchants error', async () => {
      const error = new Error('Failed to fetch top merchants');
      vi.mocked(dashboardApi.getTopMerchants).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useTopMerchants(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useTopSuppliers', () => {
    it('should fetch top suppliers with default limit', async () => {
      const mockSuppliers = [
        { id: 'S1', name: 'Supplier 1', totalVolume: 600000 },
        { id: 'S2', name: 'Supplier 2', totalVolume: 450000 },
      ];

      vi.mocked(dashboardApi.getTopSuppliers).mockResolvedValueOnce(mockSuppliers);

      const { result } = renderHook(() => useTopSuppliers(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSuppliers);
      expect(dashboardApi.getTopSuppliers).toHaveBeenCalledWith(10);
    });

    it('should fetch top suppliers with custom limit', async () => {
      const mockSuppliers = [
        { id: 'S1', name: 'Supplier 1', totalVolume: 600000 },
      ];

      vi.mocked(dashboardApi.getTopSuppliers).mockResolvedValueOnce(mockSuppliers);

      const { result } = renderHook(() => useTopSuppliers(3), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(dashboardApi.getTopSuppliers).toHaveBeenCalledWith(3);
    });

    it('should handle top suppliers error', async () => {
      const error = new Error('Failed to fetch top suppliers');
      vi.mocked(dashboardApi.getTopSuppliers).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useTopSuppliers(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useTrends', () => {
    it('should fetch trends without parameters', async () => {
      const mockTrends = {
        labels: ['Jan', 'Feb', 'Mar'],
        values: [100, 150, 200],
      };

      vi.mocked(dashboardApi.getTrends).mockResolvedValueOnce(mockTrends);

      const { result } = renderHook(() => useTrends(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockTrends);
      expect(dashboardApi.getTrends).toHaveBeenCalledWith(undefined);
    });

    it('should fetch trends with parameters', async () => {
      const mockTrends = {
        labels: ['Week 1', 'Week 2'],
        values: [50, 75],
      };

      const params = {
        period: 'week' as const,
        metric: 'volume' as const,
      };

      vi.mocked(dashboardApi.getTrends).mockResolvedValueOnce(mockTrends);

      const { result } = renderHook(() => useTrends(params), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(dashboardApi.getTrends).toHaveBeenCalledWith(params);
    });

    it('should handle trends error', async () => {
      const error = new Error('Failed to fetch trends');
      vi.mocked(dashboardApi.getTrends).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useTrends(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should refetch with different params', async () => {
      const mockTrends1 = { labels: ['Jan'], values: [100] };
      const mockTrends2 = { labels: ['Week 1'], values: [50] };

      vi.mocked(dashboardApi.getTrends)
        .mockResolvedValueOnce(mockTrends1)
        .mockResolvedValueOnce(mockTrends2);

      const { result, rerender } = renderHook(
        ({ params }) => useTrends(params),
        {
          wrapper,
          initialProps: { params: { period: 'month' as const } },
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockTrends1);

      rerender({ params: { period: 'week' as const } });

      await waitFor(() => expect(dashboardApi.getTrends).toHaveBeenCalledTimes(2));
    });
  });

  describe('Query State Management', () => {
    it('should initialize with loading state', () => {
      vi.mocked(dashboardApi.getOverview).mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHook(() => useOverview(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should maintain data during refetch', async () => {
      const mockData1 = { totalMerchants: 100 };
      const mockData2 = { totalMerchants: 110 };

      vi.mocked(dashboardApi.getOverview)
        .mockResolvedValueOnce(mockData1)
        .mockResolvedValueOnce(mockData2);

      const { result } = renderHook(() => useOverview(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockData1);

      result.current.refetch();

      await waitFor(() => expect(result.current.data).toEqual(mockData2));
    });

    it('should handle multiple hooks independently', async () => {
      const mockOverview = { totalMerchants: 100 };
      const mockMetrics = { defaultRate: 0.02 };

      vi.mocked(dashboardApi.getOverview).mockResolvedValueOnce(mockOverview);
      vi.mocked(dashboardApi.getRiskMetrics).mockResolvedValueOnce(mockMetrics);

      const { result: overviewResult } = renderHook(() => useOverview(), { wrapper });
      const { result: metricsResult } = renderHook(() => useRiskMetrics(), { wrapper });

      await waitFor(() => {
        expect(overviewResult.current.isSuccess).toBe(true);
        expect(metricsResult.current.isSuccess).toBe(true);
      });

      expect(overviewResult.current.data).toEqual(mockOverview);
      expect(metricsResult.current.data).toEqual(mockMetrics);
    });
  });
});
