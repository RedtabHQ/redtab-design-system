import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  usePayments,
  usePayment,
  usePaymentsByContract,
  usePaymentsByMerchant,
  usePaymentsBySupplier,
  usePaymentStatistics,
  useCreatePayment,
  useProcessPayment,
  useRetryPayment,
  useCancelPayment,
} from '@features/payment/hooks';
import { paymentApi } from '@services';
import type { Payment, PaymentStats } from '@types';

// Mock payment API and service
vi.mock('@services', () => ({
  paymentApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getByContract: vi.fn(),
    getByMerchant: vi.fn(),
    getBySupplier: vi.fn(),
    getStatistics: vi.fn(),
    create: vi.fn(),
    process: vi.fn(),
    retry: vi.fn(),
    cancel: vi.fn(),
  },
}));


describe('usePayments Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  const mockPayment: Payment = {
    id: 'PAY123',
    amount: 50000,
    status: 'COMPLETED',
    type: 'DRAWDOWN',
    contractId: 'C123',
    merchantId: 'M123',
    supplierId: 'S123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('usePayments', () => {
    it('should fetch paginated payments list', async () => {
      const mockResponse = {
        data: [mockPayment],
        total: 1,
      };

      vi.mocked(paymentApi.getAll).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => usePayments({ page: 1, limit: 20 }), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockResponse);
      expect(paymentApi.getAll).toHaveBeenCalledWith({ page: 1, limit: 20 });
    });

    it('should support status and type filtering', async () => {
      const mockResponse = { data: [mockPayment], total: 1 };

      vi.mocked(paymentApi.getAll).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(
        () => usePayments({ status: 'COMPLETED', type: 'DRAWDOWN' }),
        { wrapper }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(paymentApi.getAll).toHaveBeenCalledWith({ status: 'COMPLETED', type: 'DRAWDOWN' });
    });

    it('should handle payments list error', async () => {
      const error = new Error('Failed to fetch payments');
      vi.mocked(paymentApi.getAll).mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePayments(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('usePayment', () => {
    it('should fetch single payment by ID', async () => {
      vi.mocked(paymentApi.getById).mockResolvedValueOnce(mockPayment);

      const { result } = renderHook(() => usePayment('PAY123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPayment);
      expect(paymentApi.getById).toHaveBeenCalledWith('PAY123');
    });

    it('should not fetch when ID is empty', () => {
      const { result } = renderHook(() => usePayment(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(paymentApi.getById).not.toHaveBeenCalled();
    });

    it('should handle payment detail error', async () => {
      const error = new Error('Payment not found');
      vi.mocked(paymentApi.getById).mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePayment('PAY123'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('usePaymentsByContract', () => {
    it('should fetch payments for a contract', async () => {
      const mockPayments = [mockPayment];
      vi.mocked(paymentApi.getByContract).mockResolvedValueOnce(mockPayments);

      const { result } = renderHook(() => usePaymentsByContract('C123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPayments);
      expect(paymentApi.getByContract).toHaveBeenCalledWith('C123');
    });

    it('should not fetch when contract ID is empty', () => {
      const { result } = renderHook(() => usePaymentsByContract(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(paymentApi.getByContract).not.toHaveBeenCalled();
    });
  });

  describe('usePaymentsByMerchant', () => {
    it('should fetch payments for a merchant', async () => {
      const mockPayments = [mockPayment];
      vi.mocked(paymentApi.getByMerchant).mockResolvedValueOnce(mockPayments);

      const { result } = renderHook(() => usePaymentsByMerchant('M123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPayments);
      expect(paymentApi.getByMerchant).toHaveBeenCalledWith('M123');
    });

    it('should not fetch when merchant ID is empty', () => {
      const { result } = renderHook(() => usePaymentsByMerchant(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(paymentApi.getByMerchant).not.toHaveBeenCalled();
    });
  });

  describe('usePaymentsBySupplier', () => {
    it('should fetch payments for a supplier', async () => {
      const mockPayments = [mockPayment];
      vi.mocked(paymentApi.getBySupplier).mockResolvedValueOnce(mockPayments);

      const { result } = renderHook(() => usePaymentsBySupplier('S123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPayments);
      expect(paymentApi.getBySupplier).toHaveBeenCalledWith('S123', undefined);
    });

    it('should not fetch when supplier ID is empty', () => {
      const { result } = renderHook(() => usePaymentsBySupplier(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(paymentApi.getBySupplier).not.toHaveBeenCalled();
    });
  });

  describe('usePaymentStatistics', () => {
    it('should fetch payment statistics', async () => {
      const mockStats: PaymentStats = {
        totalAmount: 1000000,
        completedCount: 50,
        pendingCount: 5,
        failedCount: 2,
        avgProcessingTime: 3600,
      };

      vi.mocked(paymentApi.getStatistics).mockResolvedValueOnce(mockStats);

      const { result } = renderHook(() => usePaymentStatistics(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockStats);
      expect(paymentApi.getStatistics).toHaveBeenCalled();
    });

    it('should handle statistics error', async () => {
      const error = new Error('Failed to fetch statistics');
      vi.mocked(paymentApi.getStatistics).mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePaymentStatistics(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useCreatePayment', () => {
    it('should create payment and invalidate caches', async () => {
      const createData = {
        amount: 50000,
        contractId: 'C123',
        type: 'DRAWDOWN' as const,
      };

      vi.mocked(paymentApi.create).mockResolvedValueOnce(mockPayment);

      const { result } = renderHook(() => useCreatePayment(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate(createData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(paymentApi.create).toHaveBeenCalledWith(createData);
      expect(result.current.data).toEqual(mockPayment);
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: expect.arrayContaining(['payments', 'list']) })
      );
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: expect.arrayContaining(['payments', 'statistics']) })
      );
    });

    it('should handle create error', async () => {
      const error = new Error('Insufficient credit');
      vi.mocked(paymentApi.create).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreatePayment(), { wrapper });

      result.current.mutate({ amount: 50000, contractId: 'C123', type: 'DRAWDOWN' });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useProcessPayment', () => {
    it('should process payment and invalidate caches', async () => {
      const processedPayment = { ...mockPayment, status: 'PROCESSING' as const };
      vi.mocked(paymentApi.process).mockResolvedValueOnce(processedPayment);

      const { result } = renderHook(() => useProcessPayment(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({ paymentId: 'PAY123' });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(paymentApi.process).toHaveBeenCalledWith('PAY123', undefined);
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: expect.arrayContaining(['payments', 'detail', 'PAY123']) })
      );
    });

    it('should process payment with additional data', async () => {
      const processedPayment = { ...mockPayment, status: 'PROCESSING' as const };
      const processData = { notes: 'Expedited processing' };

      vi.mocked(paymentApi.process).mockResolvedValueOnce(processedPayment);

      const { result } = renderHook(() => useProcessPayment(), { wrapper });

      result.current.mutate({ paymentId: 'PAY123', data: processData });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(paymentApi.process).toHaveBeenCalledWith('PAY123', processData);
    });

    it('should handle process error', async () => {
      const error = new Error('Processing failed');
      vi.mocked(paymentApi.process).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useProcessPayment(), { wrapper });

      result.current.mutate({ paymentId: 'PAY123' });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRetryPayment', () => {
    it('should retry failed payment and invalidate caches', async () => {
      const retriedPayment = { ...mockPayment, status: 'PENDING' as const };
      vi.mocked(paymentApi.retry).mockResolvedValueOnce(retriedPayment);

      const { result } = renderHook(() => useRetryPayment(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate('PAY123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(paymentApi.retry).toHaveBeenCalledWith('PAY123');
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: expect.arrayContaining(['payments', 'detail', 'PAY123']) })
      );
    });

    it('should handle retry error', async () => {
      const error = new Error('Cannot retry completed payment');
      vi.mocked(paymentApi.retry).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useRetryPayment(), { wrapper });

      result.current.mutate('PAY123');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useCancelPayment', () => {
    it('should cancel payment and invalidate caches', async () => {
      const cancelledPayment = { ...mockPayment, status: 'CANCELLED' as const };
      vi.mocked(paymentApi.cancel).mockResolvedValueOnce(cancelledPayment);

      const { result } = renderHook(() => useCancelPayment(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate('PAY123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(paymentApi.cancel).toHaveBeenCalledWith('PAY123');
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: expect.arrayContaining(['payments', 'detail', 'PAY123']) })
      );
    });

    it('should handle cancel error', async () => {
      const error = new Error('Cannot cancel completed payment');
      vi.mocked(paymentApi.cancel).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCancelPayment(), { wrapper });

      result.current.mutate('PAY123');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('Loading States', () => {
    it('should track pending state during mutations', async () => {
      let resolveCreate: ((value: Payment) => void) | undefined;
      vi.mocked(paymentApi.create).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveCreate = resolve;
        })
      );

      const { result } = renderHook(() => useCreatePayment(), { wrapper });

      result.current.mutate({ amount: 50000, contractId: 'C123', type: 'DRAWDOWN' });

      await waitFor(() => expect(result.current.isPending).toBe(true));

      resolveCreate?.(mockPayment);

      await waitFor(() => expect(result.current.isPending).toBe(false));
    });
  });
});
