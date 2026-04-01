import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, error, hint, required, htmlFor, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
        {label && (
          <label
            htmlFor={htmlFor}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
            {required && (
              <span className="ml-1 text-error-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        {children}
        {error && (
          <p className="text-xs text-error-500" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-neutral-500">{hint}</p>
        )}
      </div>
    );
  },
);

FormField.displayName = 'FormField';
