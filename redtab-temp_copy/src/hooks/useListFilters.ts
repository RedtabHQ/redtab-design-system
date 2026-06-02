import { useState, useCallback } from 'react';

/**
 * Generic hook for managing list view filters with internal state only
 * Does NOT sync to URL query parameters
 * State is reset when the component unmounts
 */
export const useListFilters = <TStatus extends string = string>(options?: {
  defaultPageSize?: number;
  defaultStatus?: TStatus;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(options?.defaultPageSize ?? 5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TStatus | undefined>(options?.defaultStatus);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to page 1 on search
  }, []);

  const handleStatusFilterChange = useCallback((status?: string) => {
    const newStatus = status && status !== 'ALL' ? (status as TStatus) : undefined;
    setStatusFilter(newStatus);
    setCurrentPage(1); // Reset to page 1 on status filter change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to page 1 when page size changes
  }, []);

  const clearFilters = useCallback(() => {
    setCurrentPage(1);
    setPageSize(options?.defaultPageSize ?? 5);
    setSearchTerm('');
    setStatusFilter(options?.defaultStatus);
  }, [options?.defaultPageSize, options?.defaultStatus]);

  return {
    currentPage,
    pageSize,
    searchTerm,
    statusFilter,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handlePageSizeChange,
    clearFilters,
  };
};
