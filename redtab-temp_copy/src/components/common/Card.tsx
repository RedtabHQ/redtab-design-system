import React from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'surface';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(
    (
      {
        title,
        subtitle,
        children,
        footer,
        className = '',
        variant = 'default',
        padding = 'md',
        ...props
      },
      ref
    ) => {
      // Surface variant: simple div with styling, no title/footer/subtitle
      if (variant === 'surface') {
        return (
          <div
            ref={ref}
            className={cn(
              'bg-white rounded-xl border border-gray-100 shadow-sm',
              paddingClasses[padding],
              className
            )}
            {...props}
          >
            {children}
          </div>
        );
      }

      // Default variant: original Card behavior
      return (
        <div ref={ref} className={`card ${className}`} {...props}>
          {(title || subtitle) && (
            <div className="mb-4 pb-4 border-b border-gray-100">
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
          )}

          <div className="space-y-4">{children}</div>
          {footer && <div className="mt-6 pt-4 border-t border-gray-100">{footer}</div>}
        </div>
      );
    }
  )
);

Card.displayName = 'Card';