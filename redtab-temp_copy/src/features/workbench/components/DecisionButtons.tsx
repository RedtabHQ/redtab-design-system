import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { CreditTier } from '@/types';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';
import { Spinner } from '@/components/common/Spinner';

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

interface PolicyConfig {
  TIERS: Record<string, TierPolicy>;
  DELINQUENCY?: {
    BUCKETS: Record<string, number[]>;
  };
  KILL_SWITCHES: Record<string, number>;
  LIFECYCLE_MULTIPLIERS?: Record<string, number>;
}

interface DecisionButtonsProps {
  onChange: (tier: CreditTier, forceReason?: string) => void;
  onClose: () => void;
  recoTier: CreditTier;
  currentTier?: string;
  merchantCreditScore?: number;
  policyConfig: PolicyConfig | null;
  currency: string;
  currencySymbol?: string;
  isLoading?: boolean;
  error?: string | null;
  onErrorDismiss?: () => void;
}

const DEFAULT_VISIBLE_TIERS: CreditTier[] = [CreditTier.T1, CreditTier.T2, CreditTier.T3];

const normalizeTierOrder = (tiers: string[]): CreditTier[] => {
  return tiers
    .filter((tier) => tier !== CreditTier.NONE)
    .sort((a, b) => {
      const indexA = DEFAULT_VISIBLE_TIERS.indexOf(a as CreditTier);
      const indexB = DEFAULT_VISIBLE_TIERS.indexOf(b as CreditTier);
      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    })
    .map((tier) => tier as CreditTier);
};

const DecisionButtons: React.FC<DecisionButtonsProps> = ({
  onChange,
  onClose,
  recoTier,
  currentTier,
  merchantCreditScore = 0,
  policyConfig,
  currency,
  currencySymbol,
  isLoading = false,
  error = null,
  onErrorDismiss
}) => {
  const [selectedTier, setSelectedTier] = useState<CreditTier | null>(null);
  const confirmModalOpen = !!selectedTier;

  const isForceRequired = useMemo(() => {
    if (!selectedTier || !policyConfig?.TIERS[selectedTier]) return false;
    return merchantCreditScore < (policyConfig.TIERS[selectedTier].minScore ?? 0);
  }, [selectedTier, merchantCreditScore, policyConfig]);

  const visibleTiers = useMemo(() => {
    if (!policyConfig?.TIERS) {
      return [];
    }

    const dynamicTiers = normalizeTierOrder(Object.keys(policyConfig.TIERS));
    return dynamicTiers.length ? dynamicTiers : DEFAULT_VISIBLE_TIERS;
  }, [policyConfig]);

  const isTierLoading =
    !policyConfig?.TIERS || Object.keys(policyConfig.TIERS).length === 0;

  // Close confirmation modal when mutation completes successfully
  useEffect(() => {
    if (!isLoading && !error) {
      setSelectedTier(null);
    }
  }, [isLoading, error]);

  const handleTierClick = (tier: CreditTier) => {
    // Ignore if merchant already has this tier
    if (currentTier === tier) {
      return;
    }
    setSelectedTier(tier);
  };

  const handleConfirm = (reason?: string) => {
    if (!selectedTier) return;
    onChange(selectedTier, reason || undefined);
  };

  const handleCancel = () => {
    setSelectedTier(null);
  };

  const displayCurrencyLabel = currencySymbol?.trim() || currency;

  return (
    <>
      <div className="flex items-center gap-3">
        {isTierLoading ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 min-h-[92px]">
            <Spinner size="lg" variant="white" label="Loading tiers..." />
          </div>
        ) : (
          visibleTiers.map((tier) => {
            const isCurrentTier = currentTier === tier;
            return (
              <button
                key={tier}
                onClick={() => handleTierClick(tier)}
                disabled={isLoading || isCurrentTier}
                className={`px-6 py-3 rounded transition-all flex flex-col items-center border min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCurrentTier
                    ? 'bg-green-600/20 text-green-400 border-green-500/30 cursor-default'
                    : recoTier === tier
                      ? 'bg-white text-gray-900 border-white shadow-2xl scale-105 z-10 cursor-pointer'
                      : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className={recoTier === tier ? 'text-redtab' : 'opacity-20'} />
                  <span className="text-xs+ font-black uppercase tracking-widest">{tier} APPROVE</span>
                </div>
                <p className="text-2xs font-bold opacity-60 uppercase tracking-tighter mt-0.5">
                  LIMIT: {displayCurrencyLabel} {((policyConfig?.TIERS[tier]?.maxLimit ?? 0) / 1000).toLocaleString(DEFAULT_CURRENCY_LOCALE, { maximumFractionDigits: 0 })}K
                </p>
              </button>
            );
          })
        )}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="cursor-pointer p-4 bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircle size={24} />
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        title={isForceRequired ? `Force ${selectedTier} Approval` : `Confirm ${selectedTier} Approval`}
        message={
          isForceRequired
            ? `Credit score ${merchantCreditScore} is below the minimum requirement for ${selectedTier} tier (min: ${selectedTier ? (policyConfig?.TIERS[selectedTier]?.minScore ?? 0) : 0}). You can override this, but a justification note is required.`
            : `You are about to approve this merchant for ${selectedTier} tier with a limit of ${selectedTier ? ((policyConfig?.TIERS[selectedTier]?.maxLimit ?? 0) / 1000).toLocaleString(DEFAULT_CURRENCY_LOCALE, { maximumFractionDigits: 0 }) : 0}K (${displayCurrencyLabel}). This action cannot be undone.`
        }
        confirmText={isForceRequired ? 'Force Approve' : 'Confirm Approval'}
        cancelText="Cancel"
        isDangerous={isForceRequired}
        isLoading={isLoading}
        showReasonField={true}
        reasonRequired={isForceRequired}
        reasonLabel={isForceRequired ? 'Justification (required)' : 'Note (optional)'}
        reasonPlaceholder={isForceRequired ? 'Explain why this override is justified...' : 'Add a note for this approval...'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {/* Error Modal */}
      {error && (
        // <ConfirmationModal
        //   isOpen={true}
        //   title="Approval Error"
        //   message={error}
        //   confirmText="Close"
        //   cancelText="Cancel"
        //   isDangerous={true}
        //   onConfirm={onErrorDismiss || (() => { })}
        //   onCancel={onErrorDismiss || (() => { })}
        // />
        null
      )}
    </>
  );
};

export default DecisionButtons;
