import { forwardRef, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ErrorBannerProps {
  title?: string;
  message?: string;
  children?: ReactNode;
  variant?: 'error' | 'warning' | 'info';
  className?: string;
}

export const ErrorBanner = forwardRef<HTMLDivElement, ErrorBannerProps>(
  ({ title, message, children, variant = 'error', className }, ref) => {
    const variantClasses = {
      error: 'bg-error-50 border-error-200 text-error-900',
      warning: 'bg-warning-50 border-warning-200 text-warning-900',
      info: 'bg-info-50 border-info-200 text-info-900',
    };

    const iconColors = {
      error: 'text-error-600',
      warning: 'text-warning-600',
      info: 'text-info-600',
    };

    return (
      <div ref={ref} className={cn('border rounded-lg p-4 flex items-start gap-3', variantClasses[variant], className)}>
        <AlertCircle size={20} className={cn(iconColors[variant], 'flex-shrink-0 mt-0.5')} />
        <div>
          {title && <p className="text-sm font-semibold">{title}</p>}
          {message && <p className="text-sm mt-1">{message}</p>}
          {children}
        </div>
      </div>
    );
  },
);

ErrorBanner.displayName = 'ErrorBanner';
