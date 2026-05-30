import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface FilterBarProps {
  children: ReactNode;
  sticky?: boolean;
  className?: string;
}

export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
  ({ children, sticky = true, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'border-b border-neutral-200 bg-neutral-0 p-4 sm:p-6',
        sticky && 'sticky top-0 z-30',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {children}
      </div>
    </div>
  ),
);

FilterBar.displayName = 'FilterBar';
