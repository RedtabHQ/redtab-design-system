import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useCreditLineStatus,
  useCreditDecision,
  useEligibility,
  useRepayments,
  useDrawdown,
  usePostRepayment,
  creditKeys,
} from '@features/credit/hooks';
import { creditApi } from '@services';
import type { CreditLine, CreditDecision, EligibilityResult, Repayment } from '@types';
import { contractKeys } from '@/features/contracts/hooks/useContracts';
import { scheduleKeys } from '@/features/contracts/hooks/useSchedules';

// Mock credit API (preserve other service exports)
vi.mock('@services', async () => {
  const actual = await vi.importActual<typeof import('@services')>('@services');
  return {
    ...actual,
    creditApi: {
      getCreditLineStatus: vi.fn(),
      getCreditDecision: vi.fn(),
      checkEligibility: vi.fn(),
      getRepayments: vi.fn(),
      drawdown: vi.fn(),
      postRepayment: vi.fn(),
    },
  };
});

describe('useCredit Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;
  let wrapper: ({ children }: { children: React.ReactNode }) => React.JSX.Element;

  const mockCreditLine: CreditLine = {
    merchantId: 'M123',
    totalLimit: 500000,
    availableCredit: 350000,
    utilizedCredit: 150000,
    utilizationRate: 0.30,
    status: 'ACTIVE',
  };

  const mockCreditDecision: CreditDecision = {
    merchantId: 'M123',
    approved: true,
    creditLimit: 500000,
    interestRate: 0.12,
    tier: 'T1',
    reason: 'Good credit history',
  };

  const mockRepayment: Repayment = {
    id: 'R123',
    contractId: 'C123',
    amount: 50000,
    paymentDate: new Date().toISOString(),
    status: 'COMPLETED',
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);
    vi.clearAllMocks();
  });

  describe('creditKeys', () => {
    it('should generate correct query keys', () => {
      expect(creditKeys.all).toEqual(['credit']);
      expect(creditKeys.line('M123')).toEqual(['credit', 'line', 'M123']);
      expect(creditKeys.decision('M123')).toEqual(['credit', 'decision', 'M123']);
      expect(creditKeys.repayments('M123')).toEqual(['credit', 'repayments', 'M123']);
    });
  });

  describe('useCreditLineStatus', () => {
    it('should fetch credit line status for merchant', async () => {
      vi.mocked(creditApi.getCreditLineStatus).mockResolvedValueOnce(mockCreditLine);

      const { result } = renderHook(() => useCreditLineStatus('M123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockCreditLine);
      expect(creditApi.getCreditLineStatus).toHaveBeenCalledWith('M123');
    });

    it('should not fetch when merchant ID is empty', () => {
      const { result } = renderHook(() => useCreditLineStatus(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(creditApi.getCreditLineStatus).not.toHaveBeenCalled();
    });

    it('should handle credit line status error', async () => {
      const error = new Error('Merchant not found');
      vi.mocked(creditApi.getCreditLineStatus).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreditLineStatus('M123'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should support custom query options', () => {
      vi.mocked(creditApi.getCreditLineStatus).mockResolvedValueOnce(mockCreditLine);

      const { result } = renderHook(
        () => useCreditLineStatus('M123', { enabled: false }),
        { wrapper }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(creditApi.getCreditLineStatus).not.toHaveBeenCalled();
    });
  });

  describe('useCreditDecision', () => {
    it('should fetch credit decision for merchant', async () => {
      vi.mocked(creditApi.getCreditDecision).mockResolvedValueOnce(mockCreditDecision);

      const { result } = renderHook(() => useCreditDecision('M123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockCreditDecision);
      expect(creditApi.getCreditDecision).toHaveBeenCalledWith('M123');
    });

    it('should not fetch when merchant ID is empty', () => {
      const { result } = renderHook(() => useCreditDecision(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(creditApi.getCreditDecision).not.toHaveBeenCalled();
    });

    it('should handle credit decision error', async () => {
      const error = new Error('Decision not available');
      vi.mocked(creditApi.getCreditDecision).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreditDecision('M123'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useEligibility', () => {
    it('should check merchant eligibility', async () => {
      const mockEligibility: EligibilityResult = {
        eligible: true,
        maxAmount: 100000,
        reason: 'Sufficient credit available',
      };

      const params = {
        merchantId: 'M123',
        supplierId: 'S123',
        amount: 50000,
      };

      vi.mocked(creditApi.checkEligibility).mockResolvedValueOnce(mockEligibility);

      const { result } = renderHook(() => useEligibility(params), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockEligibility);
      expect(creditApi.checkEligibility).toHaveBeenCalledWith(params);
    });

    it('should not fetch when merchant or supplier ID is missing', () => {
      const { result: result1 } = renderHook(
        () => useEligibility({ merchantId: '', supplierId: 'S123' }),
        { wrapper }
      );

      const { result: result2 } = renderHook(
        () => useEligibility({ merchantId: 'M123', supplierId: '' }),
        { wrapper }
      );

      expect(result1.current.fetchStatus).toBe('idle');
      expect(result2.current.fetchStatus).toBe('idle');
      expect(creditApi.checkEligibility).not.toHaveBeenCalled();
    });

    it('should handle eligibility error', async () => {
      const error = new Error('Insufficient credit');
      vi.mocked(creditApi.checkEligibility).mockRejectedValueOnce(error);

      const { result } = renderHook(
        () => useEligibility({ merchantId: 'M123', supplierId: 'S123' }),
        { wrapper }
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRepayments', () => {
    it('should fetch repayment history for merchant', async () => {
      const mockRepayments = [mockRepayment];
      vi.mocked(creditApi.getRepayments).mockResolvedValueOnce(mockRepayments);

      const { result } = renderHook(() => useRepayments('M123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockRepayments);
      expect(creditApi.getRepayments).toHaveBeenCalledWith('M123');
    });

    it('should not fetch when merchant ID is empty', () => {
      const { result } = renderHook(() => useRepayments(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(creditApi.getRepayments).not.toHaveBeenCalled();
    });

    it('should handle repayments error', async () => {
      const error = new Error('Failed to fetch repayments');
      vi.mocked(creditApi.getRepayments).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useRepayments('M123'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useDrawdown', () => {
    it('should process drawdown and invalidate credit line cache', async () => {
      const drawdownData = {
        amount: 50000,
        supplierId: 'S123',
      };

      const updatedCreditLine = {
        ...mockCreditLine,
        availableCredit: 300000,
        utilizedCredit: 200000,
      };

      vi.mocked(creditApi.drawdown).mockResolvedValueOnce(updatedCreditLine);

      const { result } = renderHook(() => useDrawdown(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        merchantId: 'M123',
        data: drawdownData,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(creditApi.drawdown).toHaveBeenCalledWith({
        merchantId: 'M123',
        ...drawdownData,
      });
      expect(result.current.data).toEqual(updatedCreditLine);
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: creditKeys.line('M123'),
      });
    });

    it('should handle drawdown error', async () => {
      const error = new Error('Insufficient credit available');
      vi.mocked(creditApi.drawdown).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDrawdown(), { wrapper });

      result.current.mutate({
        merchantId: 'M123',
        data: { amount: 50000, supplierId: 'S123' },
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should support custom onSuccess callback', async () => {
      vi.mocked(creditApi.drawdown).mockResolvedValueOnce(mockCreditLine);
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useDrawdown({ onSuccess }), { wrapper });

      result.current.mutate({
        merchantId: 'M123',
        data: { amount: 50000, supplierId: 'S123' },
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });
  });

  describe('usePostRepayment', () => {
    it('should post repayment and invalidate all credit caches', async () => {
      const repaymentData = {
        amount: 50000,
        paymentMethod: 'BANK_TRANSFER' as const,
      };

      vi.mocked(creditApi.postRepayment).mockResolvedValueOnce(mockRepayment);

      const { result } = renderHook(() => usePostRepayment(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        contractId: 'C123',
        ...repaymentData,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(creditApi.postRepayment).toHaveBeenCalledWith({
        contractId: 'C123',
        ...repaymentData,
      });
      expect(result.current.data).toEqual(mockRepayment);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: creditKeys.all });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractKeys.detail('C123') });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: scheduleKeys.all('C123') });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: scheduleKeys.nextDue('C123') });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: scheduleKeys.summary('C123') });
    });

    it('should handle post repayment error', async () => {
      const error = new Error('Invalid payment amount');
      vi.mocked(creditApi.postRepayment).mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePostRepayment(), { wrapper });

      result.current.mutate({
        contractId: 'C123',
        amount: 50000,
        paymentMethod: 'BANK_TRANSFER',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should support custom onSuccess callback', async () => {
      vi.mocked(creditApi.postRepayment).mockResolvedValueOnce(mockRepayment);
      const onSuccess = vi.fn();

      const { result } = renderHook(() => usePostRepayment({ onSuccess }), { wrapper });

      result.current.mutate({
        contractId: 'C123',
        amount: 50000,
        paymentMethod: 'BANK_TRANSFER',
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });
  });

  describe('Loading States', () => {
    it('should track pending state during drawdown', async () => {
      let resolveDrawdown: ((value: CreditLine) => void) | undefined;
      vi.mocked(creditApi.drawdown).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveDrawdown = resolve;
        })
      );

      const { result } = renderHook(() => useDrawdown(), { wrapper });

      result.current.mutate({
        merchantId: 'M123',
        data: { amount: 50000, supplierId: 'S123' },
      });

      await waitFor(() => expect(result.current.isPending).toBe(true));

      resolveDrawdown?.(mockCreditLine);

      await waitFor(() => expect(result.current.isPending).toBe(false));
    });
  });
});
