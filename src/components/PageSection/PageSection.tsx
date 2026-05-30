import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface PageSectionProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PageSection = forwardRef<HTMLDivElement, PageSectionProps>(
  ({ children, spacing = 'md', className }, ref) => {
    const spacingClasses = {
      sm: 'space-y-4',
      md: 'space-y-6',
      lg: 'space-y-8',
      xl: 'space-y-12',
    };

    return (
      <div ref={ref} className={cn(spacingClasses[spacing], className)}>
        {children}
      </div>
    );
  },
);

PageSection.displayName = 'PageSection';
