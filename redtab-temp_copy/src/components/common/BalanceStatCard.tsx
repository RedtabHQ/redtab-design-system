import React from 'react';
import { cn } from '@/lib/utils';
import { Amount } from './Amount';

export interface BalanceStatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'value'> {
  title: React.ReactNode;
  value: number;
  currencyCode?: string;
  indicator?: React.ReactNode;
  description?: React.ReactNode;
  titleClassName?: string;
  valueClassName?: string;
}

export const BalanceStatCard = React.memo(React.forwardRef<HTMLDivElement, BalanceStatCardProps>(
  (
    {
      title,
      value,
      indicator,
      currencyCode,
      description,
      titleClassName,
      valueClassName,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('rounded border border-gray-100 p-4', className)}
        {...rest}
      >
        <div className="flex items-center justify-between gap-3">
          <div
            className={cn(
              'text-xs font-black uppercase tracking-[0.3em] text-gray-400',
              titleClassName
            )}
          >
            {title}
          </div>
          {indicator && <div className="shrink-0">{indicator}</div>}
        </div>
        
        <Amount value={value} currency={currencyCode}
          mainClassName={cn('mt-3 text-3xl font-black text-gray-900', valueClassName)}
          subClassName="text-xs text-gray-500 mt-0.5" showUSD />

        {description ? <p className="text-xs text-gray-500 mt-1">{description}</p> : null}
        {children}
      </div>
    );
  }
));

BalanceStatCard.displayName = 'BalanceStatCard';
