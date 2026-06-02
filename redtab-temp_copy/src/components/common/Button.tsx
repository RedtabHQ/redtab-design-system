import { cn } from '@/lib/utils';
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'cursor-pointer font-bold bg-redtab text-white hover:bg-redtab-dark active:scale-95',
  secondary: 'cursor-pointer font-bold bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95',
  ghost: 'cursor-pointer font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  danger: 'cursor-pointer font-bold bg-red-500 text-white hover:bg-red-600 active:scale-95',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-6 py-1 text-xs',
  md: 'px-8 py-2.5 text-xs',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className = '',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn('btn',
          variantClasses[variant],
          sizeClasses[size],
          disabled || isLoading ? 'opacity-50 cursor-not-allowed active:scale-100' : '',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block animate-spin">⟳</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';