import { useState, useMemo } from 'react';
import type { PaginationMeta } from '@/types';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

interface UseListPaginationResult<T> {
  paginatedItems: T[];
  paginationMeta: PaginationMeta;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetToFirstPage: () => void;
}

/**
 * Hook for managing client-side pagination of an array of items.
 * Handles page calculation, slicing, and state management.
 *
 * @template T - The type of items being paginated
 * @param items - Array of items to paginate
 * @param options - Configuration options with initialPage and initialPageSize
 * @returns Object with paginatedItems, paginationMeta, and handler functions
 *
 * @example
 * const { paginatedItems, paginationMeta, setPage, setPageSize } = useListPagination(items, { initialPageSize: 12 });
 */
export const useListPagination = <T,>(
  items: T[],
  options: UsePaginationOptions = {}
): UseListPaginationResult<T> => {
  const { initialPage = 1, initialPageSize = 10 } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const { paginatedItems, paginationMeta } = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Clamp current page to valid range
    const validPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));

    const startIndex = (validPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = items.slice(startIndex, endIndex);

    const meta: PaginationMeta = {
      page: validPage,
      pageSize,
      total: totalItems,
      totalPages,
    };

    return { paginatedItems: paginated, paginationMeta: meta };
  }, [items, currentPage, pageSize]);

  return {
    paginatedItems,
    paginationMeta,
    setPage: setCurrentPage,
    setPageSize: (newPageSize: number) => {
      setPageSize(newPageSize);
      setCurrentPage(1); // Reset to first page when page size changes
    },
    resetToFirstPage: () => setCurrentPage(1),
  };
};
