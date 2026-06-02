import { apiClient } from '@/lib/api';
import type { SystemConfig, SystemStatus } from '@types';

export interface UpdateConfigData {
  featureFlags?: Record<string, boolean>;
  settings?: Record<string, string | number | boolean>;
}

export interface UpdateFeatureFlagData {
  enabled: boolean;
}

export interface UpdateSettingData {
  value: string | number | boolean;
}

export const systemApi = {
  /**
   * Get system configuration
   */
  async getConfig(): Promise<SystemConfig> {
    const response = await apiClient.get<SystemConfig>('/system/config');
    return response as SystemConfig;
  },

  /**
   * Update system configuration
   */
  async updateConfig(data: UpdateConfigData): Promise<SystemConfig> {
    const response = await apiClient.post<SystemConfig>('/system/config', data);
    return response as SystemConfig;
  },

  /**
   * Toggle kill switch
   */
  async toggleKillSwitch(enabled: boolean): Promise<SystemConfig> {
    const response = await apiClient.post<SystemConfig>(`/system/kill-switch/${enabled}`);
    return response as SystemConfig;
  },

  /**
   * Set maintenance mode
   */
  async setMaintenanceMode(enabled: boolean): Promise<SystemConfig> {
    const response = await apiClient.post<SystemConfig>(`/system/maintenance/${enabled}`);
    return response as SystemConfig;
  },

  /**
   * Update feature flag
   */
  async updateFeatureFlag(flagName: string, data: UpdateFeatureFlagData): Promise<SystemConfig> {
    const response = await apiClient.put<SystemConfig>(`/system/feature-flags/${flagName}`, data);
    return response as SystemConfig;
  },

  /**
   * Update system setting
   */
  async updateSetting(settingName: string, data: UpdateSettingData): Promise<SystemConfig> {
    const response = await apiClient.put<SystemConfig>(`/system/settings/${settingName}`, data);
    return response as SystemConfig;
  },

  /**
   * Get system status
   */
  async getStatus(): Promise<SystemStatus> {
    const response = await apiClient.get<SystemStatus>('/system/status');
    return response as SystemStatus;
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await apiClient.get<{ status: string; timestamp: string }>('/health');
    return response as { status: string; timestamp: string };
  },

  /**
   * Ping endpoint
   */
  async ping(): Promise<{ message: string }> {
    const response = await apiClient.get<{ message: string }>('/health/ping');
    return response as { message: string };
  },

  /**
   * Clear system cache
   */
  async clearCache(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/system/cache/clear');
    return response as { message: string };
  },
};
