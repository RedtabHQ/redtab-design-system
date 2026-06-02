import { describe, it, expect, beforeEach, vi } from 'vitest';
import { systemApi } from './systemApi';
import { apiClient } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('systemApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getConfig', () => {
    it('should fetch system configuration', async () => {
      const mockConfig = {
        featureFlags: {
          enableNewDashboard: true,
          enableAIRecommendations: false,
        },
        settings: {
          maxCreditLimit: 1000000,
          defaultTenureDays: 30,
        },
        killSwitchEnabled: false,
        maintenanceMode: false,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockConfig);

      const result = await systemApi.getConfig();

      expect(apiClient.get).toHaveBeenCalledWith('/system/config');
      expect(result).toEqual(mockConfig);
    });

    it('should handle error fetching config', async () => {
      const mockError = new Error('Unauthorized');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(systemApi.getConfig()).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateConfig', () => {
    it('should update system configuration', async () => {
      const updateData = {
        featureFlags: {
          enableNewDashboard: true,
        },
        settings: {
          maxCreditLimit: 2000000,
        },
      };

      const mockConfig = {
        ...updateData,
        killSwitchEnabled: false,
        maintenanceMode: false,
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockConfig);

      const result = await systemApi.updateConfig(updateData);

      expect(apiClient.post).toHaveBeenCalledWith('/system/config', updateData);
      expect(result).toEqual(mockConfig);
    });

    it('should update only feature flags', async () => {
      const updateData = {
        featureFlags: {
          enableAIRecommendations: true,
        },
      };

      const mockConfig = {
        featureFlags: {
          enableNewDashboard: true,
          enableAIRecommendations: true,
        },
        settings: {},
        killSwitchEnabled: false,
        maintenanceMode: false,
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockConfig);

      const result = await systemApi.updateConfig(updateData);

      expect(apiClient.post).toHaveBeenCalledWith('/system/config', updateData);
      expect(result).toEqual(mockConfig);
    });

    it('should handle update error', async () => {
      const mockError = new Error('Invalid configuration');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(systemApi.updateConfig({})).rejects.toThrow('Invalid configuration');
    });
  });

  describe('toggleKillSwitch', () => {
    it('should enable kill switch', async () => {
      const mockConfig = {
        killSwitchEnabled: true,
        featureFlags: {},
        settings: {},
        maintenanceMode: false,
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockConfig);

      const result = await systemApi.toggleKillSwitch(true);

      expect(apiClient.post).toHaveBeenCalledWith('/system/kill-switch/true');
      expect(result).toEqual(mockConfig);
      expect(result.killSwitchEnabled).toBe(true);
    });

    it('should disable kill switch', async () => {
      const mockConfig = {
        killSwitchEnabled: false,
        featureFlags: {},
        settings: {},
        maintenanceMode: false,
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockConfig);

      const result = await systemApi.toggleKillSwitch(false);

      expect(apiClient.post).toHaveBeenCalledWith('/system/kill-switch/false');
      expect(result).toEqual(mockConfig);
      expect(result.killSwitchEnabled).toBe(false);
    });
  });

  describe('setMaintenanceMode', () => {
    it('should enable maintenance mode', async () => {
      const mockConfig = {
        maintenanceMode: true,
        killSwitchEnabled: false,
        featureFlags: {},
        settings: {},
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockConfig);

      const result = await systemApi.setMaintenanceMode(true);

      expect(apiClient.post).toHaveBeenCalledWith('/system/maintenance/true');
      expect(result).toEqual(mockConfig);
      expect(result.maintenanceMode).toBe(true);
    });

    it('should disable maintenance mode', async () => {
      const mockConfig = {
        maintenanceMode: false,
        killSwitchEnabled: false,
        featureFlags: {},
        settings: {},
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockConfig);

      const result = await systemApi.setMaintenanceMode(false);

      expect(apiClient.post).toHaveBeenCalledWith('/system/maintenance/false');
      expect(result).toEqual(mockConfig);
      expect(result.maintenanceMode).toBe(false);
    });
  });

  describe('updateFeatureFlag', () => {
    it('should enable feature flag', async () => {
      const flagData = { enabled: true };

      const mockConfig = {
        featureFlags: {
          enableNewDashboard: true,
        },
        settings: {},
        killSwitchEnabled: false,
        maintenanceMode: false,
      };

      vi.mocked(apiClient.put).mockResolvedValue(mockConfig);

      const result = await systemApi.updateFeatureFlag('enableNewDashboard', flagData);

      expect(apiClient.put).toHaveBeenCalledWith('/system/feature-flags/enableNewDashboard', flagData);
      expect(result).toEqual(mockConfig);
    });

    it('should disable feature flag', async () => {
      const flagData = { enabled: false };

      const mockConfig = {
        featureFlags: {
          enableNewDashboard: false,
        },
        settings: {},
        killSwitchEnabled: false,
        maintenanceMode: false,
      };

      vi.mocked(apiClient.put).mockResolvedValue(mockConfig);

      const result = await systemApi.updateFeatureFlag('enableNewDashboard', flagData);

      expect(apiClient.put).toHaveBeenCalledWith('/system/feature-flags/enableNewDashboard', flagData);
      expect(result).toEqual(mockConfig);
    });
  });

  describe('updateSetting', () => {
    it('should update setting with string value', async () => {
      const settingData = { value: 'production' };

      const mockConfig = {
        featureFlags: {},
        settings: {
          environment: 'production',
        },
        killSwitchEnabled: false,
        maintenanceMode: false,
      };

      vi.mocked(apiClient.put).mockResolvedValue(mockConfig);

      const result = await systemApi.updateSetting('environment', settingData);

      expect(apiClient.put).toHaveBeenCalledWith('/system/settings/environment', settingData);
      expect(result).toEqual(mockConfig);
    });

    it('should update setting with number value', async () => {
      const settingData = { value: 60 };

      const mockConfig = {
        featureFlags: {},
        settings: {
          defaultTenureDays: 60,
        },
        killSwitchEnabled: false,
        maintenanceMode: false,
      };

      vi.mocked(apiClient.put).mockResolvedValue(mockConfig);

      const result = await systemApi.updateSetting('defaultTenureDays', settingData);

      expect(apiClient.put).toHaveBeenCalledWith('/system/settings/defaultTenureDays', settingData);
      expect(result).toEqual(mockConfig);
    });

    it('should update setting with boolean value', async () => {
      const settingData = { value: true };

      const mockConfig = {
        featureFlags: {},
        settings: {
          requireApproval: true,
        },
        killSwitchEnabled: false,
        maintenanceMode: false,
      };

      vi.mocked(apiClient.put).mockResolvedValue(mockConfig);

      const result = await systemApi.updateSetting('requireApproval', settingData);

      expect(apiClient.put).toHaveBeenCalledWith('/system/settings/requireApproval', settingData);
      expect(result).toEqual(mockConfig);
    });
  });

  describe('getStatus', () => {
    it('should fetch system status', async () => {
      const mockStatus = {
        status: 'healthy',
        uptime: 123456,
        version: '1.0.0',
        services: {
          database: 'up',
          redis: 'up',
          api: 'up',
        },
        timestamp: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockStatus);

      const result = await systemApi.getStatus();

      expect(apiClient.get).toHaveBeenCalledWith('/system/status');
      expect(result).toEqual(mockStatus);
    });

    it('should handle degraded system status', async () => {
      const mockStatus = {
        status: 'degraded',
        uptime: 123456,
        version: '1.0.0',
        services: {
          database: 'up',
          redis: 'down',
          api: 'up',
        },
        timestamp: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockStatus);

      const result = await systemApi.getStatus();

      expect(result.status).toBe('degraded');
    });
  });

  describe('healthCheck', () => {
    it('should perform health check', async () => {
      const mockHealth = {
        status: 'ok',
        timestamp: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockHealth);

      const result = await systemApi.healthCheck();

      expect(apiClient.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual(mockHealth);
    });

    it('should handle unhealthy status', async () => {
      const mockError = new Error('Service unavailable');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(systemApi.healthCheck()).rejects.toThrow('Service unavailable');
    });
  });

  describe('ping', () => {
    it('should ping endpoint successfully', async () => {
      const mockPing = {
        message: 'pong',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockPing);

      const result = await systemApi.ping();

      expect(apiClient.get).toHaveBeenCalledWith('/health/ping');
      expect(result).toEqual(mockPing);
    });

    it('should handle ping timeout', async () => {
      const mockError = new Error('Request timeout');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(systemApi.ping()).rejects.toThrow('Request timeout');
    });
  });
});
