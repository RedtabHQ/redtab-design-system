import { describe, it } from 'vitest';

describe.skip('DashboardView', () => {
  const mockOverviewData = {
    outstandingAmount: 72000,
    activeContracts: 45,
    totalContracts: 50,
    delinquencyRate: 0.03,
    defaultRate: 0.08,
  };

  const mockTrendsData = [
    { date: '2025-12-13', disbursements: 45000, repayments: 0 },
    { date: '2025-12-14', disbursements: 52000, repayments: 0 },
    { date: '2025-12-15', disbursements: 48000, repayments: 0 },
    { date: '2025-12-16', disbursements: 61000, repayments: 0 },
    { date: '2025-12-17', disbursements: 55000, repayments: 0 },
    { date: '2025-12-18', disbursements: 67000, repayments: 0 },
    { date: '2025-12-19', disbursements: 72000, repayments: 0 },
  ];

  const mockContractsData = {
    data: [
      { id: '1', merchantId: 'M001', tenureDays: 30, status: 'ACTIVE' },
      { id: '2', merchantId: 'M002', tenureDays: 25, status: 'ACTIVE' },
      { id: '3', merchantId: 'M003', tenureDays: 15, status: 'ACTIVE' },
    ],
    total: 3,
    page: 1,
    pageSize: 10,
  };

  const mockMerchantsData = {
    data: [
      { id: 'M001', name: 'Merchant 1', creditLine: { maxLimit: 50000 } },
      { id: 'M002', name: 'Merchant 2', creditLine: { maxLimit: 75000 } },
      { id: 'M003', name: 'Merchant 3', creditLine: { maxLimit: 100000 } },
    ],
    total: 3,
    page: 1,
    pageSize: 10,
  };

  const mockAuditLogsData = {
    data: [
      {
        id: '1',
        action: 'Kill Switch Activated',
        category: 'RISK',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        metadata: { reason: 'High delinquency rate' },
      },
      {
        id: '2',
        action: 'Limit Override Request',
        category: 'FINANCIAL',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        metadata: { merchantId: 'M001', amount: 100000 },
      },
      {
        id: '3',
        action: 'Policy Update',
        category: 'SYSTEM',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        metadata: { version: '1.2' },
      },
    ],
    total: 3,
    page: 1,
    pageSize: 3,
  };

  const mockDecisionTimeData = {
    averageDecisionTimeMinutes: 45.5,
    totalDecisions: 120,
    avgApprovedTime: 42.3,
    avgRejectedTime: 51.2,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks for all hooks
    vi.mocked(dashboardHooks.useOverview).mockReturnValue({
      data: mockOverviewData,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof dashboardHooks.useOverview>);

    vi.mocked(dashboardHooks.useTrends).mockReturnValue({
      data: mockTrendsData,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof dashboardHooks.useTrends>);

    vi.mocked(contractsHooks.useContracts).mockReturnValue({
      data: mockContractsData,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof contractsHooks.useContracts>);

    vi.mocked(merchantsHooks.useMerchants).mockReturnValue({
      data: mockMerchantsData,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof merchantsHooks.useMerchants>);

    vi.mocked(auditHooks.useAuditLogs).mockReturnValue({
      data: mockAuditLogsData,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof auditHooks.useAuditLogs>);

    vi.mocked(dashboardHooks.useDecisionTime).mockReturnValue({
      data: mockDecisionTimeData,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof dashboardHooks.useDecisionTime>);
  });

  describe('Rendering', () => {
    it('should render dashboard title and description', () => {
      render(<DashboardView />);

      expect(screen.getByText('Portfolio Risk Dashboard')).toBeInTheDocument();
      expect(screen.getByText(/Real-time health monitoring/i)).toBeInTheDocument();
    });

    it('should render filter button', () => {
      render(<DashboardView />);

      expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
    });

    it('should render kill switch button', () => {
      render(<DashboardView />);

      expect(screen.getByRole('button', { name: /kill switch/i })).toBeInTheDocument();
    });

    it('should render all stat cards', () => {
      render(<DashboardView />);

      expect(screen.getByText('Total Exposure')).toBeInTheDocument();
      expect(screen.getByText('Utilization Rate')).toBeInTheDocument();
      expect(screen.getByText('Active Contracts')).toBeInTheDocument();
      expect(screen.getByText('Delinquency Risk')).toBeInTheDocument();
    });

    it('should render exposure trend chart section', () => {
      render(<DashboardView />);

      expect(screen.getByText('Exposure Trend')).toBeInTheDocument();
      expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
    });

    it('should render recent alerts section', () => {
      render(<DashboardView />);

      expect(screen.getByText('Recent Alerts')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /view all audit logs/i })).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when overview data is loading', () => {
      vi.mocked(dashboardHooks.useOverview).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as ReturnType<typeof dashboardHooks.useOverview>);

      render(<DashboardView />);

      expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
      expect(screen.queryByText('Portfolio Risk Dashboard')).not.toBeInTheDocument();
    });

    it('should show loading spinner when trends data is loading', () => {
      vi.mocked(dashboardHooks.useTrends).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as ReturnType<typeof dashboardHooks.useTrends>);

      render(<DashboardView />);

      expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
    });
  });

  describe('Stat Cards Data Display', () => {
    it('should display total exposure correctly', () => {
      render(<DashboardView />);

      expect(screen.getByText('NPR 72.0k')).toBeInTheDocument();
      expect(screen.getByText('50 contracts')).toBeInTheDocument();
    });

    it('should calculate and display utilization rate', () => {
      render(<DashboardView />);

      // Total limit = 50000 + 75000 + 100000 = 225000
      // Total exposure = 72000
      // Utilization = (72000 / 225000) * 100 = 32%
      expect(screen.getByText('32.0%')).toBeInTheDocument();
      expect(screen.getByText('NPR 0.2M Total Limit')).toBeInTheDocument();
    });

    it('should display active contracts count', () => {
      render(<DashboardView />);

      expect(screen.getByText('45')).toBeInTheDocument();
    });

    it('should calculate and display average tenure', () => {
      render(<DashboardView />);

      // Average tenure = (30 + 25 + 15) / 3 = 23.33... ≈ 23
      expect(screen.getByText(/Avg tenure: 23 days/i)).toBeInTheDocument();
    });

    it('should display delinquency rate as percentage', () => {
      render(<DashboardView />);

      expect(screen.getByText('3.0%')).toBeInTheDocument();
      expect(screen.getByText(/Policy Threshold: 8%/i)).toBeInTheDocument();
    });

    it('should handle zero utilization when no merchants have credit lines', () => {
      vi.mocked(merchantsHooks.useMerchants).mockReturnValue({
        data: {
          data: [],
          total: 0,
          page: 1,
          pageSize: 10,
        },
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof merchantsHooks.useMerchants>);

      render(<DashboardView />);

      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });
  });

  describe('Kill Switch', () => {
    it('should toggle kill switch state when clicked', async () => {
      const user = userEvent.setup();
      render(<DashboardView />);

      const killSwitchButton = screen.getByRole('button', { name: /kill switch/i });

      // Initial state
      expect(killSwitchButton).toHaveTextContent('Kill Switch');

      // Click to activate
      await user.click(killSwitchButton);

      await waitFor(() => {
        expect(killSwitchButton).toHaveTextContent('Portfolio Frozen');
      });

      // Click to deactivate
      await user.click(killSwitchButton);

      await waitFor(() => {
        expect(killSwitchButton).toHaveTextContent('Kill Switch');
      });
    });

    it('should apply correct styling when kill switch is active', async () => {
      const user = userEvent.setup();
      render(<DashboardView />);

      const killSwitchButton = screen.getByRole('button', { name: /kill switch/i });

      await user.click(killSwitchButton);

      await waitFor(() => {
        expect(killSwitchButton).toHaveClass('bg-red-600');
        expect(killSwitchButton).toHaveClass('text-white');
        expect(killSwitchButton).toHaveClass('animate-pulse');
      });
    });
  });

  describe('Chart Data', () => {
    it('should display chart with trends data', () => {
      render(<DashboardView />);

      // Chart should be rendered with data points
      const chartSection = screen.getByText('Exposure Trend').parentElement;
      expect(chartSection).toBeInTheDocument();
    });

    it('should use fallback data when trends data is empty', () => {
      vi.mocked(dashboardHooks.useTrends).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof dashboardHooks.useTrends>);

      render(<DashboardView />);

      // Should still render the chart section
      expect(screen.getByText('Exposure Trend')).toBeInTheDocument();
    });

    it('should use fallback data when trends data is undefined', () => {
      vi.mocked(dashboardHooks.useTrends).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof dashboardHooks.useTrends>);

      render(<DashboardView />);

      expect(screen.getByText('Exposure Trend')).toBeInTheDocument();
    });
  });

  describe('Recent Alerts', () => {
    it('should display alerts from audit logs', () => {
      render(<DashboardView />);

      expect(screen.getByText('Kill Switch Activated')).toBeInTheDocument();
      expect(screen.getByText('Limit Override Request')).toBeInTheDocument();
      expect(screen.getByText('Policy Update')).toBeInTheDocument();
    });

    it('should show time ago for alerts', () => {
      render(<DashboardView />);

      expect(screen.getByText('2h ago')).toBeInTheDocument();
      expect(screen.getByText('4h ago')).toBeInTheDocument();
      expect(screen.getByText('1d ago')).toBeInTheDocument();
    });

    it('should apply correct styling based on alert category', () => {
      render(<DashboardView />);

      const dangerAlert = screen.getByText('Kill Switch Activated').parentElement;
      expect(dangerAlert).toHaveClass('bg-red-50');

      const warningAlert = screen.getByText('Limit Override Request').parentElement;
      expect(warningAlert).toHaveClass('bg-orange-50');

      const infoAlert = screen.getByText('Policy Update').parentElement;
      expect(infoAlert).toHaveClass('bg-blue-50');
    });

    it('should use fallback alerts when audit logs are empty', () => {
      vi.mocked(auditHooks.useAuditLogs).mockReturnValue({
        data: { data: [], total: 0, page: 1, pageSize: 3 },
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof auditHooks.useAuditLogs>);

      render(<DashboardView />);

      expect(screen.getByText('Kill Switch Guardrail')).toBeInTheDocument();
      expect(screen.getByText('Manual Override Required')).toBeInTheDocument();
      expect(screen.getByText('Policy Update')).toBeInTheDocument();
    });

    it('should use fallback alerts when audit logs are undefined', () => {
      vi.mocked(auditHooks.useAuditLogs).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof auditHooks.useAuditLogs>);

      render(<DashboardView />);

      expect(screen.getByText('Kill Switch Guardrail')).toBeInTheDocument();
    });

    it('should limit alerts to maximum of 3', () => {
      const manyAuditLogs = {
        data: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 1}`,
          action: `Action ${i + 1}`,
          category: 'SYSTEM',
          timestamp: new Date().toISOString(),
          metadata: {},
        })),
        total: 10,
        page: 1,
        pageSize: 10,
      };

      vi.mocked(auditHooks.useAuditLogs).mockReturnValue({
        data: manyAuditLogs,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof auditHooks.useAuditLogs>);

      render(<DashboardView />);

      // Should only show first 3 alerts
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
      expect(screen.getByText('Action 3')).toBeInTheDocument();
      expect(screen.queryByText('Action 4')).not.toBeInTheDocument();
    });
  });

  describe('Fallback Values', () => {
    it('should handle missing overview data gracefully', () => {
      vi.mocked(dashboardHooks.useOverview).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof dashboardHooks.useOverview>);

      render(<DashboardView />);

      expect(screen.getByText('NPR 0.0k')).toBeInTheDocument();
      expect(screen.getByText('0 contracts')).toBeInTheDocument();
    });

    it('should use default average tenure when no contracts', () => {
      vi.mocked(contractsHooks.useContracts).mockReturnValue({
        data: { data: [], total: 0, page: 1, pageSize: 10 },
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof contractsHooks.useContracts>);

      render(<DashboardView />);

      expect(screen.getByText(/Avg tenure: 22 days/i)).toBeInTheDocument();
    });

    it('should handle merchants without credit lines', () => {
      vi.mocked(merchantsHooks.useMerchants).mockReturnValue({
        data: {
          data: [
            { id: 'M001', name: 'Merchant 1', creditLine: undefined },
            { id: 'M002', name: 'Merchant 2', creditLine: null },
          ],
          total: 2,
          page: 1,
          pageSize: 10,
        },
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof merchantsHooks.useMerchants>);

      render(<DashboardView />);

      expect(screen.getByText('NPR 0.0M Total Limit')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      render(<DashboardView />);

      expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /kill switch/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /view all audit logs/i })).toBeInTheDocument();
    });
  });

  describe('Data Hooks Integration', () => {
    it('should call useOverview hook', () => {
      render(<DashboardView />);

      expect(dashboardHooks.useOverview).toHaveBeenCalled();
    });

    it('should call useTrends hook with correct interval', () => {
      render(<DashboardView />);

      expect(dashboardHooks.useTrends).toHaveBeenCalledWith({ interval: 'day' });
    });

    it('should call useContracts hook with active status filter', () => {
      render(<DashboardView />);

      expect(contractsHooks.useContracts).toHaveBeenCalledWith({
        status: 'ACTIVE',
        page: 1,
        pageSize: 10,
      });
    });

    it('should call useMerchants hook with pagination', () => {
      render(<DashboardView />);

      expect(merchantsHooks.useMerchants).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
      });
    });

    it('should call useAuditLogs hook with correct parameters', () => {
      render(<DashboardView />);

      expect(auditHooks.useAuditLogs).toHaveBeenCalledWith({
        page: 1,
        pageSize: 3,
        sortBy: 'timestamp',
        sortOrder: 'desc',
      });
    });
  });
});
