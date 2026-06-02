import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useCurrency } from '@/hooks/useCurrency';
import { analyzePolicyImpact } from '@/lib/geminiService';
import {
  policyEngineService,
  CreatePolicyConfigDto,
  PolicyDelinquencyBuckets,
  PolicyLifecycleMultipliers,
  TierPolicyPayload,
  RiskControls,
} from '../services/policyService';
import { CreditTier } from '@/types';
import {
  TierPolicyCard,
  PolicySimulationPanel,
  GlobalGuardrailsSection,
} from '../components';
import { PageHeader } from '@/components/common/PageHeader';
import { ResetButton } from '../components/GlobalSettings/ResetButton';
import { ShieldAlert, ShieldCheck, Save, Loader } from 'lucide-react';
import { POLICY_CONFIG } from '@/constants';
import {
  usePolicyConfig,
  type PolicyConfig,
  POLICY_CONFIG_QUERY_KEY,
} from '@/features/merchants/hooks/usePolicyConfig';
import { useToastContext } from '@/components/common/ToastContainer';

const DEFAULT_DELINQUENCY_BUCKETS: PolicyDelinquencyBuckets =
  (POLICY_CONFIG.DELINQUENCY?.BUCKETS as PolicyDelinquencyBuckets) ?? {
    SOFT: [1, 7],
    HARD: [8, 15],
    DEFAULT: [16, 30],
    WRITE_OFF: [31, 999],
  };

const DEFAULT_LIFECYCLE: PolicyLifecycleMultipliers =
  (POLICY_CONFIG.LIFECYCLE_MULTIPLIERS as PolicyLifecycleMultipliers) ?? {
    NEW: 0.85,
    EARLY_STABLE: 0.9,
    STABLE: 1,
    PROVEN: 1.05,
  };

const DEFAULT_TIER_MAP = POLICY_CONFIG.TIERS as Record<string, PolicyConfig['TIERS'][string]>;

const createTierTemplate = (tier: string): PolicyConfig['TIERS'][string] => ({
  label: `${tier}: Custom Tier`,
  maxLimit: 0,
  startingLimit: 0,
  feeRate: 0,
  maxTenure: 0,
  gracePeriod: 0,
  penaltyRate: 0,
  minScore: 0,
  maxScore: 100,
});

const getTierTemplate = (tier: string): PolicyConfig['TIERS'][string] =>
  DEFAULT_TIER_MAP[tier] ?? createTierTemplate(tier);

const sortTierKeys = (a: string, b: string) => {
  if (a === CreditTier.NONE) return 1;
  if (b === CreditTier.NONE) return -1;
  const numericA = Number(a.replace(/\D+/g, ''));
  const numericB = Number(b.replace(/\D+/g, ''));
  if (!Number.isNaN(numericA) && !Number.isNaN(numericB)) {
    return numericA - numericB;
  }
  return a.localeCompare(b);
};

type TierPolicyKey = keyof PolicyConfig['TIERS'][string];

const normalizeTierScores = (config: PolicyConfig): PolicyConfig => {
  const tierKeys = Object.keys(config.TIERS || {})
    .filter((tier) => tier !== CreditTier.NONE)
    .sort(sortTierKeys);

  if (!tierKeys.length) {
    return config;
  }

  const normalizedTiers: PolicyConfig['TIERS'] = { ...config.TIERS };
  let previousMax = -1;

  tierKeys.forEach((tier, index) => {
    const fallback = getTierTemplate(tier);
    const current = normalizedTiers[tier] ?? fallback;
    const tiersRemaining = tierKeys.length - index - 1;
    const maxSelectable = 100 - tiersRemaining; // reserve 1 point per remaining tier
    const requestedMax =
      current.maxScore ?? fallback.maxScore ?? maxSelectable;

    const computedMin = Math.max(previousMax + 1, 0);
    const tentativeMax = Math.min(Math.max(requestedMax, computedMin), maxSelectable);
    const isFinalTier = index === tierKeys.length - 1;
    const computedMax = isFinalTier ? 100 : tentativeMax;

    normalizedTiers[tier] = {
      ...fallback,
      ...current,
      minScore: computedMin,
      maxScore: computedMax,
    };

    previousMax = computedMax;
  });

  return {
    ...config,
    TIERS: {
      ...config.TIERS,
      ...normalizedTiers,
    },
  };
};

const buildDeployPayload = (config: PolicyConfig): CreatePolicyConfigDto => {
  const tierPolicies: TierPolicyPayload[] = Object.entries(config.TIERS)
    .filter(([tier]) => tier !== CreditTier.NONE)
    .map(([tier, tierConfig]) => {
      const fallbackTier = getTierTemplate(tier);
      const maxLimit = tierConfig?.maxLimit ?? fallbackTier.maxLimit ?? 0;
      const startingLimit =
        tierConfig?.startingLimit ?? fallbackTier.startingLimit ?? maxLimit * 0.25;
      return {
        tier,
        minCreditScore: tierConfig?.minScore ?? fallbackTier.minScore ?? 0,
        maxCreditScore: tierConfig?.maxScore ?? fallbackTier.maxScore ?? 0,
        maxCreditLimit: maxLimit,
        startingCreditLimit: startingLimit,
        maxTenorDays: tierConfig?.maxTenure ?? fallbackTier.maxTenure ?? 0,
        interestRateApr: tierConfig?.feeRate ?? fallbackTier.feeRate ?? 0,
        gracePeriodDays: tierConfig?.gracePeriod ?? fallbackTier.gracePeriod ?? 0,
        penaltyRateDaily: tierConfig?.penaltyRate ?? fallbackTier.penaltyRate ?? 0,
        autoApprovalThreshold: maxLimit ? maxLimit * 0.2 : 0,
      };
    });

  const normalizePercentInput = (value?: number) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 0;
    if (value < 0) return 0;
    if (value <= 1) return value;
    return 1;
  };

  const riskControlsState = config.RISK_CONTROLS ?? DEFAULT_RISK_CONTROLS;

  return {
    policyName: `policy-${new Date().toISOString().split('T')[0]}`,
    isActive: true,
    tierPolicies,
    riskControls: {
      maxUtilizationPercent: normalizePercentInput(
        riskControlsState.maxUtilizationPercent
      ),
      maxConcurrentContracts: riskControlsState.maxConcurrentContracts ?? 5,
      minDaysBetweenDrawdowns: riskControlsState.minDaysBetweenDrawdowns ?? 7,
      maxDailyDrawdownAmount: riskControlsState.maxDailyDrawdownAmount ?? 10000000,
      requireManualApprovalAbove: riskControlsState.requireManualApprovalAbove ?? 30000000,
      delinquencySuspendThreshold: normalizePercentInput(
        riskControlsState.delinquencySuspendThreshold
      ),
    },
    killSwitches: {
      globalFreeze: false,
      newContractsDisabled: false,
      drawdownsDisabled: false,
      repaymentOnlyMode: false,
      merchantIdsBlacklist: [],
      supplierIdsBlacklist: [],
    },
    delinquency:
      (config.DELINQUENCY?.BUCKETS as PolicyDelinquencyBuckets | undefined) ??
      DEFAULT_DELINQUENCY_BUCKETS,
    lifecycleMultipliers:
      (config.LIFECYCLE_MULTIPLIERS as PolicyLifecycleMultipliers | undefined) ??
      DEFAULT_LIFECYCLE,
  };
};

const DEFAULT_RISK_CONTROLS: RiskControls = {
  maxUtilizationPercent: 0,
  delinquencySuspendThreshold: 0,
  maxConcurrentContracts: 5,
  minDaysBetweenDrawdowns: 7,
  maxDailyDrawdownAmount: 10000000,
  requireManualApprovalAbove: 30000000,
};

const PolicyConfigView: React.FC = () => {
  const { selectedSegment, isGlobalView } = useMarketSegment();
  const { symbol: currencySymbol, currency } = useCurrency();
  const { data: fetchedPolicyConfig, isLoading: isPolicyLoading } = usePolicyConfig();
  const [policyConfig, setPolicyConfig] = useState<PolicyConfig | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { show: showToast } = useToastContext();

  useEffect(() => {
    if (fetchedPolicyConfig) {
      setPolicyConfig(normalizeTierScores(fetchedPolicyConfig));
    }
  }, [fetchedPolicyConfig]);

  const savePolicyMutation = useMutation({
    mutationFn: async (config: PolicyConfig) => {
      const payload = buildDeployPayload(config);
      return policyEngineService.deployPolicy(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POLICY_CONFIG_QUERY_KEY });
      showToast({
        type: 'SUCCESS',
        title: 'Policy Updated',
        message: 'Policy configuration synced successfully.',
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to update policy configuration';
      showToast({
        type: 'DANGER',
        title: 'Save Failed',
        message,
      });
    },
  });

  const updateTierPolicy = useCallback(
    (tier: string, key: TierPolicyKey, value: number) => {
      setPolicyConfig((prev) => {
        if (!prev) return prev;
        const nextTier = prev.TIERS[tier] ?? getTierTemplate(tier);
        const next: PolicyConfig = {
          ...prev,
          TIERS: {
            ...prev.TIERS,
            [tier]: {
              ...nextTier,
              [key]: value,
            },
          },
        };
        return normalizeTierScores(next);
      });
    },
    []
  );

  const updateGlobalRiskPolicy = useCallback(
    (key: keyof RiskControls, value: number) => {
      setPolicyConfig((prev) => {
        if (!prev) return prev;
        const next: PolicyConfig = {
          ...prev,
          RISK_CONTROLS: {
            ...(prev.RISK_CONTROLS ?? DEFAULT_RISK_CONTROLS),
            [key]: value,
          },
        };
        return next;
      });
    },
    []
  );

  const handleAnalyze = async () => {
    if (!policyConfig) return;
    setIsAnalyzing(true);
    const result = await analyzePolicyImpact(policyConfig);
    setAnalysis(result.content);
    setIsAnalyzing(false);
  };

  const handleDeploy = () => {
    if (policyConfig) {
      savePolicyMutation.mutate(policyConfig);
    }
  };

  const handleResetComplete = () => {
    setPolicyConfig(null);
    queryClient.invalidateQueries({ queryKey: POLICY_CONFIG_QUERY_KEY });
  };

  const activeSegment = selectedSegment;
  const isGlobal = isGlobalView;

  if (isPolicyLoading && !policyConfig) {
    return (
      <div className="mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex items-center justify-center h-96 text-gray-500">Loading policy configuration...</div>
      </div>
    );
  }

  if (!policyConfig) {
    return (
      <div className="mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex items-center justify-center h-96 text-red-500">Failed to load policy configuration</div>
      </div>
    );
  }

  const tierKeys = Object.keys(policyConfig.TIERS)
    .filter((tier) => tier !== CreditTier.NONE)
    .sort(sortTierKeys);
  const riskControls = policyConfig.RISK_CONTROLS ?? DEFAULT_RISK_CONTROLS;

  return (
    <div className="mx-auto space-y-10 pb-20">
      <PageHeader
        title={isGlobal ? 'Global Policy Engine' : `${activeSegment?.name} Lending Policies`}
        subtitle={`Configure risk-adjusted pricing and automated score thresholds for ${
          isGlobal ? 'all markets' : `the ${activeSegment?.name} segment`
        }.`}
        icon={<ShieldAlert className="text-redtab" size={32} />}
        actions={
          <>
            <ResetButton onReset={handleResetComplete} />
            <button
              onClick={handleDeploy}
              disabled={savePolicyMutation.isPending}
              className="flex cursor-pointer items-center gap-2 px-8 py-2.5 bg-gray-900 text-white rounded text-sm font-black shadow-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savePolicyMutation.isPending ? (
                <><Loader size={18} className="animate-spin" /> Deploying...</>
              ) : (
                <><Save size={18} /> Deploy Policies</>
              )}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-10">
          <section className="space-y-6">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <ShieldCheck className="text-redtab" size={18} /> Credit Tier Policy Bundles ({currency})
            </h3>

            <div className="grid grid-cols-1 gap-8">
              {tierKeys.map((tier, index) => {
                const tierConfig = policyConfig.TIERS[tier];
                const isFinalTier = index === tierKeys.length - 1;
                const minScoreValue = tierConfig?.minScore ?? 0;
                const computedMaxSelectable = 100 - (tierKeys.length - index - 1);
                const maxSelectableScore = Math.max(minScoreValue, computedMaxSelectable);
                const maxScoreValue = tierConfig?.maxScore ?? (isFinalTier ? 100 : maxSelectableScore);
                return (
                  <TierPolicyCard
                    key={tier}
                    tier={tier}
                    tierLabel={tierConfig?.label ?? `${tier}: Custom Tier`}
                    minScore={minScoreValue}
                    maxScore={isFinalTier ? 100 : maxScoreValue}
                    maxLimit={tierConfig?.maxLimit ?? 0}
                    feeRate={tierConfig?.feeRate ?? 0}
                    maxTenure={tierConfig?.maxTenure ?? 0}
                    gracePeriod={tierConfig?.gracePeriod ?? 0}
                    currency={currency}
                    currencySymbol={currencySymbol}
                    isGlobal={isGlobal}
                    onMaxLimitChange={(val) => updateTierPolicy(tier, 'maxLimit', val)}
                    onFeeRateChange={(val) => updateTierPolicy(tier, 'feeRate', val)}
                    onMaxTenureChange={(val) => updateTierPolicy(tier, 'maxTenure', val)}
                    onMaxScoreChange={(val) => updateTierPolicy(tier, 'maxScore', val)}
                    onGracePeriodChange={(val) => updateTierPolicy(tier, 'gracePeriod', val)}
                    maxSelectableScore={maxSelectableScore}
                    isFinalTier={isFinalTier}
                  />
                );
              })}
            </div>
          </section>

          <GlobalGuardrailsSection
            maxPortfolioExposure={riskControls.maxUtilizationPercent}
            delinquencyThreshold={riskControls.delinquencySuspendThreshold}
            currency={currency}
            onMaxPortfolioExposureChange={(val) =>
              updateGlobalRiskPolicy('maxUtilizationPercent', val)
            }
            onDelinquencyThresholdChange={(val) =>
              updateGlobalRiskPolicy('delinquencySuspendThreshold', val)
            }
          />
        </div>

        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
          <PolicySimulationPanel
            isAnalyzing={isAnalyzing}
            analysis={analysis}
            segmentName={activeSegment?.name || ''}
            isGlobal={isGlobal}
            onAnalyze={handleAnalyze}
          />
        </div>
      </div>
    </div>
  );
};

export default PolicyConfigView;
