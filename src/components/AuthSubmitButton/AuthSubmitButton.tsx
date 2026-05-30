import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface AuthSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const AuthSubmitButton = forwardRef<HTMLButtonElement, AuthSubmitButtonProps>(
  ({ className, isLoading, loadingText = 'Processing...', disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      type="submit"
      disabled={disabled || isLoading}
      className={cn(
        'w-full bg-primary-600 text-neutral-0 py-3.5 rounded-lg font-semibold text-sm',
        'hover:bg-primary-700 active:scale-[0.98] transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        'shadow-lg shadow-primary-500/20',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  ),
);

AuthSubmitButton.displayName = 'AuthSubmitButton';
