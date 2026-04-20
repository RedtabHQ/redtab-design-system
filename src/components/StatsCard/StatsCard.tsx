import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type TrendDirection = 'up' | 'down' | 'neutral';
type StatsColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
type StatsVariant = 'default' | 'compact' | 'kpi';

const colorMap: Record<StatsColor, { bg: string; text: string; icon: string; progress: string }> = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-600', icon: 'text-primary-500', progress: 'bg-primary-500' },
  success: { bg: 'bg-success-50', text: 'text-success-700', icon: 'text-success-500', progress: 'bg-success-500' },
  error:   { bg: 'bg-error-50',   text: 'text-error-700',   icon: 'text-error-500',   progress: 'bg-error-500' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-700', icon: 'text-warning-500', progress: 'bg-warning-500' },
  info:    { bg: 'bg-info-50',    text: 'text-info-700',    icon: 'text-info-500',    progress: 'bg-info-500' },
  neutral: { bg: 'bg-neutral-50', text: 'text-neutral-600', icon: 'text-neutral-500', progress: 'bg-neutral-400' },
};

function TrendUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function TrendDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

export interface StatsCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  trend?: { direction: TrendDirection; value: string };
  progress?: number;
  secondaryValue?: string;
  variant?: StatsVariant;
  color?: StatsColor;
}

export function StatsCard({
  className,
  label,
  value,
  icon,
  trend,
  progress,
  secondaryValue,
  variant = 'default',
  color = 'neutral',
  ...props
}: StatsCardProps) {
  const c = colorMap[color];
  const clampedProgress = progress !== undefined ? Math.min(100, Math.max(0, progress)) : undefined;

  const trendColor = trend?.direction === 'up' ? 'text-success-700' : trend?.direction === 'down' ? 'text-error-700' : 'text-neutral-500';
  const TrendIcon = trend?.direction === 'up' ? TrendUpIcon : trend?.direction === 'down' ? TrendDownIcon : null;

  if (variant === 'kpi') {
    return (
      <div className={cn('bg-neutral-0 p-8 rounded-xl border border-neutral-200 shadow-sm hover:border-primary-200 transition-all group', className)} {...props}>
        <div className="flex justify-between items-start mb-6">
          {icon && (
            <div className={cn('p-3 rounded bg-neutral-50 transition-colors group-hover:bg-primary-500 group-hover:text-neutral-0', c.icon)}>
              {icon}
            </div>
          )}
          <div className={icon ? 'text-right' : 'w-full'}>
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest leading-none">{label}</p>
            <p className="text-2xl font-black text-neutral-900 mt-2 tracking-tight">{value}</p>
          </div>
        </div>
        {secondaryValue && (
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
            <span className="text-xs font-black text-neutral-400 uppercase tracking-tighter">{secondaryValue}</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('bg-neutral-0 p-6 rounded-lg border border-neutral-200 shadow-sm', className)} {...props}>
        <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-2">{label}</p>
        <p className={cn('text-3xl font-black', c.text)}>{value}</p>
      </div>
    );
  }

  return (
    <div className={cn('bg-neutral-0 p-6 rounded-lg border border-neutral-200 shadow-sm transition-all hover:shadow-md', className)} {...props}>
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">{label}</p>
        {icon && <div className={c.icon}>{icon}</div>}
      </div>
      <p className="text-3xl font-black text-neutral-900">{value}</p>
      {secondaryValue && <p className="text-xs font-semibold text-neutral-500 mt-1">{secondaryValue}</p>}
      {trend && (
        <div className={cn('flex items-center gap-1 text-sm font-medium mt-2', trendColor)}>
          {TrendIcon && <TrendIcon />}
          <span>{trend.value}</span>
        </div>
      )}
      {clampedProgress !== undefined && (
        <div className="h-1 w-full bg-neutral-100 rounded-full mt-3 overflow-hidden">
          <div className={cn('h-full transition-all duration-300', c.progress)} style={{ width: `${clampedProgress}%` }} />
        </div>
      )}
    </div>
  );
}
