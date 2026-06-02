import { useContext } from 'react';
import { FormContext } from './FormContext';
import { FormContextType } from './types';

/**
 * useFormContext - Hook to access FormContext
 * Ensures the hook is used within FormProvider
 */
export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};