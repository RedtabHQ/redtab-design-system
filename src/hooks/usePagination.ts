import { useMemo } from 'react';

interface UsePaginationProps {
  /** Total number of items across all pages */
  totalItems: number;
  /** Number of items per page */
  pageSize: number;
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Number of sibling pages to show on each side of current page */
  siblingCount?: number;
}

interface UsePaginationReturn {
  /** Array of page numbers with null representing ellipsis gaps */
  pages: Array<number | null>;
  /** Total number of pages */
  totalPages: number;
  /** Whether a previous page exists */
  hasPrev: boolean;
  /** Whether a next page exists */
  hasNext: boolean;
  /** Previous page number, or null if on first page */
  prevPage: number | null;
  /** Next page number, or null if on last page */
  nextPage: number | null;
}

/**
 * Calculates pagination metadata including page numbers with ellipsis gaps.
 *
 * Always includes first page, last page, current page, and siblings.
 * Gaps between ranges are represented as `null` in the pages array.
 *
 * @example
 * ```tsx
 * const { pages, hasPrev, hasNext } = usePagination({
 *   totalItems: 100,
 *   pageSize: 10,
 *   currentPage: 5,
 * });
 * // pages: [1, null, 4, 5, 6, null, 10]
 * ```
 */
export function usePagination({
  totalItems,
  pageSize,
  currentPage,
  siblingCount = 1,
}: UsePaginationProps): UsePaginationReturn {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const pages = useMemo(() => {
    const range = (start: number, end: number): number[] => {
      const length = end - start + 1;
      return Array.from({ length }, (_, i) => start + i);
    };

    // Total slots: first + last + current + 2*siblings + 2 ellipses
    const totalSlots = siblingCount * 2 + 5;

    // If total pages fit within the slots, show all pages
    if (totalPages <= totalSlots) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const hasLeftEllipsis = leftSiblingIndex > 2;
    const hasRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!hasLeftEllipsis && hasRightEllipsis) {
      // Show expanded left side: [1, 2, 3, 4, 5, ..., last]
      const leftCount = siblingCount * 2 + 3;
      const leftRange = range(1, leftCount);
      return [...leftRange, null, totalPages];
    }

    if (hasLeftEllipsis && !hasRightEllipsis) {
      // Show expanded right side: [1, ..., 6, 7, 8, 9, 10]
      const rightCount = siblingCount * 2 + 3;
      const rightRange = range(totalPages - rightCount + 1, totalPages);
      return [1, null, ...rightRange];
    }

    // Both ellipses: [1, ..., 4, 5, 6, ..., 10]
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, null, ...middleRange, null, totalPages];
  }, [totalItems, pageSize, currentPage, siblingCount, totalPages]);

  return {
    pages,
    totalPages,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
  };
}
