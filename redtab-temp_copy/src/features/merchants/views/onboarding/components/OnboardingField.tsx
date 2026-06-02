/**
 * Reusable form field component for onboarding
 */

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { OnboardingFormData } from '../utils/onboardingValidation';
import { FIELD_PLACEHOLDERS } from '../utils/onboardingValidation';

interface OnboardingFieldProps {
  label: string;
  field: keyof OnboardingFormData;
  type?: string;
  register: UseFormRegister<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}

export const OnboardingField = ({
  label,
  field,
  type = 'text',
  register,
  errors,
}: OnboardingFieldProps) => {
  return (
    <div className="space-y-2 group">
      <label className="text-2xs font-black text-gray-400 uppercase tracking-widest px-1 group-focus-within:text-red-600 transition-colors">
        {label}
      </label>
      <input
        type={type}
        placeholder={FIELD_PLACEHOLDERS[field]}
        {...register(field)}
        className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl text-sm font-bold outline-none transition-all shadow-inner placeholder:text-gray-300 ${
          errors[field]
            ? 'border-red-300 focus:ring-4 focus:ring-red-50/50'
            : 'border-gray-100 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-50/50'
        }`}
      />
      {errors[field] && <p className="mt-1 text-xs text-red-600">{errors[field]?.message}</p>}
    </div>
  );
};
