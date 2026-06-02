import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useContracts,
  useContract,
  useCreateContract,
  useUpdateContract,
  usePatchContract,
  useDeleteContract,
  useBulkDeleteContracts,
  useExportContractsCSV,
  contractKeys,
} from '@features/contracts/hooks';
import { contractService } from '@services';
import type { Contract } from '@types';

// Mock contract service
vi.mock('@services', () => ({
  contractService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    bulkDelete: vi.fn(),
  },
}));

describe('useContracts Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockContract: Contract = {
    id: 'C123',
    merchantId: 'M123',
    supplierId: 'S123',
    drawdownAmount: 100000,
    dueDate: '2024-12-31',
    status: 'ACTIVE',
    interestRate: 0.12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('contractKeys', () => {
    it('should generate correct query keys', () => {
      expect(contractKeys.all).toEqual(['contracts']);
      expect(contractKeys.lists()).toEqual(['contracts', 'list']);
      expect(contractKeys.list({ page: 1 })).toEqual(['contracts', 'list', { page: 1 }]);
      expect(contractKeys.details()).toEqual(['contracts', 'detail']);
      expect(contractKeys.detail('C123')).toEqual(['contracts', 'detail', 'C123']);
    });
  });

  describe('useContracts', () => {
    it('should fetch paginated contracts list', async () => {
      const mockResponse = {
        items: [mockContract],
        total: 1,
        page: 1,
        pageSize: 30,
      };

      vi.mocked(contractService.getAll).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useContracts({ page: 1 }), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockResponse);
      expect(contractService.getAll).toHaveBeenCalledWith({ page: 1 });
    });

    it('should support filtering by status and merchant', async () => {
      const mockResponse = {
        items: [mockContract],
        total: 1,
        page: 1,
        pageSize: 30,
      };

      const params = {
        status: 'ACTIVE' as const,
        merchantId: 'M123',
        overdueOnly: false,
      };

      vi.mocked(contractService.getAll).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useContracts(params), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(contractService.getAll).toHaveBeenCalledWith(params);
    });

    it('should handle contracts list error', async () => {
      const error = new Error('Failed to fetch contracts');
      vi.mocked(contractService.getAll).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useContracts(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useContract', () => {
    it('should fetch single contract by ID', async () => {
      vi.mocked(contractService.getById).mockResolvedValueOnce(mockContract);

      const { result } = renderHook(() => useContract('C123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockContract);
      expect(contractService.getById).toHaveBeenCalledWith('C123');
    });

    it('should not fetch when ID is empty', () => {
      const { result } = renderHook(() => useContract(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(contractService.getById).not.toHaveBeenCalled();
    });

    it('should handle contract detail error', async () => {
      const error = new Error('Contract not found');
      vi.mocked(contractService.getById).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useContract('C123'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useCreateContract', () => {
    it('should create contract and invalidate list cache', async () => {
      const newContract = {
        merchantId: 'M123',
        supplierId: 'S123',
        drawdownAmount: 100000,
      };

      vi.mocked(contractService.create).mockResolvedValueOnce(mockContract);

      const { result } = renderHook(() => useCreateContract(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate(newContract);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(contractService.create).toHaveBeenCalledWith(newContract);
      expect(result.current.data).toEqual(mockContract);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractKeys.lists() });
    });

    it('should handle create error', async () => {
      const error = new Error('Insufficient credit limit');
      vi.mocked(contractService.create).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreateContract(), { wrapper });

      result.current.mutate({ merchantId: 'M123', supplierId: 'S123', drawdownAmount: 100000 });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUpdateContract', () => {
    it('should update contract and invalidate caches', async () => {
      const updatedContract = { ...mockContract, status: 'PAID' as const };
      vi.mocked(contractService.update).mockResolvedValueOnce(updatedContract);

      const { result } = renderHook(() => useUpdateContract(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        id: 'C123',
        data: { status: 'PAID' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(contractService.update).toHaveBeenCalledWith('C123', { status: 'PAID' });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractKeys.lists() });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractKeys.detail('C123') });
    });

    it('should handle update error', async () => {
      const error = new Error('Update failed');
      vi.mocked(contractService.update).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUpdateContract(), { wrapper });

      result.current.mutate({ id: 'C123', data: {} });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('usePatchContract', () => {
    it('should patch contract with partial data', async () => {
      const patchedContract = { ...mockContract, drawdownAmount: 150000 };
      vi.mocked(contractService.patch).mockResolvedValueOnce(patchedContract);

      const { result } = renderHook(() => usePatchContract(), { wrapper });

      result.current.mutate({
        id: 'C123',
        data: { drawdownAmount: 150000 },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(contractService.patch).toHaveBeenCalledWith('C123', { drawdownAmount: 150000 });
    });
  });

  describe('useDeleteContract', () => {
    it('should delete contract and invalidate caches', async () => {
      vi.mocked(contractService.delete).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useDeleteContract(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
      const removeSpy = vi.spyOn(queryClient, 'removeQueries');

      result.current.mutate('C123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(contractService.delete).toHaveBeenCalledWith('C123');
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractKeys.lists() });
      expect(removeSpy).toHaveBeenCalledWith({ queryKey: contractKeys.detail('C123') });
    });

    it('should handle delete error', async () => {
      const error = new Error('Cannot delete active contract');
      vi.mocked(contractService.delete).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDeleteContract(), { wrapper });

      result.current.mutate('C123');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useBulkDeleteContracts', () => {
    it('should bulk delete contracts and invalidate caches', async () => {
      const ids = ['C123', 'C124', 'C125'];
      vi.mocked(contractService.bulkDelete).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useBulkDeleteContracts(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
      const removeSpy = vi.spyOn(queryClient, 'removeQueries');

      result.current.mutate(ids);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(contractService.bulkDelete).toHaveBeenCalledWith(ids);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: contractKeys.lists() });
      expect(removeSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('useExportContractsCSV', () => {
    it('should return a mutation object with mutate function', () => {
      const { result } = renderHook(() => useExportContractsCSV(), { wrapper });

      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('isPending');
      expect(result.current).toHaveProperty('isSuccess');
      expect(result.current).toHaveProperty('isError');
      expect(typeof result.current.mutate).toBe('function');
    });

    it('should have isPending false initially', () => {
      const { result } = renderHook(() => useExportContractsCSV(), { wrapper });

      expect(result.current.isPending).toBe(false);
    });

    it('should have isSuccess false initially', () => {
      const { result } = renderHook(() => useExportContractsCSV(), { wrapper });

      expect(result.current.isSuccess).toBe(false);
    });
  });
});
