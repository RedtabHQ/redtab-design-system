import { apiClient } from '@/lib/api';
import { ApiService } from '@/lib/apiService';
import type { PaginatedResponse } from '@types';

export interface TierPolicyPayload {
  tier: string;
  minCreditScore: number;
  maxCreditScore: number;
  maxCreditLimit: number;
  startingCreditLimit: number;
  maxTenorDays: number;
  interestRateApr: number;
  gracePeriodDays: number;
  penaltyRateDaily: number;
  autoApprovalThreshold: number;
}

export interface RiskControls {
  maxUtilizationPercent: number;
  delinquencySuspendThreshold: number;
  maxConcurrentContracts: number;
  minDaysBetweenDrawdowns: number;
  maxDailyDrawdownAmount: number;
  requireManualApprovalAbove: number;
}

export interface KillSwitches {
  globalFreeze: boolean;
  newContractsDisabled: boolean;
  drawdownsDisabled: boolean;
  repaymentOnlyMode: boolean;
  merchantIdsBlacklist: string[];
  supplierIdsBlacklist: string[];
}

export interface PolicyDelinquencyBuckets {
  SOFT: [number, number];
  HARD: [number, number];
  DEFAULT: [number, number];
  WRITE_OFF: [number, number];
}

export interface PolicyLifecycleMultipliers {
  NEW: number;
  EARLY_STABLE: number;
  STABLE: number;
  PROVEN: number;
}

export interface PolicyConfig {
  id: string;
  policyName: string;
  isActive: boolean;
  tierPolicies: TierPolicyPayload[];
  riskControls: RiskControls;
  killSwitches: KillSwitches;
  delinquency?: PolicyDelinquencyBuckets | null;
  lifecycleMultipliers?: PolicyLifecycleMultipliers | null;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyChangeLog {
  id: string;
  policyId: string;
  changeType: string;
  changedBy: string;
  changeDetails: Array<{
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }>;
  reason?: string;
  changedAt: string;
}

export interface CreatePolicyConfigDto {
  policyName: string;
  isActive: boolean;
  tierPolicies: TierPolicyPayload[];
  riskControls: RiskControls;
  killSwitches: KillSwitches;
  delinquency?: PolicyDelinquencyBuckets | null;
  lifecycleMultipliers?: PolicyLifecycleMultipliers | null;
}

export interface UpdateKillSwitchDto extends Partial<KillSwitches> {
  changedBy: string;
  reason?: string;
}

/**
 * Policy Engine API Service
 */
class PolicyEngineService extends ApiService<PolicyConfig> {
  constructor() {
    super('/policies');
  }

  /**
   * Get all policy configurations
   */
  async getAllConfigs(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<PolicyConfig>> {
    return this.query<PaginatedResponse<PolicyConfig>>('configs', params);
  }

  /**
   * Get active policy configuration
   */
  async getActiveConfig(): Promise<PolicyConfig> {
    return this.query<PolicyConfig>('configs/active');
  }

  /**
   * Create new policy configuration
   */
  async createConfig(data: CreatePolicyConfigDto): Promise<PolicyConfig> {
    const response = await apiClient.post<PolicyConfig>(
      `${this.resourcePath}/configs`,
      data
    );
    return response as PolicyConfig;
  }

  /**
   * Update kill switches
   */
  async updateKillSwitches(data: UpdateKillSwitchDto): Promise<PolicyConfig> {
    const response = await apiClient.put<PolicyConfig>(
      `${this.resourcePath}/kill-switches`,
      data
    );
    return response as PolicyConfig;
  }

  /**
   * Check if an operation is allowed by policies
   */
  async checkOperation(params: {
    type: 'NEW_CONTRACT' | 'DRAWDOWN' | 'REPAYMENT';
    merchantId?: string;
    supplierId?: string;
  }): Promise<{ allowed: boolean; reason?: string }> {
    const queryParams = new URLSearchParams();
    queryParams.append('type', params.type);
    if (params.merchantId) queryParams.append('merchantId', params.merchantId);
    if (params.supplierId) queryParams.append('supplierId', params.supplierId);

    const response = await apiClient.get<{ allowed: boolean; reason?: string }>(
      `${this.resourcePath}/check-operation?${queryParams.toString()}`
    );
    return response as { allowed: boolean; reason?: string };
  }

  /**
   * Get policy for a specific tier
   */
  async getTierPolicy(tier: string): Promise<TierPolicyPayload> {
    const response = await apiClient.get<TierPolicyPayload>(
      `${this.resourcePath}/tier/${tier}`
    );
    return response as TierPolicyPayload;
  }

  /**
   * Get risk controls configuration
   */
  async getRiskControls(): Promise<RiskControls> {
    const response = await apiClient.get<RiskControls>(
      `${this.resourcePath}/risk-controls`
    );
    return response as RiskControls;
  }

  /**
   * Get change history for a policy
   */
  async getChangeHistory(
    policyId: string,
    params?: {
      page?: number;
      pageSize?: number;
    }
  ): Promise<PaginatedResponse<PolicyChangeLog>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.pageSize) queryParams.append('pageSize', String(params.pageSize));

    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.resourcePath}/change-history/${policyId}?${queryString}`
      : `${this.resourcePath}/change-history/${policyId}`;

    const response = await apiClient.get<PaginatedResponse<PolicyChangeLog>>(url);
    return response as PaginatedResponse<PolicyChangeLog>;
  }

  /**
   * Deploy policy configuration to active status
   * Saves the current policy configuration to the backend database
   */
  async deployPolicy(data: CreatePolicyConfigDto): Promise<PolicyConfig> {
    const response = await apiClient.post<PolicyConfig>(
      `${this.resourcePath}/deploy`,
      data
    );
    return response as PolicyConfig;
  }
}

export const policyEngineService = new PolicyEngineService();
