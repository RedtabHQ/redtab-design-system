import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useMerchants,
  useMerchant,
  useCreateMerchant,
  useUpdateMerchant,
  usePatchMerchant,
  useDeleteMerchant,
  useBulkDeleteMerchants,
  merchantKeys,
} from '@features/merchants/hooks';
import { merchantService } from '@services';
import type { Merchant } from '@types';

// Mock merchant service
vi.mock('@services', () => ({
  merchantService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    bulkDelete: vi.fn(),
  },
}));

describe('useMerchants Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  const mockMerchant: Merchant = {
    id: 'M123',
    name: 'Test Merchant',
    email: 'merchant@example.com',
    phone: '+977 1234567890',
    status: 'VERIFIED',
    tier: 'T1',
    creditScore: 750,
    creditLimit: 100000,
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

  describe('merchantKeys', () => {
    it('should generate correct query keys', () => {
      expect(merchantKeys.all).toEqual(['merchants']);
      expect(merchantKeys.lists()).toEqual(['merchants', 'list']);
      expect(merchantKeys.list({ page: 1 })).toEqual(['merchants', 'list', { page: 1 }]);
      expect(merchantKeys.details()).toEqual(['merchants', 'detail']);
      expect(merchantKeys.detail('M123')).toEqual(['merchants', 'detail', 'M123']);
    });
  });

  describe('useMerchants', () => {
    it('should fetch paginated merchants list', async () => {
      const mockResponse = {
        items: [mockMerchant],
        total: 1,
        page: 1,
        pageSize: 30,
      };

      vi.mocked(merchantService.getAll).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useMerchants({ page: 1, pageSize: 30 }), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockResponse);
      expect(merchantService.getAll).toHaveBeenCalledWith({ page: 1, pageSize: 30 });
    });

    it('should support filtering and sorting', async () => {
      const mockResponse = {
        items: [mockMerchant],
        total: 1,
        page: 1,
        pageSize: 30,
      };

      const params = {
        page: 1,
        pageSize: 30,
        search: 'restaurant',
        status: 'VERIFIED' as const,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
      };

      vi.mocked(merchantService.getAll).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useMerchants(params), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(merchantService.getAll).toHaveBeenCalledWith(params);
    });

    it('should handle merchants list error', async () => {
      const error = new Error('Failed to fetch merchants');
      vi.mocked(merchantService.getAll).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useMerchants(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should keep previous data during refetch', async () => {
      const mockResponse1 = {
        items: [mockMerchant],
        total: 1,
        page: 1,
        pageSize: 30,
      };

      const mockResponse2 = {
        items: [{ ...mockMerchant, id: 'M124' }],
        total: 1,
        page: 2,
        pageSize: 30,
      };

      vi.mocked(merchantService.getAll)
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const { result, rerender } = renderHook(
        ({ page }) => useMerchants({ page }),
        {
          wrapper,
          initialProps: { page: 1 },
        }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockResponse1);

      rerender({ page: 2 });

      await waitFor(() => expect(merchantService.getAll).toHaveBeenCalledTimes(2));
    });
  });

  describe('useMerchant', () => {
    it('should fetch single merchant by ID', async () => {
      vi.mocked(merchantService.getById).mockResolvedValueOnce(mockMerchant);

      const { result } = renderHook(() => useMerchant('M123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockMerchant);
      expect(merchantService.getById).toHaveBeenCalledWith('M123');
    });

    it('should not fetch when ID is empty', () => {
      const { result } = renderHook(() => useMerchant(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(merchantService.getById).not.toHaveBeenCalled();
    });

    it('should handle merchant detail error', async () => {
      const error = new Error('Merchant not found');
      vi.mocked(merchantService.getById).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useMerchant('M123'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should support conditional fetching', () => {
      const { result } = renderHook(
        () => useMerchant('M123', { enabled: false }),
        { wrapper }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(merchantService.getById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateMerchant', () => {
    it('should create merchant and invalidate list cache', async () => {
      const newMerchant = {
        name: 'New Merchant',
        email: 'new@example.com',
        phone: '+977 9876543210',
      };

      vi.mocked(merchantService.create).mockResolvedValueOnce(mockMerchant);

      const { result } = renderHook(() => useCreateMerchant(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate(newMerchant);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(merchantService.create).toHaveBeenCalledWith(newMerchant);
      expect(result.current.data).toEqual(mockMerchant);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: merchantKeys.lists() });
    });

    it('should handle create error', async () => {
      const error = new Error('Email already exists');
      vi.mocked(merchantService.create).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreateMerchant(), { wrapper });

      result.current.mutate({ name: 'Test', email: 'test@example.com' });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should support custom onSuccess callback', async () => {
      vi.mocked(merchantService.create).mockResolvedValueOnce(mockMerchant);
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useCreateMerchant({ onSuccess }), { wrapper });

      result.current.mutate({ name: 'Test' });

      await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(mockMerchant, { name: 'Test' }, undefined, expect.anything()));
    });
  });

  describe('useUpdateMerchant', () => {
    it('should update merchant and invalidate caches', async () => {
      const updatedMerchant = { ...mockMerchant, status: 'VERIFIED' as const };
      vi.mocked(merchantService.update).mockResolvedValueOnce(updatedMerchant);

      const { result } = renderHook(() => useUpdateMerchant(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        id: 'M123',
        data: { status: 'VERIFIED' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(merchantService.update).toHaveBeenCalledWith('M123', { status: 'VERIFIED' });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: merchantKeys.lists() });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: merchantKeys.detail('M123') });
    });

    it('should handle update error', async () => {
      const error = new Error('Update failed');
      vi.mocked(merchantService.update).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUpdateMerchant(), { wrapper });

      result.current.mutate({ id: 'M123', data: {} });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('usePatchMerchant', () => {
    it('should patch merchant with partial data', async () => {
      const patchedMerchant = { ...mockMerchant, creditLimit: 150000 };
      vi.mocked(merchantService.patch).mockResolvedValueOnce(patchedMerchant);

      const { result } = renderHook(() => usePatchMerchant(), { wrapper });

      result.current.mutate({
        id: 'M123',
        data: { creditLimit: 150000 },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(merchantService.patch).toHaveBeenCalledWith('M123', { creditLimit: 150000 });
    });

    it('should handle patch error', async () => {
      const error = new Error('Patch failed');
      vi.mocked(merchantService.patch).mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePatchMerchant(), { wrapper });

      result.current.mutate({ id: 'M123', data: {} });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useDeleteMerchant', () => {
    it('should delete merchant and invalidate caches', async () => {
      vi.mocked(merchantService.delete).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useDeleteMerchant(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
      const removeSpy = vi.spyOn(queryClient, 'removeQueries');

      result.current.mutate('M123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(merchantService.delete).toHaveBeenCalledWith('M123');
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: merchantKeys.lists() });
      expect(removeSpy).toHaveBeenCalledWith({ queryKey: merchantKeys.detail('M123') });
    });

    it('should handle delete error', async () => {
      const error = new Error('Delete failed');
      vi.mocked(merchantService.delete).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDeleteMerchant(), { wrapper });

      result.current.mutate('M123');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useBulkDeleteMerchants', () => {
    it('should bulk delete merchants and invalidate caches', async () => {
      const ids = ['M123', 'M124', 'M125'];
      vi.mocked(merchantService.bulkDelete).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useBulkDeleteMerchants(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
      const removeSpy = vi.spyOn(queryClient, 'removeQueries');

      result.current.mutate(ids);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(merchantService.bulkDelete).toHaveBeenCalledWith(ids);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: merchantKeys.lists() });
      expect(removeSpy).toHaveBeenCalledTimes(3);
    });

    it('should handle bulk delete error', async () => {
      const error = new Error('Bulk delete failed');
      vi.mocked(merchantService.bulkDelete).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useBulkDeleteMerchants(), { wrapper });

      result.current.mutate(['M123', 'M124']);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('Loading States', () => {
    it('should track pending state during mutations', async () => {
      let resolveCreate: ((value: Merchant) => void) | undefined;
      vi.mocked(merchantService.create).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveCreate = resolve;
        })
      );

      const { result } = renderHook(() => useCreateMerchant(), { wrapper });

      result.current.mutate({ name: 'Test' });

      await waitFor(() => expect(result.current.isPending).toBe(true));

      resolveCreate?.(mockMerchant);

      await waitFor(() => expect(result.current.isPending).toBe(false));
    });
  });
});
