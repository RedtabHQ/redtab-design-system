import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ChartDataSection from '../ChartDataSection';
import * as useTransactionsModule from '@/hooks/useTransactions';
import * as useMarketSegmentModule from '@/contexts/MarketSegmentContext';
import * as useCurrencyModule from '@/hooks/useCurrency';
import * as useTimezoneModule from '@/hooks/useTimezone';
import type { UseQueryResult } from '@tanstack/react-query';
import type { MarketSegmentContextType } from '@/contexts/MarketSegmentContext';
import type { CurrencyInfo } from '@/hooks/useCurrency';
import type { MarketSegment } from '@/types';

interface MockFlowDynamicsResponse {
  range: string;
  granularity: 'day' | 'month';
  points: Array<{
    bucketStart: string;
    label: string;
    outbound: number;
    inbound: number;
    total: number;
    net: number;
  }>;
}

describe('ChartDataSection', () => {
  const mockFlowData: MockFlowDynamicsResponse = {
    range: '30D',
    granularity: 'day',
    points: [],
  };

  const mockSegmentObject: MarketSegment = {
    id: 'seg-123',
    name: 'Test Segment',
  } as MarketSegment;

  const mockMarketSegment: MarketSegmentContextType = {
    selectedSegment: mockSegmentObject,
    isGlobalView: false,
    segmentId: 'seg-123',
    setSelectedSegment: vi.fn(),
    availableSegments: [],
    isLoading: false,
    defaultCurrency: 'USD',
    defaultCurrencySymbol: '$',
  };

  const defaultFlowDynamicsMock = {
    data: mockFlowData,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    isPending: false,
    isError: false,
    isFetched: true,
    isFetching: false,
    failureCount: 0,
    failureReason: null,
    isStale: false,
    status: 'success',
  } as unknown as UseQueryResult<MockFlowDynamicsResponse, Error>;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(useTransactionsModule, 'useTransactionFlowDynamics').mockReturnValue(defaultFlowDynamicsMock);

    vi.spyOn(useMarketSegmentModule, 'useMarketSegment').mockReturnValue(mockMarketSegment);

    const mockCurrencyInfo: CurrencyInfo = {
      currency: 'USD',
      symbol: '$',
      exchangeRate: 1,
      decimalPlaces: 2,
      isGlobal: false,
      isLoading: false,
    };
    vi.spyOn(useCurrencyModule, 'useCurrency').mockReturnValue(mockCurrencyInfo);

    vi.spyOn(useTimezoneModule, 'useTimezone').mockReturnValue({ timezone: 'Asia/Kathmandu' });
  });

  describe('Rendering', () => {
    it('should render 5 date range buttons', () => {
      render(<ChartDataSection isForecastMode={false} />);
      expect(screen.getByRole('button', { name: /7d/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /30d/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /90d/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ytd/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    });

    it('should have 30d selected by default', () => {
      render(<ChartDataSection isForecastMode={false} />);
      const thirtyDayButton = screen.getByRole('button', { name: /30d/i });
      expect(thirtyDayButton).toHaveClass('bg-redtab');
    });

    it('should render "Operational Flow Dynamics" header', () => {
      render(<ChartDataSection isForecastMode={false} />);
      expect(screen.getByText(/Operational Flow Dynamics/i)).toBeInTheDocument();
    });
  });

  describe('Date Range Selection', () => {
    it('should call useTransactionFlowDynamics with correct params on mount', () => {
      const spy = vi.spyOn(useTransactionsModule, 'useTransactionFlowDynamics');
      render(<ChartDataSection isForecastMode={false} />);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'COMPLETED',
          marketSegmentId: 'seg-123',
          range: '30D',
          timezone: 'Asia/Kathmandu',
        }),
        expect.any(Object)
      );
    });

    it('should exclude marketSegmentId when isGlobalView is true', () => {
      const spy = vi.spyOn(useTransactionsModule, 'useTransactionFlowDynamics');

      const globalViewSegment: MarketSegmentContextType = {
        selectedSegment: mockSegmentObject,
        isGlobalView: true,
        segmentId: 'seg-123',
        setSelectedSegment: vi.fn(),
        availableSegments: [],
        isLoading: false,
        defaultCurrency: 'USD',
        defaultCurrencySymbol: '$',
      };

      vi.spyOn(useMarketSegmentModule, 'useMarketSegment').mockReturnValue(globalViewSegment);

      render(<ChartDataSection isForecastMode={false} />);

      expect(spy).toHaveBeenCalledWith(
        expect.not.objectContaining({
          marketSegmentId: expect.anything(),
        }),
        expect.any(Object)
      );
    });
  });

  describe('Loading & Error States', () => {
    it('should show spinner when isLoading is true', () => {
      vi.spyOn(useTransactionsModule, 'useTransactionFlowDynamics').mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
        isPending: true,
        isError: false,
        isFetched: false,
        isFetching: true,
        failureCount: 0,
        failureReason: null,
        isStale: false,
        status: 'pending',
      } as unknown as UseQueryResult<MockFlowDynamicsResponse, Error>);

      render(<ChartDataSection isForecastMode={false} />);
      expect(screen.getByText(/Loading transaction stats/i)).toBeInTheDocument();
    });

    it('should show error banner when error occurs and no data', () => {
      const mockError = new Error('Failed to fetch');
      vi.spyOn(useTransactionsModule, 'useTransactionFlowDynamics').mockReturnValue({
        data: null,
        isLoading: false,
        error: mockError,
        refetch: vi.fn(),
        isPending: false,
        isError: true,
        isFetched: true,
        isFetching: false,
        failureCount: 1,
        failureReason: mockError,
        isStale: false,
        status: 'error',
      } as unknown as UseQueryResult<MockFlowDynamicsResponse, Error>);

      render(<ChartDataSection isForecastMode={false} />);
      expect(screen.getByText(/Failed to load transaction stats/i)).toBeInTheDocument();
    });

    it('should have retry button in error state', () => {
      const mockRefetch = vi.fn();
      vi.spyOn(useTransactionsModule, 'useTransactionFlowDynamics').mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed'),
        refetch: mockRefetch,
        isPending: false,
        isError: true,
        isFetched: true,
        isFetching: false,
        failureCount: 1,
        failureReason: new Error('Failed'),
        isStale: false,
        status: 'error',
      } as unknown as UseQueryResult<MockFlowDynamicsResponse, Error>);

      render(<ChartDataSection isForecastMode={false} />);
      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Auto-Refresh (Forecast Mode)', () => {
    it('should pass refetchInterval: false when isForecastMode is false', () => {
      const spy = vi.spyOn(useTransactionsModule, 'useTransactionFlowDynamics');
      render(<ChartDataSection isForecastMode={false} />);

      expect(spy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          refetchInterval: false,
        })
      );
    });

    it('should pass refetchInterval: 10000 when isForecastMode is true', () => {
      const spy = vi.spyOn(useTransactionsModule, 'useTransactionFlowDynamics');
      render(<ChartDataSection isForecastMode={true} />);

      expect(spy).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          refetchInterval: 10000,
        })
      );
    });
  });
});
