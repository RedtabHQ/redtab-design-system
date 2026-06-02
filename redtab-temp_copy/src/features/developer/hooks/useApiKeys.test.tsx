import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useApiKeys,
  useApiKey,
  useCreateApiKey,
  useRevokeApiKey,
  useDeleteApiKey,
  apiKeyKeys,
} from './useApiKeys';
import { apiKeyApi, apiKeyService } from '@/features/developer/services/apiKeyApi';
import type { ApiKey } from '@types';

// Mock the developer service module - include ApiService as a real class
// so the module-level `new ApiService<ApiKey>(...)` succeeds, and spy on
// apiKeyService methods for factory-generated hooks.
vi.mock('@/features/developer/services/apiKeyApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/developer/services/apiKeyApi')>();
  return {
    ...actual,
    apiKeyApi: {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      revoke: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe('useApiKeys Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  const mockApiKey: ApiKey = {
    id: 'K123',
    key: 'sk_test_12345',
    name: 'Production API Key',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastUsedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useApiKeys', () => {
    it('should fetch all API keys', async () => {
      const mockKeys = { items: [mockApiKey], total: 1, page: 1, pageSize: 10 };
      vi.spyOn(apiKeyService, 'getAll').mockResolvedValueOnce(mockKeys);

      const { result } = renderHook(() => useApiKeys(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockKeys);
      expect(apiKeyService.getAll).toHaveBeenCalled();
    });

    it('should handle API keys list error', async () => {
      const error = new Error('Failed to fetch API keys');
      vi.spyOn(apiKeyService, 'getAll').mockRejectedValueOnce(error);

      const { result } = renderHook(() => useApiKeys(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useApiKey', () => {
    it('should fetch single API key by ID', async () => {
      vi.spyOn(apiKeyService, 'getById').mockResolvedValueOnce(mockApiKey);

      const { result } = renderHook(() => useApiKey('K123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockApiKey);
      expect(apiKeyService.getById).toHaveBeenCalledWith('K123');
    });

    it('should not fetch when ID is empty', () => {
      const { result } = renderHook(() => useApiKey(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(apiKeyService.getById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateApiKey', () => {
    it('should create API key and invalidate list cache', async () => {
      const createData = {
        name: 'New API Key',
        scopes: ['read:merchants', 'write:contracts'],
      };

      vi.spyOn(apiKeyService, 'create').mockResolvedValueOnce(mockApiKey);

      const { result } = renderHook(() => useCreateApiKey(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate(createData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(apiKeyService.create).toHaveBeenCalledWith(createData);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: apiKeyKeys.lists() });
    });

    it('should handle create error', async () => {
      const error = new Error('API key limit reached');
      vi.spyOn(apiKeyService, 'create').mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreateApiKey(), { wrapper });

      result.current.mutate({ name: 'Test Key' });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRevokeApiKey', () => {
    it('should revoke API key and invalidate caches', async () => {
      vi.mocked(apiKeyApi.revoke).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useRevokeApiKey(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate('K123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(apiKeyApi.revoke).toHaveBeenCalledWith('K123');
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: apiKeyKeys.detail('K123') });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: apiKeyKeys.lists() });
    });

    it('should handle revoke error', async () => {
      const error = new Error('API key already revoked');
      vi.mocked(apiKeyApi.revoke).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useRevokeApiKey(), { wrapper });

      result.current.mutate('K123');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useDeleteApiKey', () => {
    it('should delete API key and invalidate list cache', async () => {
      vi.spyOn(apiKeyService, 'delete').mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useDeleteApiKey(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate('K123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(apiKeyService.delete).toHaveBeenCalledWith('K123');
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: apiKeyKeys.lists() });
    });

    it('should handle delete error', async () => {
      const error = new Error('Cannot delete active API key');
      vi.spyOn(apiKeyService, 'delete').mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDeleteApiKey(), { wrapper });

      result.current.mutate('K123');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });
});
