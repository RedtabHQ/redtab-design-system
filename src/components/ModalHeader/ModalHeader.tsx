import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface ModalHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ title, subtitle, actions, className }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between p-6 border-b border-neutral-200', className)}>
      <div className="space-y-1">
        {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
        {subtitle && <p className="text-sm text-neutral-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  ),
);

ModalHeader.displayName = 'ModalHeader';

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-end gap-3 p-6 border-t border-neutral-200', className)}>
      {children}
    </div>
  ),
);

ModalFooter.displayName = 'ModalFooter';
