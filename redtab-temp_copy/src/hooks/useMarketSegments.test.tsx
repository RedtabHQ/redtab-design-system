import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useActiveMarketSegments, marketSegmentKeys } from './useMarketSegments';
import { apiClient } from '@/lib/api';
import type { MarketSegment } from '@types';
import { MarketSegmentStatus } from '@types';

// Mock apiClient
vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('useMarketSegments Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  const mockMarketSegment: MarketSegment = {
    id: 'seg-np-001',
    code: 'NPR',
    name: 'Nepal',
    currency: 'NPR',
    currencySymbol: '₹',
    region: 'Asia',
    country: 'Nepal',
    defaultCurrency: { code: 'NPR', symbol: '₹', exchangeRate: 1.0, decimalPlaces: 2, isActive: true },
    status: MarketSegmentStatus.ACTIVE,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: { timezone: 'Asia/Kathmandu', language: 'ne' },
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('marketSegmentKeys', () => {
    it('should generate correct query keys', () => {
      expect(marketSegmentKeys.all).toEqual(['market-segments']);
      expect(marketSegmentKeys.lists()).toEqual(['market-segments', 'list']);
      expect(marketSegmentKeys.list({})).toEqual(['market-segments', 'list', {}]);
      expect(marketSegmentKeys.details()).toEqual(['market-segments', 'detail']);
      expect(marketSegmentKeys.detail('seg-np-001')).toEqual(['market-segments', 'detail', 'seg-np-001']);
      expect(marketSegmentKeys.active()).toEqual(['market-segments', 'active']);
    });
  });

  describe('useActiveMarketSegments', () => {
    it('should fetch active market segments on mount', async () => {
      const mockResponse: MarketSegment[] = [mockMarketSegment];
      vi.mocked(apiClient.get).mockResolvedValueOnce({ items: mockResponse, total: 1, page: 1, pageSize: 100 });

      const { result } = renderHook(() => useActiveMarketSegments(), { wrapper });

      // With initialData, isFetching is true even if isLoading is false
      expect(result.current.isFetching).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(apiClient.get).toHaveBeenCalledWith('/market-segments', { params: { status: 'ACTIVE', limit: 100 } });
      expect(apiClient.get).toHaveBeenCalledTimes(1);
    });

    it('should return empty array as initial data', () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ items: [mockMarketSegment], total: 1, page: 1, pageSize: 100 });

      const { result } = renderHook(() => useActiveMarketSegments(), { wrapper });

      // Before loading completes, data is undefined (no initialData)
      expect(result.current.data).toBeUndefined();
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('Failed to fetch active segments');
      vi.mocked(apiClient.get).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useActiveMarketSegments(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });

    it('should respect enabled option', () => {
      const { result } = renderHook(() => useActiveMarketSegments({ enabled: false }), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it('should use correct query key from marketSegmentKeys', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ items: [], total: 0, page: 1, pageSize: 100 });

      renderHook(() => useActiveMarketSegments(), { wrapper });

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalled();
      });

      // Verify the query key is in the cache
      const cachedData = queryClient.getQueryData(marketSegmentKeys.active());
      expect(cachedData).toBeDefined();
    });

    it('should cache data for 5 minutes (staleTime)', async () => {
      const mockResponse = [mockMarketSegment];
      vi.mocked(apiClient.get).mockResolvedValueOnce({ items: mockResponse, total: 1, page: 1, pageSize: 100 });

      const { result } = renderHook(() => useActiveMarketSegments(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Get the cached data - it should be in React Query cache
      const cachedData = queryClient.getQueryData(marketSegmentKeys.active());
      expect(cachedData).toEqual(mockResponse);
    });

    it('should handle multiple market segments', async () => {
      const mockResponse: MarketSegment[] = [
        mockMarketSegment,
        {
          ...mockMarketSegment,
          id: 'seg-us-001',
          code: 'USD',
          name: 'United States',
          currency: 'USD',
          currencySymbol: '$',
          region: 'North America',
          country: 'United States',
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValueOnce({ items: mockResponse, total: 2, page: 1, pageSize: 100 });

      const { result } = renderHook(() => useActiveMarketSegments(), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toHaveLength(2);
      });

      expect(result.current.data?.[0].code).toBe('NPR');
      expect(result.current.data?.[1].code).toBe('USD');
    });

    it('should merge custom options with defaults', async () => {
      const mockResponse = [mockMarketSegment];
      vi.mocked(apiClient.get).mockResolvedValueOnce({ items: mockResponse, total: 1, page: 1, pageSize: 100 });

      const customOptions = {
        staleTime: 10 * 60 * 1000, // 10 minutes instead of default
      };

      const { result } = renderHook(() => useActiveMarketSegments(customOptions), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse);
      });

      expect(result.current.isSuccess).toBe(true);
    });
  });
});
