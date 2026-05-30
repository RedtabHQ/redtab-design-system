import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface StatsGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const StatsGrid = forwardRef<HTMLDivElement, StatsGridProps>(
  ({ children, columns = 4, className }, ref) => {
    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
      <div ref={ref} className={cn('grid gap-4', gridClasses[columns], className)}>
        {children}
      </div>
    );
  },
);

StatsGrid.displayName = 'StatsGrid';
