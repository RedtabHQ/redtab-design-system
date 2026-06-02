/**
 * MarketSegmentSelector Component
 *
 * A reusable select dropdown component for operational market segments that automatically
 * loads active market segments from the API. Supports react-hook-form integration via register.
 *
 * @example
 * ```tsx
 * const { register, formState: { errors } } = useForm<FormData>({
 *   mode: 'onBlur',
 * });
 *
 * <MarketSegmentSelector
 *   {...register('marketSegmentId', {
 *     required: 'Market segment is required',
 *   })}
 *   error={errors.marketSegmentId?.message}
 *   label="Operational Market"
 * />
 * ```
 */

import React from 'react';
import { useActiveMarketSegments } from '@/hooks/useMarketSegments';

interface MarketSegmentSelectorProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  showCurrency?: boolean;
}

const MarketSegmentSelector = React.forwardRef<
  HTMLSelectElement,
  MarketSegmentSelectorProps
>(
  (
    {
      label = 'Operational Market',
      error,
      placeholder = 'Select operational market...',
      showCurrency = true,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const { data: marketSegments = [], isLoading } = useActiveMarketSegments();

    const selectClassName = `
      w-full px-6 py-4 bg-gray-50 border rounded-2xl text-sm
      font-bold outline-none focus:ring-2 transition-all
      disabled:opacity-50 disabled:cursor-not-allowed
      appearance-none cursor-pointer
      ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-100 focus:ring-redtab'}
      ${className}
    `.trim();

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-2xs font-black text-gray-400 uppercase tracking-widest px-1">
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
          <option value="">{isLoading ? 'Loading...' : placeholder}</option>
          {marketSegments.map((segment) => (
            <option key={segment.id} value={segment.id}>
              {segment.name}
              {showCurrency && segment.currency ? ` (${segment.currency})` : ''}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

MarketSegmentSelector.displayName = 'MarketSegmentSelector';

export default MarketSegmentSelector;
