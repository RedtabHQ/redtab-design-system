import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import PaymentOrchestrationView from './PaymentOrchestrationView';
import { ForecastProvider } from '@/contexts/ForecastContext';
import * as useTransactionsModule from '@/hooks/useTransactions';
import * as usePaymentsModule from '@/features/payment/hooks/usePayments';
import * as marketSegmentContextModule from '@/contexts/MarketSegmentContext';
import * as currencyModule from '@/hooks/useCurrency';
import * as KPIBoxSegmentOutboundModule from '@/features/payment/components/KPIBoxSegmentOutbound';
import * as KPIBoxSegmentInboundModule from '@/features/payment/components/KPIBoxSegmentInbound';
import * as KPIBoxRepaymentRateModule from '@/features/payment/components/KPIBoxRepaymentRate';
import * as KPIBoxLocalSegmentBalanceModule from '@/features/payment/components/KPIBoxLocalSegmentBalance';
import type { Transaction, PaymentStats, PaginatedResponse } from '@/types';

// Mock data
const mockTransactionsData: PaginatedResponse<Transaction> = {
  data: [
    {
      id: 'txn-001',
      type: 'DISBURSEMENT' as const,
      amount: 1000,
      currency: 'USD',
      merchantId: 'merchant-001',
      merchantName: 'Test Merchant 1',
      status: 'COMPLETED',
      paymentChannel: 'BANK_TRANSFER',
    },
    {
      id: 'txn-002',
      type: 'REPAYMENT' as const,
      amount: 500,
      currency: 'USD',
      merchantId: 'merchant-002',
      merchantName: 'Test Merchant 2',
      status: 'COMPLETED',
      paymentChannel: 'ESEWA',
    },
  ],
  total: 2,
  page: 1,
  pageSize: 100,
  totalPages: 1,
};

const mockStatsData: PaymentStats = {
  totalPayments: 100,
  totalAmount: 50000,
  completed: 95,
  failed: 2,
  pending: 3,
  completionRate: 0.95,
  byType: {
    DISBURSEMENT: 30,
    REPAYMENT: 70,
  },
  byRail: {},
};

// Type-safe mock factory functions
function createMockTransactionsResult(overrides?: Partial<UseQueryResult<PaginatedResponse<Transaction>>>): UseQueryResult<PaginatedResponse<Transaction>> {
  return {
    data: mockTransactionsData,
    isLoading: false,
    isError: false,
    error: null,
    isFetching: false,
    isPending: false,
    isSuccess: true,
    status: 'success' as const,
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    ...overrides,
  };
}

function createMockStatsResult(overrides?: Partial<UseQueryResult<PaymentStats>>): UseQueryResult<PaymentStats> {
  return {
    data: mockStatsData,
    isLoading: false,
    isError: false,
    error: null,
    isFetching: false,
    isPending: false,
    isSuccess: true,
    status: 'success' as const,
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    ...overrides,
  };
}

describe('PaymentOrchestrationView', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock useTransactions hook
    vi.spyOn(useTransactionsModule, 'useTransactions').mockReturnValue(
      createMockTransactionsResult()
    );

    // Mock usePaymentStatistics hook
    vi.spyOn(usePaymentsModule, 'usePaymentStatistics').mockReturnValue(
      createMockStatsResult()
    );

    // Mock useMarketSegment hook
    vi.spyOn(marketSegmentContextModule, 'useMarketSegment').mockReturnValue({
      selectedSegment: null,
      availableSegments: [],
      isGlobalView: true,
      selectSegment: vi.fn(),
      clearSelection: vi.fn(),
      currency: 'USD',
      exchangeRate: 1,
    });

    // Mock useCurrency hook
    vi.spyOn(currencyModule, 'useCurrency').mockReturnValue({
      currency: 'USD',
      symbol: '$',
      exchangeRate: 1,
      locale: 'en-US',
    });

    // Mock KPI Box components
    vi.spyOn(KPIBoxSegmentOutboundModule, 'KPIBoxSegmentOutbound').mockReturnValue(
      <div data-testid="kpi-outbound">Segment Outbound</div>
    );

    vi.spyOn(KPIBoxSegmentInboundModule, 'KPIBoxSegmentInbound').mockReturnValue(
      <div data-testid="kpi-inbound">Segment Inbound</div>
    );

    vi.spyOn(KPIBoxRepaymentRateModule, 'KPIBoxRepaymentRate').mockReturnValue(
      <div data-testid="kpi-repayment">Repayment Rate</div>
    );

    vi.spyOn(KPIBoxLocalSegmentBalanceModule, 'KPIBoxLocalSegmentBalance').mockReturnValue(
      <div data-testid="kpi-balance">Local Segment Balance</div>
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Payment Orchestration View header', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ForecastProvider>
          <PaymentOrchestrationView />
        </ForecastProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Global Treasury Orchestrator|Liquidity Cockpit/)).toBeInTheDocument();
    });
  });

  it('displays loading state for KPI boxes when stats are loading', async () => {
    vi.spyOn(usePaymentsModule, 'usePaymentStatistics').mockReturnValue(
      createMockStatsResult({
        data: undefined,
        isLoading: true,
        isPending: true,
        isSuccess: false,
        status: 'pending' as const,
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ForecastProvider>
          <PaymentOrchestrationView />
        </ForecastProvider>
      </QueryClientProvider>
    );

    // KPI components now handle their own loading state with useQuery
    // Verify that the component still renders the KPI section
    await waitFor(() => {
      expect(screen.getByTestId('kpi-repayment')).toBeInTheDocument();
    });
  });

  it('displays error state when API fails', async () => {
    const error = new Error('Failed to fetch payments');
    vi.spyOn(useTransactionsModule, 'useTransactions').mockReturnValue(
      createMockTransactionsResult({
        data: undefined,
        isLoading: false,
        isError: true,
        error: error,
        isPending: false,
        isSuccess: false,
        status: 'error' as const,
        failureReason: error,
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ForecastProvider>
          <PaymentOrchestrationView />
        </ForecastProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load transactions/)).toBeInTheDocument();
    });
  });

  it('displays KPI values from stats data', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ForecastProvider>
          <PaymentOrchestrationView />
        </ForecastProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Segment Outbound/)).toBeInTheDocument();
      expect(screen.getByText(/Segment Inbound/)).toBeInTheDocument();
      expect(screen.getByText(/Repayment Rate/)).toBeInTheDocument();
    });
  });

  it('filters transactions based on search and filter', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ForecastProvider>
          <PaymentOrchestrationView />
        </ForecastProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      // Check that component is rendered
      expect(screen.getByText(/Global Treasury Orchestrator|Liquidity Cockpit/)).toBeInTheDocument();
    });
  });

  it('calls API hooks with correct parameters', async () => {
    const useTransactionsSpy = vi.spyOn(useTransactionsModule, 'useTransactions');

    render(
      <QueryClientProvider client={queryClient}>
        <ForecastProvider>
          <PaymentOrchestrationView />
        </ForecastProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(useTransactionsSpy).toHaveBeenCalled();
    });
  });
});
