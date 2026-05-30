import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface LoginProps {
  title?: string;
  description?: string;
  footer?: ReactNode;
  illustration?: ReactNode;
  children: ReactNode;
  className?: string;
  cardClassName?: string;
}

export const Login = forwardRef<HTMLDivElement, LoginProps>(
  ({ title, description, footer, illustration, children, className, cardClassName }, ref) => (
    <div ref={ref} className={cn('min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        {illustration ? (
          <div className="hidden rounded-3xl bg-primary-50 p-8 lg:block">
            {illustration}
          </div>
        ) : null}

        <div className={cn('mx-auto w-full max-w-md rounded-3xl bg-neutral-0 p-8 shadow-sm ring-1 ring-neutral-200', cardClassName)}>
          {(title || description) && (
            <div className="mb-6 space-y-3 text-center">
              {title ? <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1> : null}
              {description ? <p className="text-sm text-neutral-600">{description}</p> : null}
            </div>
          )}

          {children}

          {footer ? <div className="mt-6 text-center text-sm text-neutral-500">{footer}</div> : null}
        </div>
      </div>
    </div>
  ),
);

Login.displayName = 'Login';
