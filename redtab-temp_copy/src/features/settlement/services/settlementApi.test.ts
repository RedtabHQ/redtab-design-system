import { describe, it, expect, beforeEach, vi } from 'vitest';
import { settlementApi } from './settlementApi';
import { apiClient } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('settlementApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRail = {
    id: '1',
    railId: 'R001',
    railType: 'NCHL' as const,
    railName: 'NCHL Rail',
    status: 'ACTIVE' as const,
    priority: 1,
    configuration: {
      apiEndpoint: 'https://api.nchl.com.np',
      apiKey: 'test-key',
      timeout: 30000,
      retryAttempts: 2,
    },
    limits: {
      minAmount: 100,
      maxAmount: 100000000,
      dailyLimit: 500000000,
      monthlyLimit: 5000000000,
    },
    fees: {
      fixedFee: 10,
      percentageFee: 0.5,
      maxFee: 5000,
    },
    successRate: 98.5,
    avgProcessingTimeMs: 3000,
    supportedBanks: ['All NPR Banks'],
    supportsInstantSettlement: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  describe('getAllRails', () => {
    it('should fetch all settlement rails', async () => {
      const mockRails = [mockRail];
      const mockResponse = {
        items: mockRails,
        meta: {
          page: 1,
          pageSize: 30,
          total: 1,
          totalPages: 1,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await settlementApi.getAllRails();

      expect(apiClient.get).toHaveBeenCalledWith('/settlements/rails');
      expect(result).toEqual(mockRails);
    });
  });

  describe('getActiveRails', () => {
    it('should fetch only active rails', async () => {
      const mockRails = [mockRail];

      vi.mocked(apiClient.get).mockResolvedValue(mockRails);

      const result = await settlementApi.getActiveRails();

      expect(apiClient.get).toHaveBeenCalledWith('/settlements/rails/active');
      expect(result).toEqual(mockRails);
    });
  });

  describe('getRailById', () => {
    it('should fetch rail by ID', async () => {
      vi.mocked(apiClient.get).mockResolvedValue(mockRail);

      const result = await settlementApi.getRailById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/settlements/rails/1');
      expect(result).toEqual(mockRail);
    });
  });

  describe('createRail', () => {
    it('should create new settlement rail', async () => {
      const railData = {
        railType: 'KHALTI' as const,
        railName: 'Khalti Rail',
        priority: 3,
        configuration: {
          apiEndpoint: 'https://khalti.com/api',
          timeout: 15000,
          retryAttempts: 3,
        },
        limits: {
          minAmount: 10,
          maxAmount: 1000000,
          dailyLimit: 10000000,
          monthlyLimit: 100000000,
        },
        fees: {
          fixedFee: 0,
          percentageFee: 1.99,
          maxFee: 1000,
        },
      };

      const mockCreatedRail = {
        id: '3',
        railId: 'R003',
        ...railData,
        status: 'ACTIVE' as const,
        successRate: 99.0,
        avgProcessingTimeMs: 2000,
        supportsInstantSettlement: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockCreatedRail);

      const result = await settlementApi.createRail(railData);

      expect(apiClient.post).toHaveBeenCalledWith('/settlements/rails', railData);
      expect(result).toEqual(mockCreatedRail);
    });
  });

  describe('updateRail', () => {
    it('should update rail status', async () => {
      const updateData = {
        status: 'MAINTENANCE' as const,
      };

      const mockUpdatedRail = {
        ...mockRail,
        status: 'MAINTENANCE' as const,
      };

      vi.mocked(apiClient.put).mockResolvedValue(mockUpdatedRail);

      const result = await settlementApi.updateRail('1', updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/settlements/rails/1', updateData);
      expect(result).toEqual(mockUpdatedRail);
    });

    it('should update rail configuration', async () => {
      const updateData = {
        priority: 2,
        configuration: {
          timeout: 20000,
          retryAttempts: 3,
        },
      };

      const mockUpdatedRail = {
        ...mockRail,
        priority: 2,
        configuration: {
          ...mockRail.configuration,
          timeout: 20000,
          retryAttempts: 3,
        },
      };

      vi.mocked(apiClient.put).mockResolvedValue(mockUpdatedRail);

      const result = await settlementApi.updateRail('1', updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/settlements/rails/1', updateData);
      expect(result).toEqual(mockUpdatedRail);
    });
  });

  describe('selectBestRail', () => {
    it('should select best rail for amount', async () => {
      const params = {
        amount: 50000,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockRail);

      const result = await settlementApi.selectBestRail(params);

      expect(apiClient.get).toHaveBeenCalledWith('/settlements/rails/select-best', { params });
      expect(result).toEqual(mockRail);
    });

    it('should select best rail with merchant and supplier', async () => {
      const params = {
        amount: 75000,
        merchantId: 'merchant-123',
        supplierId: 'supplier-456',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockRail);

      const result = await settlementApi.selectBestRail(params);

      expect(apiClient.get).toHaveBeenCalledWith('/settlements/rails/select-best', { params });
      expect(result).toEqual(mockRail);
    });
  });

  describe('getTransaction', () => {
    it('should fetch transaction by ID', async () => {
      const mockTransaction = {
        id: 'txn-1',
        paymentId: 'payment-1',
        railId: 'rail-1',
        amount: 10000,
        status: 'COMPLETED',
        startedAt: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockTransaction);

      const result = await settlementApi.getTransaction('txn-1');

      expect(apiClient.get).toHaveBeenCalledWith('/settlements/transactions/txn-1');
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('getTransactionsByPayment', () => {
    it('should fetch transactions by payment ID', async () => {
      const mockTransactions = [
        {
          id: 'txn-1',
          paymentId: 'payment-1',
          railId: 'rail-1',
          amount: 10000,
          status: 'COMPLETED',
          startedAt: '2024-01-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'txn-2',
          paymentId: 'payment-1',
          railId: 'rail-1',
          amount: 5000,
          status: 'FAILED',
          startedAt: '2024-01-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockTransactions);

      const result = await settlementApi.getTransactionsByPayment('payment-1');

      expect(apiClient.get).toHaveBeenCalledWith('/settlements/transactions/payment/payment-1');
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('getRailStatistics', () => {
    it('should fetch rail statistics', async () => {
      const mockStats = {
        railId: 'rail-1',
        railName: 'NCHL Rail',
        totalTransactions: 1000,
        successfulTransactions: 950,
        failedTransactions: 50,
        totalAmount: 5000000,
        averageLatency: 2500,
        successRate: 95.0,
        uptime: 99.5,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockStats);

      const result = await settlementApi.getRailStatistics('rail-1');

      expect(apiClient.get).toHaveBeenCalledWith('/settlements/rails/rail-1/statistics');
      expect(result).toEqual(mockStats);
    });
  });

  describe('initializeDefaultRails', () => {
    it('should initialize default rails', async () => {
      const mockRails = [mockRail];

      vi.mocked(apiClient.post).mockResolvedValue(mockRails);

      const result = await settlementApi.initializeDefaultRails();

      expect(apiClient.post).toHaveBeenCalledWith('/settlements/initialize');
      expect(result).toEqual(mockRails);
    });
  });
});
