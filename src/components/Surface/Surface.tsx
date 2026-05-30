import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface SurfaceProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ children, className, variant = 'default', padding = 'md' }, ref) => {
    const paddingClasses = {
      sm: 'p-3',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
    };

    const variantClasses = {
      default: 'bg-neutral-0 rounded-lg border border-neutral-200 shadow-sm',
      elevated: 'bg-neutral-0 rounded-lg border border-neutral-200 shadow-md',
      outlined: 'bg-transparent rounded-lg border border-neutral-200',
    };

    return (
      <div ref={ref} className={cn(variantClasses[variant], paddingClasses[padding], className)}>
        {children}
      </div>
    );
  },
);

Surface.displayName = 'Surface';
