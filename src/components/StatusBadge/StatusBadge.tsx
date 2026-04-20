import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 font-semibold border',
  {
    variants: {
      variant: {
        success: 'bg-success-50 text-success-700 border-success-100',
        error: 'bg-error-50 text-error-700 border-error-100',
        warning: 'bg-warning-50 text-warning-700 border-warning-100',
        info: 'bg-info-50 text-info-700 border-info-100',
        neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        primary: 'bg-primary-50 text-primary-700 border-primary-100',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded-lg',
        md: 'px-3 py-1 text-xs rounded-xl',
      },
      uppercase: {
        true: 'uppercase tracking-wider',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
      uppercase: false,
    },
  },
);

function DotIcon({ className }: { className?: string }) {
  return <span className={cn('inline-block w-1.5 h-1.5 rounded-full bg-current', className)} />;
}

export interface StatusBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean;
}

export function StatusBadge({ className, variant, size, uppercase, dot = false, children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant, size, uppercase, className }))} {...props}>
      {dot && <DotIcon />}
      {children}
    </span>
  );
}
