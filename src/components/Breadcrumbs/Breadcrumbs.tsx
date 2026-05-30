import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  ariaLabel?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, separator = '/', className }, ref) => (
    <nav ref={ref} aria-label="Breadcrumb" className={cn('text-sm text-neutral-500', className)}>
      <ol className="inline-flex items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {item.href ? (
              <a
                href={item.href}
                aria-label={item.ariaLabel}
                className="text-neutral-700 transition-colors hover:text-neutral-900"
              >
                {item.label}
              </a>
            ) : (
              <span className="font-medium text-neutral-900">{item.label}</span>
            )}
            {index < items.length - 1 && <span className="text-neutral-400">{separator}</span>}
          </li>
        ))}
      </ol>
    </nav>
  ),
);

Breadcrumbs.displayName = 'Breadcrumbs';
