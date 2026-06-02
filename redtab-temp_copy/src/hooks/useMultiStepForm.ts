/**
 * Custom hook for managing multi-step forms
 * Provides step navigation, validation, and state management
 */

import { useCallback, useState } from 'react';
import { UseFormTrigger } from 'react-hook-form';

interface UseMultiStepFormOptions {
  totalSteps: number;
  onStepChange?: (step: number) => void;
}

export const useMultiStepForm = ({ totalSteps, onStepChange }: UseMultiStepFormOptions) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      onStepChange?.(step);
    }
  }, [totalSteps, onStepChange]);

  const nextStep = useCallback(async (
    trigger?: UseFormTrigger<Record<string, unknown>>,
    fieldsToValidate?: string[],
  ) => {
    if (trigger && fieldsToValidate) {
      setIsLoading(true);
      try {
        const isValid = await trigger(fieldsToValidate);
        if (isValid && currentStep < totalSteps) {
          setCompletedSteps(prev => new Set(prev).add(currentStep));
          setCurrentStep(currentStep + 1);
          onStepChange?.(currentStep + 1);
        }
        return isValid;
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep < totalSteps) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(currentStep + 1);
      onStepChange?.(currentStep + 1);
      return true;
    }
    return false;
  }, [currentStep, totalSteps, onStepChange]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      onStepChange?.(currentStep - 1);
      return true;
    }
    return false;
  }, [currentStep, onStepChange]);

  const markStepCompleted = useCallback((step: number) => {
    setCompletedSteps(prev => new Set(prev).add(step));
  }, []);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return {
    currentStep,
    completedSteps,
    isLoading,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    previousStep,
    markStepCompleted,
    setIsLoading,
  };
};
