import React from 'react';
import { Merchant } from '@/types';
import { useMerchantScoreBreakdown } from '../hooks/useMerchantScoreBreakdown';
import { StatsCard } from '@/components/common';
import { ScoreDecomposition } from './ScoreDecomposition';
import { RiskEngineSentinel } from './RiskEngineSentinel';

interface MerchantTrustScoreTabProps {
  merchant: Merchant;
}

export const MerchantTrustScoreTab: React.FC<MerchantTrustScoreTabProps> = ({ merchant }) => {
  const { data: scoreBreakdown, isLoading } = useMerchantScoreBreakdown(merchant.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading score breakdown...</div>
      </div>
    );
  }

  // Use data from API or fallback to merchant data
  const trustScore = scoreBreakdown?.trustScore ?? merchant.trustScore;
  const capacityScore = scoreBreakdown?.capacityScore ?? merchant.capacityScore;
  const intentionScore = scoreBreakdown?.intentionScore ?? merchant.intentionScore;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard label="Trust Score" value={trustScore != null ? `${trustScore}%` : '-'} variant="compact" color="gray" />
        <StatsCard label="Capacity Score" value={capacityScore != null ? `${capacityScore}%` : '-'} variant="compact" color="red" />
        <StatsCard label="Intention Score" value={intentionScore != null ? `${intentionScore}%` : '-'} variant="compact" color="blue" />
      </div>

      {/* Sub-Score Decomposition */}
      <ScoreDecomposition
        capacityScore={capacityScore}
        intentionScore={intentionScore}
        capacityIndicators={scoreBreakdown?.capacityIndicators}
        intentionIndicators={scoreBreakdown?.intentionIndicators}
      />

      {/* Risk Engine Sentinel */}
      <RiskEngineSentinel riskFactors={scoreBreakdown?.riskFactors} />
    </div>
  );
};
