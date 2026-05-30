import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface AuthHeroPanelProps {
  logo?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  content?: ReactNode;
  className?: string;
}

export const AuthHeroPanel = forwardRef<HTMLDivElement, AuthHeroPanelProps>(
  ({ logo, title, subtitle, content, className }, ref) => (
    <div ref={ref} className={cn('flex flex-col justify-between relative overflow-hidden', className)}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neutral-0 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neutral-0 rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10">
        {/* Logo */}
        {logo && <div className="mb-8 sm:mb-12">{logo}</div>}

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">
          {title && <div className="text-3xl sm:text-4xl font-bold text-neutral-0 leading-tight">{title}</div>}
          {subtitle && <div className="text-base sm:text-lg text-neutral-100">{subtitle}</div>}
          {content && <div className="pt-4 sm:pt-8">{content}</div>}
        </div>
      </div>

      <div className="relative z-10 text-neutral-100 text-sm" />
    </div>
  ),
);

AuthHeroPanel.displayName = 'AuthHeroPanel';
