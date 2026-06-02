import { describe, it, expect, beforeEach, vi } from 'vitest';
import { paymentApi } from './paymentApi';
import { apiClient } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('paymentApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new payment', async () => {
      const paymentData = {
        contractId: 'contract-123',
        amount: 5000,
        type: 'DISBURSEMENT' as const,
        supplierId: 'supplier-456',
      };

      const mockPayment = {
        id: 'payment-1',
        ...paymentData,
        status: 'PENDING',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockPayment);

      const result = await paymentApi.create(paymentData);

      expect(apiClient.post).toHaveBeenCalledWith('/payments', paymentData);
      expect(result).toEqual(mockPayment);
    });

    it('should create repayment payment', async () => {
      const paymentData = {
        contractId: 'contract-123',
        amount: 1000,
        type: 'REPAYMENT' as const,
      };

      const mockPayment = {
        id: 'payment-2',
        ...paymentData,
        status: 'COMPLETED',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockPayment);

      const result = await paymentApi.create(paymentData);

      expect(apiClient.post).toHaveBeenCalledWith('/payments', paymentData);
      expect(result).toEqual(mockPayment);
    });

    it('should handle payment creation error', async () => {
      const mockError = new Error('Insufficient funds');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const paymentData = {
        contractId: 'contract-123',
        amount: 5000,
        type: 'DISBURSEMENT' as const,
      };

      await expect(paymentApi.create(paymentData)).rejects.toThrow('Insufficient funds');
    });
  });

  describe('getById', () => {
    it('should fetch payment by ID', async () => {
      const mockPayment = {
        id: 'payment-1',
        contractId: 'contract-123',
        amount: 5000,
        type: 'DISBURSEMENT',
        status: 'COMPLETED',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockPayment);

      const result = await paymentApi.getById('payment-1');

      expect(apiClient.get).toHaveBeenCalledWith('/payments/payment-1');
      expect(result).toEqual(mockPayment);
    });

    it('should handle payment not found error', async () => {
      const mockError = new Error('Payment not found');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(paymentApi.getById('nonexistent')).rejects.toThrow('Payment not found');
    });
  });

  describe('getAll', () => {
    it('should fetch all payments without filters', async () => {
      const mockResponse = {
        data: [
          { id: 'payment-1', amount: 5000, type: 'DISBURSEMENT', status: 'COMPLETED' },
          { id: 'payment-2', amount: 1000, type: 'REPAYMENT', status: 'PENDING' },
        ],
        total: 2,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await paymentApi.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/payments', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch all payments with pagination', async () => {
      const mockResponse = {
        data: [
          { id: 'payment-1', amount: 5000, type: 'DISBURSEMENT', status: 'COMPLETED' },
        ],
        total: 10,
      };

      const params = { page: 1, limit: 10 };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await paymentApi.getAll(params);

      expect(apiClient.get).toHaveBeenCalledWith('/payments', { params });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch payments filtered by status', async () => {
      const mockResponse = {
        data: [
          { id: 'payment-1', amount: 5000, type: 'DISBURSEMENT', status: 'COMPLETED' },
        ],
        total: 1,
      };

      const params = { status: 'COMPLETED' };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await paymentApi.getAll(params);

      expect(apiClient.get).toHaveBeenCalledWith('/payments', { params });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch payments filtered by type', async () => {
      const mockResponse = {
        data: [
          { id: 'payment-1', amount: 5000, type: 'DISBURSEMENT', status: 'COMPLETED' },
        ],
        total: 1,
      };

      const params = { type: 'DISBURSEMENT' };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await paymentApi.getAll(params);

      expect(apiClient.get).toHaveBeenCalledWith('/payments', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getByContract', () => {
    it('should fetch payments by contract ID', async () => {
      const mockPayments = [
        { id: 'payment-1', contractId: 'contract-123', amount: 5000 },
        { id: 'payment-2', contractId: 'contract-123', amount: 1000 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockPayments);

      const result = await paymentApi.getByContract('contract-123');

      expect(apiClient.get).toHaveBeenCalledWith('/payments/contract/contract-123');
      expect(result).toEqual(mockPayments);
    });

    it('should handle empty payment list for contract', async () => {
      vi.mocked(apiClient.get).mockResolvedValue([]);

      const result = await paymentApi.getByContract('contract-123');

      expect(result).toEqual([]);
    });
  });

  describe('getByMerchant', () => {
    it('should fetch payments by merchant ID', async () => {
      const mockPayments = [
        { id: 'payment-1', merchantId: 'merchant-123', amount: 5000 },
        { id: 'payment-2', merchantId: 'merchant-123', amount: 1000 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockPayments);

      const result = await paymentApi.getByMerchant('merchant-123');

      expect(apiClient.get).toHaveBeenCalledWith('/payments/merchant/merchant-123');
      expect(result).toEqual(mockPayments);
    });

    it('should handle empty payment list for merchant', async () => {
      vi.mocked(apiClient.get).mockResolvedValue([]);

      const result = await paymentApi.getByMerchant('merchant-123');

      expect(result).toEqual([]);
    });
  });

  describe('getBySupplier', () => {
    it('should fetch payments by supplier ID', async () => {
      const mockPayments = [
        { id: 'payment-1', supplierId: 'supplier-456', amount: 5000 },
        { id: 'payment-2', supplierId: 'supplier-456', amount: 3000 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockPayments);

      const result = await paymentApi.getBySupplier('supplier-456');

      expect(apiClient.get).toHaveBeenCalledWith('/payments/supplier/supplier-456');
      expect(result).toEqual(mockPayments);
    });

    it('should handle empty payment list for supplier', async () => {
      vi.mocked(apiClient.get).mockResolvedValue([]);

      const result = await paymentApi.getBySupplier('supplier-456');

      expect(result).toEqual([]);
    });
  });

  describe('process', () => {
    it('should process a payment without data', async () => {
      const mockPayment = {
        id: 'payment-1',
        status: 'PROCESSING',
        amount: 5000,
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockPayment);

      const result = await paymentApi.process('payment-1');

      expect(apiClient.post).toHaveBeenCalledWith('/payments/payment-1/process', undefined);
      expect(result).toEqual(mockPayment);
    });

    it('should process a payment with rail ID', async () => {
      const mockPayment = {
        id: 'payment-1',
        status: 'PROCESSING',
        railId: 'rail-123',
        amount: 5000,
      };

      const processData = { railId: 'rail-123' };

      vi.mocked(apiClient.post).mockResolvedValue(mockPayment);

      const result = await paymentApi.process('payment-1', processData);

      expect(apiClient.post).toHaveBeenCalledWith('/payments/payment-1/process', processData);
      expect(result).toEqual(mockPayment);
    });

    it('should handle payment processing error', async () => {
      const mockError = new Error('Payment gateway unavailable');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(paymentApi.process('payment-1')).rejects.toThrow('Payment gateway unavailable');
    });
  });

  describe('retry', () => {
    it('should retry a failed payment', async () => {
      const mockPayment = {
        id: 'payment-1',
        status: 'PENDING',
        amount: 5000,
        retryCount: 1,
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockPayment);

      const result = await paymentApi.retry('payment-1');

      expect(apiClient.post).toHaveBeenCalledWith('/payments/payment-1/retry');
      expect(result).toEqual(mockPayment);
    });

    it('should handle retry limit exceeded error', async () => {
      const mockError = new Error('Maximum retry limit exceeded');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(paymentApi.retry('payment-1')).rejects.toThrow('Maximum retry limit exceeded');
    });
  });

  describe('cancel', () => {
    it('should cancel a payment', async () => {
      const mockPayment = {
        id: 'payment-1',
        status: 'CANCELLED',
        amount: 5000,
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockPayment);

      const result = await paymentApi.cancel('payment-1');

      expect(apiClient.post).toHaveBeenCalledWith('/payments/payment-1/cancel');
      expect(result).toEqual(mockPayment);
    });

    it('should handle cannot cancel completed payment error', async () => {
      const mockError = new Error('Cannot cancel completed payment');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(paymentApi.cancel('payment-1')).rejects.toThrow('Cannot cancel completed payment');
    });
  });

  describe('getStatistics', () => {
    it('should fetch payment statistics', async () => {
      const mockStats = {
        totalPayments: 1000,
        totalAmount: 5000000,
        successRate: 98.5,
        avgProcessingTime: 2.5,
        byType: {
          DISBURSEMENT: 600,
          REPAYMENT: 350,
          FEE_COLLECTION: 50,
        },
        byStatus: {
          COMPLETED: 985,
          PENDING: 10,
          FAILED: 5,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockStats);

      const result = await paymentApi.getStatistics();

      expect(apiClient.get).toHaveBeenCalledWith('/payments/statistics/overview');
      expect(result).toEqual(mockStats);
    });

    it('should handle error when fetching statistics', async () => {
      const mockError = new Error('Statistics unavailable');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(paymentApi.getStatistics()).rejects.toThrow('Statistics unavailable');
    });
  });
});
