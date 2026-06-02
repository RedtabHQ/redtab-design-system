import { ApiService } from '@/lib/apiService';
import type { PaginationParams, FilterParams } from '@/lib/apiService';

export interface ScoringFactor {
  weight: number;
  logic?: string;
  targetValue?: number;
  unit?: string;
  description?: string;
  max?: number;
}

export interface ScoringCategory {
  weight: number;
  subMetrics?: Record<string, ScoringFactor>;
  factors?: Record<string, ScoringFactor>;
}

/**
 * Scoring configuration type - matches backend entity
 */
export interface ScoringConfig {
  id: string;
  configName: string;
  categories: Record<string, ScoringCategory>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Extended scoring config service with custom endpoints
 */
export class ScoringConfigService extends ApiService<ScoringConfig> {
  /**
   * Get the active scoring configuration
   */
  async getActiveConfig(): Promise<ScoringConfig> {
    return this.query<ScoringConfig>('active');
  }

  /**
   * Deploy a scoring configuration (activate it)
   */
  async deployConfig(config: Partial<ScoringConfig>): Promise<ScoringConfig> {
    return this.mutate<ScoringConfig>('deploy', config);
  }

  /**
   * Restore default scoring configuration
   */
  async restoreDefaults(): Promise<ScoringConfig> {
    return this.mutate<ScoringConfig>('restore-defaults', {});
  }

  /**
   * Get all configs with pagination
   */
  async getAllConfigs(params?: PaginationParams & FilterParams) {
    return this.getAll(params);
  }
}

/**
 * Pre-configured instance for scoring config API
 */
export const scoringConfigService = new ScoringConfigService('/scoring/configs');
