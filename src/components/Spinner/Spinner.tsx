import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const spinnerVariants = cva('animate-spin rounded-full border-2 border-transparent', {
  variants: {
    variant: {
      primary: 'border-t-primary-500 border-r-primary-500',
      secondary: 'border-t-neutral-500 border-r-neutral-500',
      white: 'border-t-neutral-0 border-r-neutral-0',
    },
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface SpinnerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function Spinner({ className, variant, size, label, ...props }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2" {...props}>
      <div
        className={cn(spinnerVariants({ variant, size, className }))}
        role="status"
        aria-label={label ?? 'Loading'}
      />
      {label && <span className="text-sm font-medium text-neutral-500">{label}</span>}
    </div>
  );
}

type InlineSpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type InlineSpinnerVariant = 'primary' | 'secondary' | 'white';

const inlineSizeClasses: Record<InlineSpinnerSize, string> = {
  sm: 'w-3 h-3 border',
  md: 'w-4 h-4 border-2',
  lg: 'w-5 h-5 border-2',
  xl: 'w-6 h-6 border-2',
};

const inlineVariantClasses: Record<InlineSpinnerVariant, string> = {
  primary: 'border-redtab border-t-transparent',
  secondary: 'border-gray-500 border-t-transparent',
  white: 'border-white border-t-transparent',
};

export function InlineSpinner({ size = 'md', variant = 'white', className = '' }: {
  size?: InlineSpinnerSize;
  variant?: InlineSpinnerVariant;
  className?: string;
}) {
  return (
    <div
      className={`inline-block rounded-full animate-spin ${inlineSizeClasses[size]} ${inlineVariantClasses[variant]} ${className}`}
      aria-label="Loading"
    />
  );
}
