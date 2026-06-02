import React, { ReactElement } from 'react';
import { FormContext } from './FormContext';
import { FormProviderProps, FormContextType } from './types';

/**
 * FormProvider - Centralized form state management
 * Provides shared context for form-related state across components
 */
export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  isSubmitting: externalIsSubmitting = false,
  errors: externalErrors = {},
  onSubmittingChange,
  onErrorsChange,
}): ReactElement => {
  const handleSetSubmitting = (isSubmitting: boolean) => {
    onSubmittingChange?.(isSubmitting);
  };

  const handleSetErrors = (errors: Record<string, string>) => {
    onErrorsChange?.(errors);
  };

  const handleClearErrors = () => {
    onErrorsChange?.({});
  };

  const value: FormContextType = {
    isSubmitting: externalIsSubmitting,
    errors: externalErrors,
    setSubmitting: handleSetSubmitting,
    setErrors: handleSetErrors,
    clearErrors: handleClearErrors,
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};