import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

// ─── Radio ────────────────────────────────────────────────────────────────────

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, value, ...props }, ref) => {
    const radioId = id || `radio-${value}`;

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          value={value}
          className={cn(
            'h-4 w-4 shrink-0 border border-neutral-300 accent-primary-500 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={radioId}
            className="text-sm font-medium text-neutral-700 select-none cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Radio.displayName = 'Radio';

// ─── RadioGroup ───────────────────────────────────────────────────────────────

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  label?: string;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    { name, value: _value, onChange, children, label, error, orientation = 'vertical', className },
    ref,
  ) => {
    return (
      <fieldset ref={ref} className={cn('flex flex-col gap-1', className)}>
        {label && (
          <legend className="mb-1 text-sm font-medium text-neutral-700">{label}</legend>
        )}
        <div
          className={cn(
            'flex gap-3',
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
          )}
          role="radiogroup"
          // Propagate name and checked state down through context-like cloneElement approach
          // Children (Radio components) should have their own name/checked bound by consumer,
          // but we provide onChange capture here via event delegation
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.type === 'radio' && onChange) {
              onChange(target.value);
            }
          }}
          // Attach name to all child radio inputs via data attribute for consumers who want it
          data-radio-group-name={name}
        >
          {children}
        </div>
        {error && (
          <p className="text-xs text-error-500" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';
