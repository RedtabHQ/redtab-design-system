import type { ScoringConfig } from '@/features/admin/services/scoringConfigApi';

/**
 * Mock data for scoring configuration
 * Use this for development/testing when backend is not available
 */

const defaultConfig: ScoringConfig = {
  id: 'default-config-id',
  configName: 'scoring-v1',
  isActive: true,
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-01').toISOString(),
  categories: {
    CAPACITY: {
      weight: 0.6,
      factors: {
        bank_flows: {
          weight: 0.2,
          logic: 'Linear: (Inflow / Target * 100)',
          targetValue: 1000000,
          unit: 'NPR Inflow',
          description: 'Monthly inflow target for full score.',
        },
        pos_sales_consistency: {
          weight: 0.15,
          logic: 'Linear: (Avg Sales / Target * 100)',
          targetValue: 500000,
          unit: 'NPR Avg Sales',
          description: 'Stability of POS revenues.',
        },
        inventory_turnover: {
          weight: 0.1,
          logic: 'Linear: (Actual / Target * 100)',
          targetValue: 12,
          unit: 'Cycles / Year',
          description: 'Measures ability to rotate stock.',
        },
        operational_tenure: {
          weight: 0.08,
          logic: 'Linear: (Months / Target * 100)',
          targetValue: 32,
          unit: 'Months',
          description: 'Experience running the business.',
        },
        refunds_returns: {
          weight: 0.05,
          logic: 'Inverse Linear: (1 - Refund% / MaxRefund%) * 100',
          targetValue: 10,
          unit: '% Max Refund',
          description: 'Penalizes excessive refunds.',
        },
      },
    },
    INTENTION: {
      weight: 0.4,
      factors: {
        payment_history: {
          weight: 0.3,
          logic: 'Linear: (Timely / Target * 100)',
          targetValue: 100,
          unit: '% On-time',
          description: 'Consistency of payments.',
        },
        payment_ratio: {
          weight: 0.25,
          logic: 'Linear: (Settled / Target * 100)',
          targetValue: 100,
          unit: '% Settled',
          description: 'Share of dues settled in full.',
        },
        dpd_delays: {
          weight: 0.15,
          logic: 'Inverse: (Target - Days Delay)',
          targetValue: 0,
          unit: 'Days',
          description: 'Penalizes delinquency.',
        },
        fraud_signals: {
          weight: 0.1,
          logic: 'Binary: 0 if detected',
          targetValue: 0,
          unit: 'Flags',
          description: 'Fraud or dispute triggers.',
        },
        comm_responsiveness: {
          weight: 0.05,
          logic: 'Linear: (Response% / Target * 100)',
          targetValue: 90,
          unit: '% Response',
          description: 'Responsiveness to communication.',
        },
      },
    },
    DYNAMIC_FACTORS: {
      weight: 0,
      factors: {
        normalization: {
          weight: 0,
          logic: 'Normalization: Actual / Sector Avg * 100',
          description: 'Adjusts against industry baseline.',
        },
        seasonal: {
          weight: 0,
          logic: 'Seasonal factor multiplier (0.8-1.2)',
          description: 'Seasonality adjustments.',
        },
        external: {
          weight: 0,
          logic: 'Ad-hoc score adjustment (Event-specific)',
          description: 'External macro shocks.',
        },
      },
    },
  },
};

/**
 * Mock storage for configurations (simulates database)
 */
let mockConfigs: ScoringConfig[] = [defaultConfig];

/**
 * Mock API implementation
 */
export const scoringConfigMockApi = {
  /**
   * Get active scoring configuration
   */
  async getActiveConfig(): Promise<ScoringConfig> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const activeConfig = mockConfigs.find(c => c.isActive);
    if (!activeConfig) {
      throw new Error('No active scoring configuration found');
    }
    return JSON.parse(JSON.stringify(activeConfig)); // Deep clone
  },

  /**
   * Get all scoring configurations
   */
  async getAllConfigs(page = 1, pageSize = 30) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const skip = (page - 1) * pageSize;
    const items = mockConfigs.slice(skip, skip + pageSize);
    return {
      data: JSON.parse(JSON.stringify(items)),
      total: mockConfigs.length,
      page,
      pageSize,
      totalPages: Math.ceil(mockConfigs.length / pageSize),
    };
  },

  /**
   * Get a single configuration by ID
   */
  async getConfigById(id: string): Promise<ScoringConfig> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const config = mockConfigs.find(c => c.id === id);
    if (!config) {
      throw new Error(`Configuration with ID ${id} not found`);
    }
    return JSON.parse(JSON.stringify(config));
  },

  /**
   * Create a new configuration
   */
  async createConfig(configData: Partial<ScoringConfig>): Promise<ScoringConfig> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newConfig: ScoringConfig = {
      id: `config-${Date.now()}`,
      configName: configData.configName || 'Untitled',
      categories: configData.categories || defaultConfig.categories,
      isActive: configData.isActive ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Check for duplicate name
    if (mockConfigs.some(c => c.configName === newConfig.configName)) {
      throw new Error('A configuration with this name already exists');
    }

    mockConfigs.push(newConfig);
    return JSON.parse(JSON.stringify(newConfig));
  },

  /**
   * Update an existing configuration
   */
  async updateConfig(id: string, configData: Partial<ScoringConfig>): Promise<ScoringConfig> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const config = mockConfigs.find(c => c.id === id);
    if (!config) {
      throw new Error(`Configuration with ID ${id} not found`);
    }

    // Check for duplicate name if changing it
    if (configData.configName && configData.configName !== config.configName) {
      if (mockConfigs.some(c => c.configName === configData.configName && c.id !== id)) {
        throw new Error('A configuration with this name already exists');
      }
    }

    const updated: ScoringConfig = {
      ...config,
      ...configData,
      id: config.id, // Prevent ID changes
      createdAt: config.createdAt, // Prevent creation date changes
      updatedAt: new Date().toISOString(),
    };

    const index = mockConfigs.findIndex(c => c.id === id);
    mockConfigs[index] = updated;
    return JSON.parse(JSON.stringify(updated));
  },

  /**
   * Deploy (activate) a configuration
   */
  async deployConfig(configData: Partial<ScoringConfig>): Promise<ScoringConfig> {
    await new Promise(resolve => setTimeout(resolve, 100));

    // Deactivate all other configs
    mockConfigs = mockConfigs.map(c => ({
      ...c,
      isActive: false,
    }));

    // Find active config and update it, or create new one
    const activeConfig = mockConfigs.find(c => c.isActive);
    if (activeConfig) {
      return this.updateConfig(activeConfig.id, {
        ...configData,
        isActive: true,
      });
    }

    // If no active config, create one
    const newConfig = await this.createConfig({
      ...configData,
      isActive: true,
    });
    return newConfig;
  },

  /**
   * Restore default configuration
   */
  async restoreDefaults(): Promise<ScoringConfig> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const restored = JSON.parse(JSON.stringify(defaultConfig));
    restored.updatedAt = new Date().toISOString();

    // Update the default config in mock storage
    const index = mockConfigs.findIndex(c => c.id === defaultConfig.id);
    if (index >= 0) {
      mockConfigs[index] = restored;
    } else {
      mockConfigs.push(restored);
    }

    return restored;
  },

  /**
   * Reset mock storage to initial state (for testing)
   */
  reset(): void {
    mockConfigs = [JSON.parse(JSON.stringify(defaultConfig))];
  },
};
