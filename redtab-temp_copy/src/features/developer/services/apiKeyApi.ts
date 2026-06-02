import { apiClient } from '@/lib/api';
import { ApiService } from '@services';
import type { ApiKey } from '@types';

export interface CreateApiKeyData {
  name: string;
  merchantId?: string;
  scopes: string[];
  rateLimitPerHour?: number;
  expiresAt?: string;
}

export const apiKeyApi = {
  /**
   * Create a new API key
   */
  async create(data: CreateApiKeyData): Promise<ApiKey> {
    const response = await apiClient.post<ApiKey>('/api-keys', data);
    return response as ApiKey;
  },

  /**
   * Get all API keys
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    merchantId?: string;
    isActive?: boolean;
  }): Promise<ApiKey[]> {
    const response = await apiClient.get<ApiKey[]>('/api-keys', { params });
    return response as ApiKey[];
  },

  /**
   * Get API key by ID
   */
  async getById(id: string): Promise<ApiKey> {
    const response = await apiClient.get<ApiKey>(`/api-keys/${id}`);
    return response as ApiKey;
  },

  /**
   * Revoke an API key
   */
  async revoke(key: string): Promise<void> {
    await apiClient.delete(`/api-keys/${key}`);
  },

  /**
   * Delete an API key (alias for revoke)
   */
  async delete(key: string): Promise<void> {
    await apiClient.delete(`/api-keys/${key}`);
  },
};

/**
 * ApiService instance for use with createResourceHooks factory.
 * Provides standard CRUD operations (getById, create, update, patch, delete, bulkDelete).
 * Note: getAll returns PaginatedResponse<ApiKey> via the base ApiService implementation.
 */
export const apiKeyService = new ApiService<ApiKey>('/api-keys');
