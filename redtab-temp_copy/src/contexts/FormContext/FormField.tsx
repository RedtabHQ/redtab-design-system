import React, { ReactElement, ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  hint?: string;
}

/**
 * FormField wrapper for consistent styling
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  children,
  hint,
}): ReactElement => {
  return (
    <div className="space-y-2">
      <label className="block text-2xs font-black text-gray-400 uppercase tracking-widest">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="text-2xs text-gray-400 italic">{hint}</p>
      )}
    </div>
  );
};