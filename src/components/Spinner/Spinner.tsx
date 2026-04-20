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
