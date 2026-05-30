import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface PageLayoutProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ header, sidebar, content, footer, className }, ref) => (
    <div ref={ref} className={cn('flex min-h-screen', className)}>
      {sidebar}
      <div className="flex-1 flex flex-col">
        {header}
        <main className="p-4 sm:p-8 pb-20 overflow-x-hidden">
          {content}
        </main>
        {footer}
      </div>
    </div>
  ),
);

PageLayout.displayName = 'PageLayout';
