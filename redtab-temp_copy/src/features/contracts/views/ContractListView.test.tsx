import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@test/test-utils';

// Mock all dependencies FIRST before importing component
vi.mock('../hooks/useContracts');
vi.mock('@/hooks/useListFilters');
vi.mock('@stores');
vi.mock('@/contexts/MarketSegmentContext', () => ({
  MarketSegmentProvider: ({ children }: { children: React.ReactNode }) => children,
  useMarketSegment: () => ({
    selectedSegment: { id: 'REG-NP', name: 'Nepal', currency: 'NPR', currencySymbol: 'रू', status: 'ACTIVE', defaultCurrency: { code: 'NPR', symbol: 'रू', exchangeRate: 1, decimalPlaces: 2, isActive: true } },
    availableSegments: [{ id: 'REG-NP', name: 'Nepal', currency: 'NPR', currencySymbol: 'रू', status: 'ACTIVE', defaultCurrency: { code: 'NPR', symbol: 'रू', exchangeRate: 1, decimalPlaces: 2, isActive: true } }],
    isGlobalView: false,
    selectSegment: vi.fn(),
    selectGlobalView: vi.fn(),
  }),
}));
vi.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    symbol: 'रू',
    code: 'NPR',
    name: 'Nepalese Rupee',
  }),
}));
vi.mock('@/hooks/useMarketSegments');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

// Import after mocks
import ContractListView from './ContractListView';
import { useContracts, useContractKpiAggregation } from '../hooks/useContracts';
import { useListFilters } from '@/hooks/useListFilters';

describe('ContractListView', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useListFilters
    vi.mocked(useListFilters).mockReturnValue({
      currentPage: 1,
      pageSize: 5,
      searchTerm: '',
      statusFilter: undefined,
      handleSearchChange: vi.fn(),
      handleStatusFilterChange: vi.fn(),
      handlePageChange: vi.fn(),
      handlePageSizeChange: vi.fn(),
      clearFilters: vi.fn(),
    });

    // Mock useContracts
    vi.mocked(useContracts).mockReturnValue({
      data: {
        items: [],
        meta: {
          total: 0,
          totalPages: 0,
          page: 1,
          pageSize: 5,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isFetching: false,
      isRefetching: false,
      refetch: vi.fn().mockResolvedValue({}),
      status: 'success',
    } as never);

    vi.mocked(useContractKpiAggregation).mockReturnValue({
      data: {
        totalDisbursed: 250000,
        recoveryProgress: 0.942,
        totalOutstanding: 125000,
        totalRecovered: 100000,
      },
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isFetching: false,
      isRefetching: false,
      refetch: vi.fn().mockResolvedValue({}),
      status: 'success',
    } as never);
  });

  describe('Rendering', () => {
    it('should render page title', () => {
      render(<ContractListView />);
      expect(screen.getByText(/Agreements/i)).toBeInTheDocument();
    });

    it('should render subtitle with total count', () => {
      render(<ContractListView />);
      expect(screen.getByText(/Registry of/i)).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<ContractListView />);
      expect(screen.getByPlaceholderText(/search segment agreements/i)).toBeInTheDocument();
    });

    it('should render status filter buttons', () => {
      render(<ContractListView />);
      expect(screen.getByRole('button', { name: 'ALL' })).toBeInTheDocument();
    });
  });

  describe('KPIs Display', () => {
    it('should display Total Book Value', () => {
      render(<ContractListView />);
      expect(screen.getByText('Total Book Value')).toBeInTheDocument();
    });

    it('should display Segment Recovery', () => {
      render(<ContractListView />);
      expect(screen.getByText('Segment Recovery')).toBeInTheDocument();
    });

    it('should display recovery percentage from KPI data', () => {
      render(<ContractListView />);
      expect(screen.getByText('94.2%')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('should call useContracts with default parameters', () => {
      render(<ContractListView />);
      expect(useContracts).toHaveBeenCalledWith({
        page: 1,
        pageSize: 5,
        search: undefined,
        status: undefined,
        marketSegmentId: 'REG-NP',
      });
    });
  });

  describe('Empty State', () => {
    it('should handle empty contracts list', () => {
      render(<ContractListView />);
      expect(screen.getByText(/Agreements/i)).toBeInTheDocument();
    });
  });
});
