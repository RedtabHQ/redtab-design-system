import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { PaginationMeta } from '../../types';

export type { PaginationMeta };

export interface PaginationProps {
  meta: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  itemsTitle?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
  onPageSizeChange,
  showPageSize = true,
  pageSizeOptions = [5, 10, 20, 30, 50, 100],
  itemsTitle = 'items',
}) => {
  const { page, pageSize, total, totalPages } = meta;

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const handleFirst = () => {
    if (canGoPrevious) {
      onPageChange?.(1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange?.(page - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange?.(page + 1);
    }
  };

  const handleLast = () => {
    if (canGoNext) {
      onPageChange?.(totalPages);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    onPageSizeChange?.(newPageSize);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and pages around current
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      pages.push(1);

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate showing range
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  if (total === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
      {/* Results info and page size selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-700">
        <p className="text-sm text-gray-500">
          Showing <span className="font-bold">{startItem}</span> to{' '}
          <span className="font-bold">{endItem}</span> of{' '}
          <span className="font-bold">{total}</span> {itemsTitle}
        </p>

        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-gray-700">
              Per page:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="input w-20"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {meta.totalPages <= 1 ? null : (
        <div className="flex items-center gap-1">
          {/* First page */}
          <button
            onClick={handleFirst}
            disabled={!canGoPrevious}
            title="First page"
            className="px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          {/* Previous page */}
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            title="Previous page"
            className="px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers.map((pageNum, idx) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-500">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum as number)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg cursor-pointer ${
                    page === pageNum
                      ? 'bg-redtab text-white'
                      : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Mobile: Show current page */}
          <div className="sm:hidden flex items-center gap-2 px-3 py-1 text-sm text-gray-700">
            <span>
              Page {page} of {totalPages}
            </span>
          </div>

          {/* Next page */}
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            title="Next page"
            className="px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Last page */}
          <button
            onClick={handleLast}
            disabled={!canGoNext}
            title="Last page"
            className="px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
