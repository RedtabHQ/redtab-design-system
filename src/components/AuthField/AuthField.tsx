import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, error, icon, hint, placeholder, className, ...props }, ref) => (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-neutral-900 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 flex-shrink-0">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          placeholder={placeholder}
          className={cn(
            'w-full py-3 px-4 bg-neutral-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all',
            icon ? 'pl-12' : '',
            error
              ? 'border-error-300 focus:ring-error-500 focus:border-transparent'
              : 'border-neutral-200 focus:ring-primary-500 focus:border-transparent',
            className,
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-error-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>
      )}
    </div>
  ),
);

AuthField.displayName = 'AuthField';
