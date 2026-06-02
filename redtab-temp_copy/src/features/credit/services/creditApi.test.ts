import { describe, it, expect, beforeEach, vi } from 'vitest';
import { creditApi } from './creditApi';
import { apiClient } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('creditApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCreditLineStatus', () => {
    it('should fetch credit line status for merchant', async () => {
      const mockCreditLine = {
        id: '1',
        merchantId: 'merchant-123',
        limit: 100000,
        available: 75000,
        utilized: 25000,
        status: 'ACTIVE',
        utilizationRate: 25,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockCreditLine);

      const result = await creditApi.getCreditLineStatus('merchant-123');

      expect(apiClient.get).toHaveBeenCalledWith('/lines/merchant-123/status');
      expect(result).toEqual(mockCreditLine);
    });

    it('should handle credit line not found error', async () => {
      const mockError = new Error('Credit line not found');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(creditApi.getCreditLineStatus('nonexistent')).rejects.toThrow('Credit line not found');
    });
  });

  describe('drawdown', () => {
    it('should create drawdown with all fields', async () => {
      const drawdownData = {
        merchantId: 'merchant-123',
        amount: 10000,
        supplierId: 'supplier-456',
        purpose: 'Inventory purchase',
        tenureDays: 30,
      };

      const mockContract = {
        id: 'contract-1',
        ...drawdownData,
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockContract);

      const result = await creditApi.drawdown(drawdownData);

      expect(apiClient.post).toHaveBeenCalledWith('/contracts/drawdown', drawdownData);
      expect(result).toEqual(mockContract);
    });

    it('should create drawdown with minimal fields', async () => {
      const drawdownData = {
        merchantId: 'merchant-123',
        amount: 5000,
      };

      const mockContract = {
        id: 'contract-2',
        ...drawdownData,
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockContract);

      const result = await creditApi.drawdown(drawdownData);

      expect(apiClient.post).toHaveBeenCalledWith('/contracts/drawdown', drawdownData);
      expect(result).toEqual(mockContract);
    });

    it('should handle insufficient credit error', async () => {
      const mockError = new Error('Insufficient credit available');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const drawdownData = {
        merchantId: 'merchant-123',
        amount: 100000,
      };

      await expect(creditApi.drawdown(drawdownData)).rejects.toThrow('Insufficient credit available');
    });

    it('should handle frozen credit line error', async () => {
      const mockError = new Error('Credit line is frozen');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const drawdownData = {
        merchantId: 'merchant-123',
        amount: 5000,
      };

      await expect(creditApi.drawdown(drawdownData)).rejects.toThrow('Credit line is frozen');
    });
  });

  describe('postRepayment', () => {
    it('should post repayment with all fields', async () => {
      const repaymentData = {
        contractId: 'contract-123',
        amount: 5000,
        paymentMethod: 'BANK_TRANSFER',
        transactionRef: 'TXN-12345',
      };

      const mockRepayment = {
        id: 'repayment-1',
        ...repaymentData,
        status: 'COMPLETED',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockRepayment);

      const result = await creditApi.postRepayment(repaymentData);

      expect(apiClient.post).toHaveBeenCalledWith('/repayments/post', repaymentData);
      expect(result).toEqual(mockRepayment);
    });

    it('should post repayment with minimal fields', async () => {
      const repaymentData = {
        contractId: 'contract-123',
        amount: 5000,
      };

      const mockRepayment = {
        id: 'repayment-2',
        ...repaymentData,
        status: 'COMPLETED',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockRepayment);

      const result = await creditApi.postRepayment(repaymentData);

      expect(apiClient.post).toHaveBeenCalledWith('/repayments/post', repaymentData);
      expect(result).toEqual(mockRepayment);
    });

    it('should handle contract not found error', async () => {
      const mockError = new Error('Contract not found');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const repaymentData = {
        contractId: 'nonexistent',
        amount: 5000,
      };

      await expect(creditApi.postRepayment(repaymentData)).rejects.toThrow('Contract not found');
    });

    it('should handle invalid amount error', async () => {
      const mockError = new Error('Amount exceeds outstanding balance');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const repaymentData = {
        contractId: 'contract-123',
        amount: 50000,
      };

      await expect(creditApi.postRepayment(repaymentData)).rejects.toThrow('Amount exceeds outstanding balance');
    });
  });

  describe('evaluateEligibility', () => {
    it('should evaluate eligibility with merchant ID only', async () => {
      const params = {
        merchantId: 'merchant-123',
      };

      const mockEligibility = {
        eligible: true,
        score: 750,
        recommendedLimit: 100000,
        tier: 'A',
        reasons: ['Good payment history', 'Strong financials'],
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockEligibility);

      const result = await creditApi.evaluateEligibility(params);

      expect(apiClient.post).toHaveBeenCalledWith('/decisions/eligibility', params);
      expect(result).toEqual(mockEligibility);
    });

    it('should evaluate eligibility with requested amount', async () => {
      const params = {
        merchantId: 'merchant-123',
        requestedAmount: 50000,
      };

      const mockEligibility = {
        eligible: true,
        score: 720,
        approvedAmount: 50000,
        tier: 'B',
        reasons: ['Requested amount within limits'],
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockEligibility);

      const result = await creditApi.evaluateEligibility(params);

      expect(apiClient.post).toHaveBeenCalledWith('/decisions/eligibility', params);
      expect(result).toEqual(mockEligibility);
    });

    it('should handle ineligible merchant', async () => {
      const params = {
        merchantId: 'merchant-456',
        requestedAmount: 100000,
      };

      const mockEligibility = {
        eligible: false,
        score: 450,
        recommendedLimit: 0,
        tier: 'D',
        reasons: ['Poor payment history', 'High risk profile'],
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockEligibility);

      const result = await creditApi.evaluateEligibility(params);

      expect(result.eligible).toBe(false);
      expect(result.score).toBeLessThan(500);
    });

    it('should handle evaluation error', async () => {
      const mockError = new Error('Merchant not found');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const params = {
        merchantId: 'nonexistent',
      };

      await expect(creditApi.evaluateEligibility(params)).rejects.toThrow('Merchant not found');
    });
  });
});
