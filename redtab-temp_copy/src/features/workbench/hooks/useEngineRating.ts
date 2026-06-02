import { useCallback } from 'react';
import { CreditTier } from '@/types';
import { usePolicyConfig } from '@/features/merchants/hooks';
import { getCreditScorePercent } from '@/utils/creditScore';

export const useEngineRating = () => {
  const { data: policyConfig } = usePolicyConfig();

  const getEngineRating = useCallback(
    (score: number): 'A' | 'B' | 'C' | 'D' => {
      const normalizedScore = getCreditScorePercent(score);
      if (!policyConfig) return 'D';
      if (normalizedScore >= policyConfig.TIERS[CreditTier.T1]?.minScore) return 'A';
      if (normalizedScore >= policyConfig.TIERS[CreditTier.T2]?.minScore) return 'B';
      if (normalizedScore >= policyConfig.TIERS[CreditTier.T3]?.minScore) return 'C';
      return 'D';
    },
    [policyConfig]
  );

  const getRecommendedTier = useCallback(
    (score: number): CreditTier => {
      const rating = getEngineRating(score);
      const mapping = { A: CreditTier.T1, B: CreditTier.T2, C: CreditTier.T3, D: CreditTier.NONE };
      return mapping[rating];
    },
    [getEngineRating]
  );

  return { getEngineRating, getRecommendedTier };
};
