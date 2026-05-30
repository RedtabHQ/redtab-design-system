import { forwardRef, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AuthErrorBannerProps {
  title?: string;
  message?: string;
  children?: ReactNode;
  className?: string;
}

export const AuthErrorBanner = forwardRef<HTMLDivElement, AuthErrorBannerProps>(
  ({ title, message, children, className }, ref) => (
    <div ref={ref} className={cn('mb-6 bg-error-50 border border-error-200 rounded-lg p-4 flex items-start gap-3', className)}>
      <AlertCircle size={20} className="text-error-600 flex-shrink-0 mt-0.5" />
      <div>
        {title && <p className="text-sm font-semibold text-error-900">{title}</p>}
        {message && <p className="text-sm text-error-700 mt-1">{message}</p>}
        {children}
      </div>
    </div>
  ),
);

AuthErrorBanner.displayName = 'AuthErrorBanner';
