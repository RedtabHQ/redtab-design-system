import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiKeyApi } from './apiKeyApi';
import { apiClient } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('apiKeyApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create API key with all fields', async () => {
      const createData = {
        name: 'Production API Key',
        merchantId: 'merchant-123',
        scopes: ['payments:read', 'payments:write'],
        rateLimitPerHour: 1000,
        expiresAt: '2024-12-31T23:59:59Z',
      };

      const mockApiKey = {
        id: 'key-1',
        name: 'Production API Key',
        merchantId: 'merchant-123',
        scopes: ['payments:read', 'payments:write'],
        rateLimitPerHour: 1000,
        expiresAt: '2024-12-31T23:59:59Z',
        key: 'pk_live_1234567890abcdef',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockApiKey);

      const result = await apiKeyApi.create(createData);

      expect(apiClient.post).toHaveBeenCalledWith('/api-keys', createData);
      expect(result).toEqual(mockApiKey);
    });

    it('should create API key with minimal fields', async () => {
      const createData = {
        name: 'Test API Key',
        scopes: ['read'],
      };

      const mockApiKey = {
        id: 'key-2',
        name: 'Test API Key',
        scopes: ['read'],
        key: 'pk_test_abcdef1234567890',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockApiKey);

      const result = await apiKeyApi.create(createData);

      expect(apiClient.post).toHaveBeenCalledWith('/api-keys', createData);
      expect(result).toEqual(mockApiKey);
    });

    it('should handle invalid scopes error', async () => {
      const mockError = new Error('Invalid scopes provided');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const createData = {
        name: 'Invalid Key',
        scopes: ['invalid:scope'],
      };

      await expect(apiKeyApi.create(createData)).rejects.toThrow('Invalid scopes provided');
    });
  });

  describe('getAll', () => {
    it('should fetch all API keys without filters', async () => {
      const mockResponse = {
        data: [
          { id: 'key-1', name: 'Production Key', isActive: true, scopes: ['payments:read'] },
          { id: 'key-2', name: 'Test Key', isActive: false, scopes: ['read'] },
        ],
        total: 2,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await apiKeyApi.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/api-keys', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch API keys with pagination', async () => {
      const mockResponse = {
        data: [
          { id: 'key-1', name: 'Production Key', isActive: true },
        ],
        total: 10,
      };

      const params = { page: 1, limit: 10 };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await apiKeyApi.getAll(params);

      expect(apiClient.get).toHaveBeenCalledWith('/api-keys', { params });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch API keys filtered by merchantId', async () => {
      const mockResponse = {
        data: [
          { id: 'key-1', name: 'Merchant Key', merchantId: 'merchant-123', isActive: true },
        ],
        total: 1,
      };

      const params = { merchantId: 'merchant-123' };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await apiKeyApi.getAll(params);

      expect(apiClient.get).toHaveBeenCalledWith('/api-keys', { params });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch only active API keys', async () => {
      const mockResponse = {
        data: [
          { id: 'key-1', name: 'Active Key 1', isActive: true },
          { id: 'key-2', name: 'Active Key 2', isActive: true },
        ],
        total: 2,
      };

      const params = { isActive: true };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await apiKeyApi.getAll(params);

      expect(apiClient.get).toHaveBeenCalledWith('/api-keys', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('revoke', () => {
    it('should revoke an API key', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue(undefined);

      await apiKeyApi.revoke('pk_live_1234567890abcdef');

      expect(apiClient.delete).toHaveBeenCalledWith('/api-keys/pk_live_1234567890abcdef');
    });

    it('should handle key not found error', async () => {
      const mockError = new Error('API key not found');
      vi.mocked(apiClient.delete).mockRejectedValue(mockError);

      await expect(apiKeyApi.revoke('nonexistent-key')).rejects.toThrow('API key not found');
    });
  });
});
