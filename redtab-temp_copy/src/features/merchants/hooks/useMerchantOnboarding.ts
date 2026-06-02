import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { usePolicyConfig, useScoringHierarchy } from '@/features/merchants/hooks';
import { useCreateMerchant } from '@/features/merchants/hooks';
import { Currency, CurrencySymbol, MerchantStatus, type Merchant } from '@types';
import { POLICY_CONFIG, SCORING_HIERARCHY } from '@/constants';
import { useOnboardingForm, OnboardingFormData } from './useOnboardingForm';
import { useOnboardingValidation, ValidationErrors } from './useOnboardingValidation';
import { useOnboardingAssessment, CreditAssessment } from './useOnboardingAssessment';
import { useOnboardingStep } from './useOnboardingStep';

export type { OnboardingFormData, ValidationErrors, CreditAssessment };

/**
 * Custom hook for merchant onboarding workflow
 *
 * Delegates complex logic to specialized sub-hooks:
 * - useOnboardingForm: Form state management
 * - useOnboardingValidation: Field and step validation
 * - useOnboardingAssessment: Credit score calculation
 * - useOnboardingStep: Multi-step navigation
 *
 * @example
 * ```tsx
 * const {
 *   form,
 *   updateForm,
 *   step,
 *   nextStep,
 *   prevStep,
 *   assessment,
 *   submit,
 *   isSubmitting,
 *   validationErrors
 * } = useMerchantOnboarding();
 * ```
 */
export const useMerchantOnboarding = () => {
  const navigate = useNavigate();
  const { availableSegments } = useMarketSegment();
  const { data: policyConfigData } = usePolicyConfig();
  const { data: scoringHierarchyData } = useScoringHierarchy();
  const policyConfig = policyConfigData ?? POLICY_CONFIG;
  const scoringHierarchy = scoringHierarchyData ?? SCORING_HIERARCHY;
  const createMerchant = useCreateMerchant();

  // Use specialized hooks for different concerns
  const { form, updateField, updateBatch, reset } = useOnboardingForm();
  const { validationErrors, validateStep, validateAll, clearError } = useOnboardingValidation();
  const { step, totalSteps, nextStep: moveToNextStep, prevStep: moveToPrevStep, goToStep } = useOnboardingStep();

  // Get active market segment configuration
  const activeRegion = useMemo(
    () => availableSegments.find((s) => s.id === form.regionId),
    [availableSegments, form.regionId]
  );

  // Calculate predictive credit assessment
  const assessment = useOnboardingAssessment({
    form,
    scoringHierarchy,
    policyConfig,
  });

  // Validate step and move forward only if validation passes
  const nextStep = useCallback(() => {
    if (validateStep(step, form)) {
      moveToNextStep();
    }
  }, [step, form, validateStep, moveToNextStep]);

  // Submit onboarding form
  const submit = useCallback(async () => {
    if (!validateAll(form)) {
      return;
    }

    const merchantData: Partial<Merchant> = {
      name: form.name,
      category: form.category,
      contactPerson: form.contactPerson,
      email: form.email,
      phone: form.phone,
      status: MerchantStatus.PENDING,
      kycDocuments: form.docs.length > 0 ? form.docs : ['Business Registration', 'Tax Clearance'],
      ageMonths: form.tenureMonths,
      creditScore: assessment.score,
      capacityScore: assessment.capacityScore,
      intentionScore: assessment.intentionScore,
      tier: assessment.tier,
    };

    await createMerchant.mutateAsync(merchantData);
    navigate('/merchants');
  }, [form, activeRegion, assessment, createMerchant, navigate, validateAll]);

  return {
    // Form state and updates
    form,
    updateForm: updateField,
    updateFormBatch: updateBatch,

    // Step management
    step,
    totalSteps,
    nextStep,
    prevStep: moveToPrevStep,
    goToStep,

    // Validation
    validationErrors,
    validateStep: (currentStep: number) => validateStep(currentStep, form),
    clearValidationError: clearError,

    // Assessment
    assessment,
    activeRegion,

    // Submission
    submit,
    isSubmitting: createMerchant.isPending,
    submitError: createMerchant.error,

    // Utilities
    resetForm: reset,
  };
};
