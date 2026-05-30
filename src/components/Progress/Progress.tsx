import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const progressVariants = cva('overflow-hidden rounded-full bg-neutral-200', {
  variants: {
    size: {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface ProgressProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  label?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size, label, ...props }, ref) => {
    const normalizedMax = max > 0 ? max : 100;
    const progressValue = Math.min(100, Math.max(0, (value / normalizedMax) * 100));

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        <div className={cn(progressVariants({ size }))}>
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progressValue}%` }}
          />
        </div>
        {label ? <p className="text-xs text-neutral-600">{label}</p> : null}
      </div>
    );
  },
);

Progress.displayName = 'Progress';

export { progressVariants };
