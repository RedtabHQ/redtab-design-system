import { ReactNode } from 'react';

export interface FormContextType {
  isSubmitting: boolean;
  errors: Record<string, string>;
  setSubmitting: (isSubmitting: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
}

export interface FormProviderProps {
  children: ReactNode;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
  onSubmittingChange?: (isSubmitting: boolean) => void;
  onErrorsChange?: (errors: Record<string, string>) => void;
}

export interface FormWrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  hint?: string;
}