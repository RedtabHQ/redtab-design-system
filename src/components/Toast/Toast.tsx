import { forwardRef, useEffect, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const toastVariants = cva(
  'relative flex items-start gap-3 rounded-lg border p-4 shadow-md text-sm',
  {
    variants: {
      variant: {
        success: 'border-success-200 bg-success-50 text-success-900',
        warning: 'border-warning-200 bg-warning-50 text-warning-900',
        error: 'border-error-200 bg-error-50 text-error-900',
        info: 'border-primary-200 bg-primary-50 text-primary-900',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

export interface ToastProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
  onClose?: () => void;
  autoClose?: number;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    { className, variant = 'info', title, description, onClose, autoClose, ...props },
    ref,
  ) => {
    useEffect(() => {
      if (!autoClose || !onClose) return;
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }, [autoClose, onClose]);

    const resolvedVariant = variant ?? 'info';

    const iconClass =
      resolvedVariant === 'success'
        ? 'mt-0.5 shrink-0 text-success-600'
        : resolvedVariant === 'warning'
          ? 'mt-0.5 shrink-0 text-warning-600'
          : resolvedVariant === 'error'
            ? 'mt-0.5 shrink-0 text-error-600'
            : 'mt-0.5 shrink-0 text-primary-600';

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        {/* Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={iconClass}
        >
          {resolvedVariant === 'success' && (
            <>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </>
          )}
          {resolvedVariant === 'warning' && (
            <>
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </>
          )}
          {resolvedVariant === 'error' && (
            <>
              <circle cx="12" cy="12" r="10" />
              <line x1="15" x2="9" y1="9" y2="15" />
              <line x1="9" x2="15" y1="9" y2="15" />
            </>
          )}
          {resolvedVariant === 'info' && (
            <>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </>
          )}
        </svg>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold leading-snug">{title}</p>
          {description && (
            <p className="mt-0.5 text-sm opacity-80">{description}</p>
          )}
        </div>

        {/* Close button */}
        {onClose && (
          <button
            type="button"
            aria-label="Close notification"
            onClick={onClose}
            className="ml-auto shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

Toast.displayName = 'Toast';

export { toastVariants };
