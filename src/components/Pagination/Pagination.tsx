import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const paginationItemVariants = cva(
  'inline-flex items-center justify-center rounded border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      size: {
        sm: 'h-7 min-w-7 px-2',
        md: 'h-9 min-w-9 px-2.5',
        lg: 'h-10 min-w-10 px-3',
      },
      active: {
        true: 'border-primary-600 bg-primary-600 text-white hover:bg-primary-700',
        false: 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300',
      },
    },
    defaultVariants: {
      size: 'md',
      active: false,
    },
  },
);

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange'>,
    VariantProps<typeof paginationItemVariants> {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when the user navigates to a new page */
  onPageChange: (page: number) => void;
  /** Number of page buttons shown around the current page */
  siblingCount?: number;
  /** Whether to show first/last page buttons */
  showEdges?: boolean;
}

function buildPageRange(
  current: number,
  total: number,
  siblings: number,
): (number | 'ellipsis')[] {
  const totalShown = siblings * 2 + 5; // siblings on each side + current + 2 edges + up to 2 ellipsis

  if (total <= totalShown) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblings, 2);
  const rightSibling = Math.min(current + siblings, total - 1);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  const pages: (number | 'ellipsis')[] = [1];

  if (showLeftEllipsis) {
    pages.push('ellipsis');
  } else {
    for (let i = 2; i < leftSibling; i++) {
      pages.push(i);
    }
  }

  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push('ellipsis');
  } else {
    for (let i = rightSibling + 1; i < total; i++) {
      pages.push(i);
    }
  }

  pages.push(total);
  return pages;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      size = 'md',
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showEdges = false,
      ...props
    },
    ref,
  ) => {
    if (totalPages <= 1) return null;

    const pages = buildPageRange(currentPage, totalPages, siblingCount);
    const canPrev = currentPage > 1;
    const canNext = currentPage < totalPages;

    const itemCls = (active: boolean): string =>
      paginationItemVariants({ size, active });

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={cn('flex items-center gap-1', className)}
        {...props}
      >
        {/* First page */}
        {showEdges && (
          <button
            type="button"
            aria-label="First page"
            disabled={!canPrev}
            onClick={() => { onPageChange(1); }}
            className={itemCls(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
        )}

        {/* Previous */}
        <button
          type="button"
          aria-label="Previous page"
          disabled={!canPrev}
          onClick={() => { onPageChange(currentPage - 1); }}
          className={itemCls(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Page numbers */}
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="inline-flex items-center justify-center text-neutral-400 select-none px-1"
              >
                &hellip;
              </span>
            );
          }
          return (
            <button
              key={page}
              type="button"
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => { onPageChange(page); }}
              className={itemCls(page === currentPage)}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          type="button"
          aria-label="Next page"
          disabled={!canNext}
          onClick={() => { onPageChange(currentPage + 1); }}
          className={itemCls(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Last page */}
        {showEdges && (
          <button
            type="button"
            aria-label="Last page"
            disabled={!canNext}
            onClick={() => { onPageChange(totalPages); }}
            className={itemCls(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </button>
        )}
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';

export { paginationItemVariants };
