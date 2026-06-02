import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { POLICY_CONFIG } from '@/constants';
import { CreditTier } from '@types';

/**
 * Policy configuration type
 */
export interface PolicyConfig {
  TIERS: Record<string, TierPolicy>;
  DELINQUENCY?: {
    BUCKETS: Record<string, number[]>;
  };
  KILL_SWITCHES: Record<string, number>;
  RISK_CONTROLS: RiskControls;
  LIFECYCLE_MULTIPLIERS?: Record<string, number>;
  PORTFOLIO_LIMIT?: number;
  CURRENT_EXPOSURE?: number;
}

interface TierPolicy {
  label: string;
  maxLimit: number;
  startingLimit: number;
  feeRate: number;
  maxTenure: number;
  gracePeriod: number;
  penaltyRate: number;
  minScore: number;
  maxScore: number;
}

interface TierPolicyResponse {
  tier?: string;
  label?: string;
  maxLimit?: number;
  startingLimit?: number;
  feeRate?: number;
  maxTenure?: number;
  gracePeriod?: number;
  penaltyRate?: number;
  minScore?: number;
  maxScore?: number;
  minCreditScore?: number;
  maxCreditLimit?: number;
  maxTenorDays?: number;
  interestRateApr?: number;
  autoApprovalThreshold?: number;
}

const DEFAULT_TIER_MAP = POLICY_CONFIG.TIERS as Record<string, TierPolicy>;

// API response type from backend
interface PolicyConfigResponse {
  id: string;
  policyName: string;
  tierPolicies?: TierPolicyResponse[] | Record<string, TierPolicyResponse>;
  riskControls: Record<string, unknown>;
  killSwitches: Record<string, boolean | number>;
  delinquency?: {
    SOFT: [number, number];
    HARD: [number, number];
    DEFAULT: [number, number];
    WRITE_OFF: [number, number];
  } | null;
  lifecycleMultipliers?: {
    NEW: number;
    EARLY_STABLE: number;
    STABLE: number;
    PROVEN: number;
  } | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RiskControls {
  maxUtilizationPercent: number;
  maxConcurrentContracts?: number;
  minDaysBetweenDrawdowns?: number;
  maxDailyDrawdownAmount?: number;
  requireManualApprovalAbove?: number;
  delinquencySuspendThreshold: number;
}

export const POLICY_CONFIG_QUERY_KEY = ['policyConfig'] as const;

const FALLBACK_TIER_LABELS: Record<string, string> = {
  T1: 'T1: Elite (Low Risk)',
  T2: 'T2: Standard (Medium Risk)',
  T3: 'T3: New/Small (High Risk)',
  NONE: 'Ineligible',
};

function getFallbackTier(tier: string): TierPolicy | undefined {
  return DEFAULT_TIER_MAP?.[tier];
}

function getTierLabel(tier: string): string {
  return getFallbackTier(tier)?.label ?? FALLBACK_TIER_LABELS[tier] ?? `${tier}: Custom Tier`;
}

function getDefaultGracePeriod(tier: string): number {
  return getFallbackTier(tier)?.gracePeriod ?? 0;
}

function getDefaultPenaltyRate(tier: string): number {
  return getFallbackTier(tier)?.penaltyRate ?? 0;
}

function getMaxScoreForTier(tier: string): number {
  const fallback = getFallbackTier(tier)?.maxScore;
  if (typeof fallback === 'number') {
    return fallback;
  }
  if (tier === CreditTier.NONE) {
    return 0;
  }
  return 100;
}

/**
 * Transform API response to PolicyConfig format
 */
function transformToPolicyConfig(response: PolicyConfigResponse): PolicyConfig {
  // Transform tier policies
  const tiers: PolicyConfig['TIERS'] = {};

  const tierPoliciesArray = Array.isArray(response.tierPolicies)
    ? response.tierPolicies
    : Object.entries(response.tierPolicies || {}).map(([tierKey, policy]) => ({
        tier: tierKey,
        ...policy,
      }));

  for (const policy of tierPoliciesArray) {
    if (!policy?.tier) continue;
    const tierKey = policy.tier;
    const fallbackTier = getFallbackTier(tierKey);
    const maxLimit =
      policy.maxLimit ?? policy.maxCreditLimit ?? fallbackTier?.maxLimit ?? 0;
    const startingLimit =
      policy.startingLimit ?? fallbackTier?.startingLimit ?? (maxLimit ? maxLimit * 0.25 : 0);

    tiers[tierKey] = {
      label: policy.label ?? getTierLabel(tierKey),
      maxLimit,
      startingLimit,
      feeRate: policy.feeRate ?? policy.interestRateApr ?? fallbackTier?.feeRate ?? 0,
      maxTenure: policy.maxTenure ?? policy.maxTenorDays ?? fallbackTier?.maxTenure ?? 0,
      gracePeriod: policy.gracePeriod ?? getDefaultGracePeriod(tierKey),
      penaltyRate: policy.penaltyRate ?? getDefaultPenaltyRate(tierKey),
      minScore: policy.minScore ?? policy.minCreditScore ?? fallbackTier?.minScore ?? 0,
      maxScore: policy.maxScore ?? getMaxScoreForTier(tierKey),
    };
  }

  // Ensure fallback tiers are present when backend omits them
  Object.entries(DEFAULT_TIER_MAP ?? {}).forEach(([tierKey, fallbackTier]) => {
    if (!tiers[tierKey]) {
      tiers[tierKey] = fallbackTier;
    }
  });

  // Transform kill switches to numeric format
  const killSwitches: Record<string, number> = {};
  Object.entries(response.killSwitches || {}).forEach(([key, value]) => {
    if (typeof value === 'number') {
      killSwitches[key] = value;
    } else if (typeof value === 'boolean') {
      killSwitches[key] = value ? 1 : 0;
    }
  });

  const riskControls: RiskControls = {
    maxUtilizationPercent:
      typeof response.riskControls?.maxUtilizationPercent === 'number'
        ? (response.riskControls.maxUtilizationPercent as number)
        : (POLICY_CONFIG.RISK_CONTROLS?.maxUtilizationPercent as number) ??
          (POLICY_CONFIG.KILL_SWITCHES?.MAX_PORTFOLIO_EXPOSURE as number) ??
          0,
    delinquencySuspendThreshold:
      typeof response.riskControls?.delinquencySuspendThreshold === 'number'
        ? (response.riskControls.delinquencySuspendThreshold as number)
        : (POLICY_CONFIG.RISK_CONTROLS?.delinquencySuspendThreshold as number) ??
          (POLICY_CONFIG.KILL_SWITCHES?.DELINQUENCY_15_PLUS_THRESHOLD as number) ??
          0.08,
    maxConcurrentContracts:
      typeof response.riskControls?.maxConcurrentContracts === 'number'
        ? (response.riskControls.maxConcurrentContracts as number)
        : 5,
    minDaysBetweenDrawdowns:
      typeof response.riskControls?.minDaysBetweenDrawdowns === 'number'
        ? (response.riskControls.minDaysBetweenDrawdowns as number)
        : 7,
    maxDailyDrawdownAmount:
      typeof response.riskControls?.maxDailyDrawdownAmount === 'number'
        ? (response.riskControls.maxDailyDrawdownAmount as number)
        : 10000000,
    requireManualApprovalAbove:
      typeof response.riskControls?.requireManualApprovalAbove === 'number'
        ? (response.riskControls.requireManualApprovalAbove as number)
        : 30000000,
  };

  return {
    TIERS: tiers,
    DELINQUENCY: response.delinquency
      ? { BUCKETS: response.delinquency }
      : POLICY_CONFIG.DELINQUENCY,
    KILL_SWITCHES: killSwitches,
    RISK_CONTROLS: riskControls,
    LIFECYCLE_MULTIPLIERS:
      response.lifecycleMultipliers ?? POLICY_CONFIG.LIFECYCLE_MULTIPLIERS,
  };
}

/**
 * Hook to fetch policy configuration
 *
 * Features:
 * - Fetches from API endpoint /api/v1/policies/configs/active
 * - Caches configuration for 1 hour
 * - Falls back to constants if API fails
 *
 * @returns Query result with policy config data
 *
 * @example
 * ```tsx
 * const { data: policyConfig, isLoading, error } = usePolicyConfig();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * const t1MaxLimit = policyConfig.TIERS['T1'].maxLimit;
 * ```
 */
export function usePolicyConfig(
  options?: Omit<UseQueryOptions<PolicyConfig>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: POLICY_CONFIG_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await apiClient.get<PolicyConfigResponse>('/policies/configs/active');
        return transformToPolicyConfig(response as PolicyConfigResponse);
      } catch (error) {
        // Fallback to constants if API fails
        console.warn('Failed to fetch policy config from API, using fallback:', error);
        return POLICY_CONFIG as PolicyConfig;
      }
    },
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
    gcTime: 24 * 60 * 60 * 1000, // Keep in memory for 24 hours
    retry: 1,
    ...options,
  });
}
