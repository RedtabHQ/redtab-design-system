// Hooks
export { useOnboardingForm } from './hooks/useOnboardingForm';

// Steps
export { Step1EntityProfile } from './steps/Step1EntityProfile';
export { Step2FinancialCapacity } from './steps/Step2FinancialCapacity';
export { Step3Obligations } from './steps/Step3Obligations';
export { Step4Behavior } from './steps/Step4Behavior';
export { Step5KYCSubmission } from './steps/Step5KYCSubmission';
export { StepNavigationButtons } from './steps/StepNavigationButtons';

// Components
export { OnboardingHeader } from '@/components/common';
export { OnboardingSidebar } from './components/OnboardingSidebar';
export { OnboardingField } from './components/OnboardingField';

// Utilities & Types
export {
  type OnboardingFormData,
  onboardingValidationResolver,
  ONBOARDING_DEFAULT_VALUES,
  FIELD_PLACEHOLDERS,
} from './utils/onboardingValidation';
export { calculatePredictedScore, getTierFromScore } from './utils/scoringCalculator';
