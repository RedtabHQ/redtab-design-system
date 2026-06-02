/**
 * Custom hook for merchant onboarding form management
 */

import { useForm } from 'react-hook-form';
import {
  type OnboardingFormData,
  onboardingValidationResolver,
  ONBOARDING_DEFAULT_VALUES,
} from '../utils/onboardingValidation';

export const useOnboardingForm = () => {
  const form = useForm<OnboardingFormData>({
    mode: 'onBlur',
    resolver: onboardingValidationResolver,
    defaultValues: ONBOARDING_DEFAULT_VALUES,
  });

  return form;
};
