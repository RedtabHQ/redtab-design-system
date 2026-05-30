import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface ListShellProps {
  header?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  className?: string;
}

export const ListShell = forwardRef<HTMLDivElement, ListShellProps>(
  ({ header, filters, children, footer, isLoading, isError, errorMessage, className }, ref) => (
    <div ref={ref} className={cn('space-y-6 pb-20', className)}>
      {header && <div className="space-y-4">{header}</div>}

      <div className="rounded-xl border border-neutral-200 bg-neutral-0 shadow-sm overflow-hidden">
        {filters && <div className="border-b border-neutral-200">{filters}</div>}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2" />
              <p className="text-sm text-neutral-600">Loading...</p>
            </div>
          </div>
        )}

        {isError && !isLoading && (
          <div className="bg-error-50 border-t border-error-200 p-6 flex items-start gap-3">
            <div className="flex-shrink-0 text-error-600">⚠</div>
            <div>
              <p className="text-sm font-semibold text-error-900">Failed to load data</p>
              {errorMessage && <p className="text-sm text-error-700 mt-1">{errorMessage}</p>}
            </div>
          </div>
        )}

        {!isLoading && !isError && children}

        {footer && <div className="border-t border-neutral-200">{footer}</div>}
      </div>
    </div>
  ),
);

ListShell.displayName = 'ListShell';
