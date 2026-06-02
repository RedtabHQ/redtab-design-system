/**
 * Calculates predicted merchant scoring based on form data
 */

import type { OnboardingFormData } from './onboardingValidation';

export const calculatePredictedScore = (formValues: OnboardingFormData): number => {
  // Calculate capacity score (financial & obligations)
  let capacityScore = 50;

  if (formValues.bankFlows > 1000000) capacityScore += 15;
  else if (formValues.bankFlows > 500000) capacityScore += 10;
  else if (formValues.bankFlows > 200000) capacityScore += 5;

  if (formValues.liquidAssets > 500000) capacityScore += 10;
  else if (formValues.liquidAssets > 200000) capacityScore += 5;

  if (formValues.profitMargin > 25) capacityScore += 5;
  else if (formValues.profitMargin > 15) capacityScore += 3;

  if (formValues.inventoryTurnover > 20) capacityScore += 5;
  else if (formValues.inventoryTurnover > 12) capacityScore += 3;

  const totalDebt =
    formValues.employeeArrears +
    formValues.householdDebt +
    formValues.outsideLoans +
    formValues.taxDues;

  if (totalDebt > 500000) capacityScore -= 20;
  else if (totalDebt > 200000) capacityScore -= 10;
  else if (totalDebt > 100000) capacityScore -= 5;

  if (formValues.employeeArrears > 50000) capacityScore -= 15;
  else if (formValues.employeeArrears > 20000) capacityScore -= 10;

  if (formValues.taxDues > 20000) capacityScore -= 10;

  capacityScore = Math.min(100, Math.max(0, capacityScore));

  // Calculate intention score (behavioral)
  let intentionScore = 50;

  if (formValues.tenureMonths > 60) intentionScore += 15;
  else if (formValues.tenureMonths > 36) intentionScore += 10;
  else if (formValues.tenureMonths > 12) intentionScore += 5;

  if (formValues.fulfillmentRate >= 95) intentionScore += 10;
  else if (formValues.fulfillmentRate >= 90) intentionScore += 5;
  else if (formValues.fulfillmentRate < 80) intentionScore -= 10;

  if (formValues.refundRate < 2) intentionScore += 10;
  else if (formValues.refundRate < 5) intentionScore += 5;
  else if (formValues.refundRate > 10) intentionScore -= 10;

  if (formValues.socialReputation > 90) intentionScore += 10;
  else if (formValues.socialReputation > 80) intentionScore += 5;
  else if (formValues.socialReputation < 60) intentionScore -= 10;

  if (formValues.responsiveness > 90) intentionScore += 5;
  else if (formValues.responsiveness < 70) intentionScore -= 5;

  intentionScore = Math.min(100, Math.max(0, intentionScore));

  // Final score: weighted average
  return Math.round(capacityScore * 0.5 + intentionScore * 0.5);
};

export const getTierFromScore = (score: number): 'A' | 'B' | 'C' => {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  return 'C';
};
