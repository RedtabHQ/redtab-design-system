import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface AuthCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const AuthCard = forwardRef<HTMLDivElement, AuthCardProps>(
  ({ title, description, children, footer, className }, ref) => (
    <div ref={ref} className={cn('w-full max-w-md rounded-3xl bg-neutral-0 shadow-lg shadow-neutral-200/50 p-8 border border-neutral-100', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">{title}</h2>}
          {description && <p className="text-sm text-neutral-600">{description}</p>}
        </div>
      )}

      {children}

      {footer && <div className="mt-6 pt-6 border-t border-neutral-100">{footer}</div>}
    </div>
  ),
);

AuthCard.displayName = 'AuthCard';
