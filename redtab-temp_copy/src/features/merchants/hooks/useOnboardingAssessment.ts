import { useMemo } from 'react';
import { CreditTier } from '@types';
import { OnboardingFormData } from './useOnboardingForm';

export interface CreditAssessment {
  score: number;
  tier: CreditTier;
  capacityScore: number;
  intentionScore: number;
}

interface ScoringConfig {
  CAPACITY?: { weight: number };
  INTENTION?: { weight: number };
}

interface PolicyConfig {
  LIFECYCLE_MULTIPLIERS?: {
    NEW?: number;
    EARLY_STABLE?: number;
    PROVEN?: number;
  };
}

interface UseOnboardingAssessmentProps {
  form: OnboardingFormData;
  scoringHierarchy: ScoringConfig;
  policyConfig: PolicyConfig;
}

/**
 * Hook for calculating credit assessment and scoring
 */
export const useOnboardingAssessment = ({
  form,
  scoringHierarchy,
  policyConfig,
}: UseOnboardingAssessmentProps): CreditAssessment => {
  return useMemo(() => {
    const { CAPACITY = { weight: 0.5 }, INTENTION = { weight: 0.5 } } = scoringHierarchy;

    // Calculate capacity score (0-100)
    let capacityScore = 50; // Base score

    if (form.bankFlows > 1000000) capacityScore += 15;
    else if (form.bankFlows > 500000) capacityScore += 10;
    else if (form.bankFlows > 100000) capacityScore += 5;

    if (form.liquidAssets > 500000) capacityScore += 10;
    else if (form.liquidAssets > 200000) capacityScore += 5;

    if (form.profitMargin > 20) capacityScore += 5;
    else if (form.profitMargin > 15) capacityScore += 3;

    if (form.inventoryTurnover > 15) capacityScore += 5;
    else if (form.inventoryTurnover > 10) capacityScore += 3;

    const totalDebt =
      form.employeeArrears +
      form.householdDebt +
      form.outsideLoans +
      form.taxDues;

    if (totalDebt > 500000) capacityScore -= 20;
    else if (totalDebt > 200000) capacityScore -= 10;
    else if (totalDebt > 100000) capacityScore -= 5;

    if (form.employeeArrears > 0) capacityScore -= 15;
    if (form.taxDues > 0) capacityScore -= 10;

    capacityScore = Math.min(100, Math.max(0, capacityScore));

    // Calculate intention score (0-100)
    let intentionScore = 50; // Base score

    if (form.tenureMonths > 24) intentionScore += 15;
    else if (form.tenureMonths > 12) intentionScore += 10;
    else if (form.tenureMonths > 6) intentionScore += 5;

    if (form.fulfillmentRate >= 95) intentionScore += 10;
    else if (form.fulfillmentRate >= 90) intentionScore += 5;
    else if (form.fulfillmentRate < 80) intentionScore -= 10;

    if (form.refundRate < 2) intentionScore += 10;
    else if (form.refundRate < 5) intentionScore += 5;
    else if (form.refundRate > 10) intentionScore -= 10;

    if (form.socialReputation > 90) intentionScore += 10;
    else if (form.socialReputation > 80) intentionScore += 5;
    else if (form.socialReputation < 60) intentionScore -= 10;

    if (form.responsiveness > 90) intentionScore += 5;
    else if (form.responsiveness < 70) intentionScore -= 5;

    intentionScore = Math.min(100, Math.max(0, intentionScore));

    // Calculate weighted final score
    const finalScore = Math.round(
      capacityScore * CAPACITY.weight + intentionScore * INTENTION.weight
    );

    // Apply lifecycle multipliers
    let multiplier = 1.0;
    const multipliers = policyConfig.LIFECYCLE_MULTIPLIERS;
    if (multipliers) {
      if (form.tenureMonths <= 3) multiplier = multipliers.NEW || 0.85;
      else if (form.tenureMonths <= 6) multiplier = multipliers.EARLY_STABLE || 0.9;
      else if (form.tenureMonths > 12) multiplier = multipliers.PROVEN || 1.05;
    }

    const adjustedScore = Math.round(finalScore * multiplier);
    const clampedScore = Math.min(100, Math.max(0, adjustedScore));

    // Determine tier
    let tier = CreditTier.T3;
    if (clampedScore >= 85) tier = CreditTier.T1;
    else if (clampedScore >= 70) tier = CreditTier.T2;
    else if (clampedScore >= 50) tier = CreditTier.T3;
    else tier = CreditTier.NONE;

    return {
      score: clampedScore,
      tier,
      capacityScore: Math.round(capacityScore),
      intentionScore: Math.round(intentionScore),
    };
  }, [form, scoringHierarchy, policyConfig]);
};
