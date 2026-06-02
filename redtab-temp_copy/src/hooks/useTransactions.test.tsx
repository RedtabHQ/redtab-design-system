import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useTransactions,
  useTransaction,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  transactionKeys,
} from './useTransactions';
import { transactionService } from '@services';
import type { Transaction } from '@types';

// Mock transaction service
vi.mock('@services', () => ({
  transactionService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    bulkDelete: vi.fn(),
  },
}));

describe('useTransactions Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  const mockTransaction: Transaction = {
    id: 'T123',
    type: 'DISBURSEMENT',
    amount: 50000,
    status: 'COMPLETED',
    merchantId: 'M123',
    contractId: 'C123',
    timestamp: new Date().toISOString(),
    reconciled: true,
    merchantName: 'Test Merchant',
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const getWrapper = () => ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useTransactions', () => {
    it('should fetch paginated transactions list', async () => {
      const mockResponse = {
        items: [mockTransaction],
        total: 1,
        page: 1,
        pageSize: 30,
      };

      vi.mocked(transactionService.getAll).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useTransactions({ page: 1 }), { wrapper: getWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockResponse);
      expect(transactionService.getAll).toHaveBeenCalledWith({ page: 1 });
    });

    it('should support filtering by type, status, and date range', async () => {
      const mockResponse = {
        items: [mockTransaction],
        total: 1,
        page: 1,
        pageSize: 30,
      };

      const params = {
        type: 'DISBURSEMENT' as const,
        status: 'COMPLETED' as const,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        reconciled: true,
      };

      vi.mocked(transactionService.getAll).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useTransactions(params), { wrapper: getWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(transactionService.getAll).toHaveBeenCalledWith(params);
    });
  });

  describe('useTransaction', () => {
    it('should fetch single transaction by ID', async () => {
      vi.mocked(transactionService.getById).mockResolvedValueOnce(mockTransaction);

      const { result } = renderHook(() => useTransaction('T123'), { wrapper: getWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockTransaction);
      expect(transactionService.getById).toHaveBeenCalledWith('T123');
    });
  });

  describe('useCreateTransaction', () => {
    it('should create transaction and invalidate list cache', async () => {
      const newTransaction = {
        type: 'DISBURSEMENT' as const,
        amount: 50000,
        merchantId: 'M123',
        merchantName: 'Test Merchant',
        contractId: 'C123',
      };

      vi.mocked(transactionService.create).mockResolvedValueOnce(mockTransaction);

      const { result } = renderHook(() => useCreateTransaction(), { wrapper: getWrapper() });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate(newTransaction);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(transactionService.create).toHaveBeenCalledWith(newTransaction);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: transactionKeys.lists() });
    });
  });
});
