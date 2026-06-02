import { apiClient } from '@/lib/api';
import type { ApiKey, ApiKeyCreation, WebhookConfig, WebhookLog, WebhookStats } from '@/types/developer';

export const developerService = {
  // Webhook Configs
  async createWebhookConfig(data: Partial<WebhookConfig>) {
    return apiClient.post<WebhookConfig>('/webhooks/configs', data);
  },

  async listWebhookConfigs() {
    return apiClient.get<WebhookConfig[]>('/webhooks/configs');
  },

  async getWebhookConfig(id: string) {
    return apiClient.get<WebhookConfig>(`/webhooks/configs/${id}`);
  },

  async updateWebhookConfig(id: string, data: Partial<WebhookConfig>) {
    return apiClient.put<WebhookConfig>(`/webhooks/configs/${id}`, data);
  },

  async deleteWebhookConfig(id: string) {
    return apiClient.delete(`/webhooks/configs/${id}`);
  },

  // Webhook Logs
  async listWebhookLogs(params: Record<string, unknown>) {
    return apiClient.get<WebhookLog[] | { items?: WebhookLog[] }>('/webhooks/logs', { params });
  },

  async getWebhookLog(id: string) {
    return apiClient.get<WebhookLog>(`/webhooks/logs/${id}`);
  },

  // Stats
  async getWebhookStats() {
    return apiClient.get<WebhookStats>('/webhooks/stats');
  },

  // API Keys
  async createApiKey(data: { name: string; scopes: string[]; environment: 'production' | 'development' | 'test' }) {
    return apiClient.post<ApiKeyCreation>('/api-keys', data);
  },

  async listApiKeys(params?: Record<string, unknown>) {
    return apiClient.get<ApiKey[]>('/api-keys', { params });
  },

  async revokeApiKey(id: string) {
    return apiClient.delete(`/api-keys/${id}`);
  },
};
