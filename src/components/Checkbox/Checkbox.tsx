import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, indeterminate, error, id, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null);

    // Merge refs so both the forwarded ref and innerRef point to the same element
    const setRef = (node: HTMLInputElement | null) => {
      (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate]);

    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-start gap-3">
        <input
          ref={setRef}
          type="checkbox"
          id={checkboxId}
          className={cn(
            'mt-0.5 h-4 w-4 shrink-0 rounded border border-neutral-300 accent-primary-500 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error-500 accent-error-500',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            description
              ? `${checkboxId}-description`
              : error
                ? `${checkboxId}-error`
                : undefined
          }
          {...props}
        />
        {(label || description || error) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium leading-none text-neutral-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            )}
            {description && (
              <p id={`${checkboxId}-description`} className="text-xs text-neutral-500">
                {description}
              </p>
            )}
            {error && (
              <p id={`${checkboxId}-error`} className="text-xs text-error-500" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
