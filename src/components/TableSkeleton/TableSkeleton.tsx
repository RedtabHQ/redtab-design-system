import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export const TableSkeleton = forwardRef<HTMLDivElement, TableSkeletonProps>(
  ({ rows = 5, columns = 5, showHeader = true, className }, ref) => (
    <div ref={ref} className={cn('space-y-3', className)}>
      {showHeader && (
        <div className="flex gap-4 p-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 h-4 bg-neutral-200 rounded animate-pulse" />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 p-4 border-t border-neutral-200">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="flex-1 h-4 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  ),
);

TableSkeleton.displayName = 'TableSkeleton';
