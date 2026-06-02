import { useCallback } from 'react';
import { Merchant } from '@/types';
import { useScoringHierarchy, usePolicyConfig } from '@/features/merchants/hooks';
import { useAIDecisionSupport } from './useAIDecisionSupport';

interface UseAIMemoProps {
  selectedMerchant: Merchant | undefined;
}

export const useAIMemo = ({ selectedMerchant }: UseAIMemoProps) => {
  const { data: scoringHierarchy } = useScoringHierarchy();
  const { data: policyConfig } = usePolicyConfig();
  const { mutate: fetchDecisionSupport, isPending: isAnalyzing, data: decisionData } = useAIDecisionSupport();

  const handleAIDecision = useCallback(() => {
    if (!selectedMerchant || !scoringHierarchy || !policyConfig) return;
    fetchDecisionSupport({
      merchant: selectedMerchant as unknown as Record<string, unknown>,
      scoring: scoringHierarchy as unknown as Record<string, unknown>,
      policy: policyConfig as unknown as Record<string, unknown>
    });
  }, [selectedMerchant, scoringHierarchy, policyConfig, fetchDecisionSupport]);

  return {
    handleAIDecision,
    isAnalyzing,
    memo: decisionData?.content || null
  };
};
