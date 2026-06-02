/**
 * BankProviderSelect Component
 *
 * A reusable select dropdown component for bank providers (settlement rails) that
 * automatically loads data from the API. Supports react-hook-form integration via register.
 *
 * @example
 * ```tsx
 * const { register, formState: { errors } } = useForm<FormData>({
 *   mode: 'onBlur',
 * });
 *
 * <BankProviderSelect
 *   {...register('bankProvider', {
 *     required: 'Bank provider is required',
 *   })}
 *   error={errors.bankProvider?.message}
 *   label="Settlement Provider (Bank/Wallet)"
 * />
 * ```
 */

import React from 'react';
import { useActiveBankProviders } from '@/features/settlement/hooks';

interface BankProviderSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
}

const BankProviderSelect = React.forwardRef<
  HTMLSelectElement,
  BankProviderSelectProps
>(
  (
    {
      label,
      error,
      placeholder = 'Select a bank provider...',
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const { data: providers = [], isLoading } = useActiveBankProviders();

    const selectClassName = `
      w-full px-6 py-4 bg-white border border-gray-100 rounded text-sm
      font-bold outline-none focus:ring-2 focus:ring-redtab appearance-none
      cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? 'border-red-500 focus:ring-red-500' : ''}
      ${className}
    `.trim();

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">
            {label}
          </label>
        )}
        <select
          ref={ref}
          disabled={disabled || isLoading}
          className={selectClassName}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1.5rem center',
            paddingRight: '2.5rem',
          }}
          {...props}
        >
          <option value="">{isLoading ? 'Loading providers...' : placeholder}</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.railName}>
              {provider.railName}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

BankProviderSelect.displayName = 'BankProviderSelect';

export default BankProviderSelect;
