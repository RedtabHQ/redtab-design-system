import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface PageShellProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const PageShell = forwardRef<HTMLDivElement, PageShellProps>(
  ({ title, description, actions, children, className, headerClassName, contentClassName }, ref) => (
    <div ref={ref} className={cn('min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto w-full max-w-7xl">
        {(title || description || actions) && (
          <div className={cn('mb-8 flex flex-col gap-4 rounded-3xl bg-neutral-0 p-6 shadow-sm ring-1 ring-neutral-200 lg:flex-row lg:items-center lg:justify-between', headerClassName)}>
            <div className="space-y-2">
              {title ? <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1> : null}
              {description ? <p className="text-sm text-neutral-600">{description}</p> : null}
            </div>
            {actions ? <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div> : null}
          </div>
        )}

        <div className={cn('rounded-3xl bg-neutral-0 p-6 shadow-sm ring-1 ring-neutral-200', contentClassName)}>{children}</div>
      </div>
    </div>
  ),
);

PageShell.displayName = 'PageShell';
