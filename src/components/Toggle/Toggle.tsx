import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const toggleTrackVariants = cva(
  'relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const toggleThumbVariants = cva(
  'pointer-events-none inline-block rounded-full bg-neutral-0 shadow-md ring-0 transition-transform duration-200',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof toggleTrackVariants> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, checked = false, onChange, label, disabled, size, id, ...props }, ref) => {
    const toggleId = id || (label ? `toggle-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const thumbTranslate =
      size === 'sm'
        ? checked
          ? 'translate-x-4'
          : 'translate-x-0'
        : checked
          ? 'translate-x-5'
          : 'translate-x-0';

    return (
      <div className="flex items-center gap-2">
        <button
          ref={ref}
          id={toggleId}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange?.(!checked)}
          className={cn(
            toggleTrackVariants({ size }),
            checked ? 'bg-primary-500' : 'bg-neutral-300',
            className,
          )}
          {...props}
        >
          <span
            aria-hidden="true"
            className={cn(toggleThumbVariants({ size }), thumbTranslate)}
          />
        </button>
        {label && (
          <label
            htmlFor={toggleId}
            className={cn(
              'text-sm font-medium text-neutral-700 select-none',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            )}
            onClick={() => !disabled && onChange?.(!checked)}
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Toggle.displayName = 'Toggle';

export { toggleTrackVariants };
