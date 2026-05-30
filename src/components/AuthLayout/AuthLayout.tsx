import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface AuthLayoutProps {
  leftPanel?: ReactNode;
  rightPanel: ReactNode;
  className?: string;
  hideLeftOnMobile?: boolean;
}

export const AuthLayout = forwardRef<HTMLDivElement, AuthLayoutProps>(
  ({ leftPanel, rightPanel, className, hideLeftOnMobile = true }, ref) => (
    <div ref={ref} className={cn('min-h-screen flex bg-neutral-50', className)}>
      {leftPanel && (
        <div className={cn('flex-1 bg-primary-600 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden', hideLeftOnMobile && 'hidden lg:flex')}>
          {leftPanel}
        </div>
      )}

      <div className={cn('flex-1 flex items-center justify-center p-4 sm:p-8', !leftPanel && 'w-full')}>
        {rightPanel}
      </div>
    </div>
  ),
);

AuthLayout.displayName = 'AuthLayout';
