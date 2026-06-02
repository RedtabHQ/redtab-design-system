import { useState, useCallback, useMemo } from 'react';
import type { PaginationMeta } from '@/types';
export type { PaginationMeta } from '@/types';

interface UseTablePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  onPageChange?: (page: number) => void;
}

/**
 * Hook for managing table pagination state
 * Works with {items, meta: {total, totalPages, page}} response format
 */
export const useTablePagination = (options: UseTablePaginationOptions = {}) => {
  const {
    initialPage = 1,
    initialPageSize = 10,
    onPageChange,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      onPageChange?.(newPage);
    },
    [onPageChange]
  );

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  }, []);

  const goToFirstPage = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  const goToLastPage = useCallback((totalPages: number) => {
    handlePageChange(totalPages);
  }, [handlePageChange]);

  const goToNextPage = useCallback((totalPages: number) => {
    handlePageChange(Math.min(page + 1, totalPages));
  }, [page, handlePageChange]);

  const goToPreviousPage = useCallback(() => {
    handlePageChange(Math.max(page - 1, 1));
  }, [page, handlePageChange]);

  const getPageNumbers = useCallback((total: number): (number | string)[] => {
    const totalPages = Math.ceil(total / pageSize);
    const windowSize = 5; // Show 5 page numbers at a time
    const pages: (number | string)[] = [];

    if (totalPages <= windowSize) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfWindow = Math.floor(windowSize / 2);
      let start = Math.max(1, page - halfWindow);
      let end = Math.min(totalPages, start + windowSize - 1);

      if (end - start < windowSize - 1) {
        start = Math.max(1, end - windowSize + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [page, pageSize]);

  return {
    page,
    pageSize,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    getPageNumbers,
  };
};

/**
 * Utility function to validate pagination meta
 */
export const isValidPaginationMeta = (meta: unknown): meta is PaginationMeta => {
  if (!meta || typeof meta !== 'object') return false;
  const m = meta as Record<string, unknown>;
  return (
    typeof m.total === 'number' &&
    typeof m.totalPages === 'number' &&
    typeof m.page === 'number' &&
    m.total >= 0 &&
    m.totalPages >= 0 &&
    m.page > 0
  );
};
