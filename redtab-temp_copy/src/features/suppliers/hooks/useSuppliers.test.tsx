import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useSuppliers,
  useSupplier,
  useCreateSupplier,
  useUpdateSupplier,
  usePatchSupplier,
  useDeleteSupplier,
  useBulkDeleteSuppliers,
  supplierKeys,
} from '@features/suppliers/hooks';
import { supplierService } from '@services';
import type { Supplier } from '@types';

// Mock supplier service
vi.mock('@services', () => ({
  supplierService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    bulkDelete: vi.fn(),
  },
  supplierCategoryService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    bulkDelete: vi.fn(),
  },
}));

describe('useSuppliers Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockSupplier: Supplier = {
    id: 'S123',
    name: 'Test Supplier',
    email: 'supplier@example.com',
    phone: '+977 1234567890',
    category: 'Electronics',
    isVerified: true,
    settlementMode: 'AUTO',
    supplierFeeRate: 0.02,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('supplierKeys', () => {
    it('should generate correct query keys', () => {
      expect(supplierKeys.all).toEqual(['suppliers']);
      expect(supplierKeys.lists()).toEqual(['suppliers', 'list']);
      expect(supplierKeys.detail('S123')).toEqual(['suppliers', 'detail', 'S123']);
    });
  });

  describe('useSuppliers', () => {
    it('should fetch paginated suppliers list', async () => {
      const mockResponse = {
        items: [mockSupplier],
        total: 1,
        page: 1,
        pageSize: 30,
      };

      vi.mocked(supplierService.getAll).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useSuppliers({ page: 1 }), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockResponse);
      expect(supplierService.getAll).toHaveBeenCalledWith({ page: 1 });
    });

    it('should support filtering by category and verification status', async () => {
      const mockResponse = {
        items: [mockSupplier],
        total: 1,
        page: 1,
        pageSize: 30,
      };

      const params = {
        category: 'Electronics',
        isVerified: true,
        settlementMode: 'AUTO' as const,
      };

      vi.mocked(supplierService.getAll).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useSuppliers(params), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(supplierService.getAll).toHaveBeenCalledWith(params);
    });

    it('should handle suppliers list error', async () => {
      const error = new Error('Failed to fetch suppliers');
      vi.mocked(supplierService.getAll).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useSuppliers(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useSupplier', () => {
    it('should fetch single supplier by ID', async () => {
      vi.mocked(supplierService.getById).mockResolvedValueOnce(mockSupplier);

      const { result } = renderHook(() => useSupplier('S123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSupplier);
      expect(supplierService.getById).toHaveBeenCalledWith('S123');
    });

    it('should not fetch when ID is empty', () => {
      const { result } = renderHook(() => useSupplier(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(supplierService.getById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateSupplier', () => {
    it('should create supplier and invalidate list cache', async () => {
      const newSupplier = {
        name: 'New Supplier',
        email: 'new@example.com',
        category: 'Electronics',
      };

      vi.mocked(supplierService.create).mockResolvedValueOnce(mockSupplier);

      const { result } = renderHook(() => useCreateSupplier(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate(newSupplier);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(supplierService.create).toHaveBeenCalledWith(newSupplier);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: supplierKeys.lists() });
    });
  });

  describe('useUpdateSupplier', () => {
    it('should update supplier and invalidate caches', async () => {
      const updatedSupplier = { ...mockSupplier, isVerified: true };
      vi.mocked(supplierService.update).mockResolvedValueOnce(updatedSupplier);

      const { result } = renderHook(() => useUpdateSupplier(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        id: 'S123',
        data: { isVerified: true },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(supplierService.update).toHaveBeenCalledWith('S123', { isVerified: true });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: supplierKeys.lists() });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: supplierKeys.detail('S123') });
    });
  });

  describe('useDeleteSupplier', () => {
    it('should delete supplier and invalidate caches', async () => {
      vi.mocked(supplierService.delete).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useDeleteSupplier(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
      const removeSpy = vi.spyOn(queryClient, 'removeQueries');

      result.current.mutate('S123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(supplierService.delete).toHaveBeenCalledWith('S123');
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: supplierKeys.lists() });
      expect(removeSpy).toHaveBeenCalledWith({ queryKey: supplierKeys.detail('S123') });
    });
  });
});
