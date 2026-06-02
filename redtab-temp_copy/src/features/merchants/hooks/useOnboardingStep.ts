import { useState, useCallback } from 'react';

const TOTAL_STEPS = 5;

/**
 * Hook for managing multi-step form navigation
 */
export const useOnboardingStep = (initialStep = 1) => {
  const [step, setStep] = useState(initialStep);

  const nextStep = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((targetStep: number) => {
    if (targetStep >= 1 && targetStep <= TOTAL_STEPS) {
      setStep(targetStep);
    }
  }, []);

  const reset = useCallback(() => {
    setStep(initialStep);
  }, [initialStep]);

  const isFirstStep = step === 1;
  const isLastStep = step === TOTAL_STEPS;

  return {
    step,
    totalSteps: TOTAL_STEPS,
    nextStep,
    prevStep,
    goToStep,
    reset,
    isFirstStep,
    isLastStep,
  };
};
