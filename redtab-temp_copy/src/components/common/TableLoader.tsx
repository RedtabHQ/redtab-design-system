import { Skeleton } from '@redtabhq/design-system';

interface TableLoaderProps {
  rows?: number;
  columns?: number;
  message?: string;
}

export function TableLoader({ rows = 5, columns = 4, message = 'Loading data...' }: TableLoaderProps) {
  return (
    <div className="w-full animate-pulse p-4">
      <div className="flex gap-4 mb-4 pb-3 border-b border-neutral-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`h-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`r-${r}`} className="flex gap-4">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton key={`c-${c}`} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
      {message && (
        <p className="text-center mt-6 text-sm text-gray-500">{message}</p>
      )}
    </div>
  );
}
