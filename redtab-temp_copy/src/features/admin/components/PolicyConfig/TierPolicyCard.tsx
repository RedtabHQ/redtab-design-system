import React from 'react';
import { CommercialTermsSection } from '../GlobalSettings';
import { ThresholdSection } from '../GlobalSettings/ThresholdSection';

interface TierPolicyCardProps {
  tier: string;
  tierLabel: string;
  minScore: number;
  maxScore: number;
  maxLimit: number;
  feeRate: number;
  maxTenure: number;
  gracePeriod: number;
  currency: string;
  currencySymbol: string;
  isGlobal: boolean;
  onMaxLimitChange: (value: number) => void;
  onFeeRateChange: (value: number) => void;
  onMaxTenureChange: (value: number) => void;
  onMaxScoreChange: (value: number) => void;
  onGracePeriodChange: (value: number) => void;
  maxSelectableScore: number;
  isFinalTier: boolean;
}

const TierPolicyCard: React.FC<TierPolicyCardProps> = ({
  tier,
  tierLabel,
  minScore,
  maxScore,
  maxLimit,
  feeRate,
  maxTenure,
  gracePeriod,
  currency,
  currencySymbol,
  isGlobal,
  onMaxLimitChange,
  onFeeRateChange,
  onMaxTenureChange,
  onMaxScoreChange,
  onGracePeriodChange,
  maxSelectableScore,
  isFinalTier,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:border-red-100 transition-all">
      {/* Header */}
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
            {tier}
          </div>
          <div>
            <h4 className="font-black text-gray-900">{tierLabel}</h4>
            <p className="text-2xs text-gray-400 font-bold uppercase tracking-widest">Pricing & Decisioning Logic</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white border border-gray-100 rounded-xl text-2xs font-black text-gray-400 uppercase tracking-tighter">
            Threshold: {minScore}+ Score
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        <CommercialTermsSection
          maxLimit={maxLimit}
          feeRate={feeRate}
          maxTenure={maxTenure}
          currency={currency}
          currencySymbol={currencySymbol}
          isGlobal={isGlobal}
          onMaxLimitChange={onMaxLimitChange}
          onFeeRateChange={onFeeRateChange}
          onMaxTenureChange={onMaxTenureChange}
        />

        <ThresholdSection
          minScore={minScore}
          maxScore={maxScore}
          gracePeriod={gracePeriod}
          onMaxScoreChange={onMaxScoreChange}
          onGracePeriodChange={onGracePeriodChange}
          maxSelectableScore={maxSelectableScore}
          isFinalTier={isFinalTier}
        />
      </div>
    </div>
  );
};

export default TierPolicyCard;
