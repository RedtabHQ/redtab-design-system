import { useState } from 'react';
import { useSuppliers, SupplierListParams } from '@/features/suppliers/hooks';
import type { Supplier } from '@types';

export interface UseSupplierDirectoryOptions {
  pageSize?: number;
  initialSearch?: string;
  initialPage?: number;
  marketSegmentId?: string;
}

export interface UseSupplierDirectoryReturn {
  // Data
  suppliers: Supplier[];

  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  total: number;

  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Filters
  searchTerm: string;

  // Actions
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

/**
 * Hook to manage supplier directory with server-side pagination and filtering
 * Delegates pagination to the API, follows standard codebase patterns
 * Supports URL query string synchronization through initialPage and initialSearch options
 */
export const useSupplierDirectory = (
  options: UseSupplierDirectoryOptions = {}
): UseSupplierDirectoryReturn => {
  const { pageSize: initialPageSize = 5, initialSearch = '', initialPage = 1, marketSegmentId } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Fetch suppliers from API with server-side pagination
  const queryParams: SupplierListParams = {
    page: currentPage,
    pageSize,
    search: searchTerm,
    marketSegmentId,
  };

  const { data, isLoading, isError, error } = useSuppliers(queryParams);

  // Extract data from paginated response
  // Type guard: ensure we have the expected response structure
  const suppliers = (data?.items && Array.isArray(data.items)) ? data.items : [];
  const total = (typeof data?.meta?.total === 'number') ? data.meta.total : 0;
  const totalPages = (typeof data?.meta?.totalPages === 'number') ? data.meta.totalPages : 0;

  // Reset to page 1 when search changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return {
    suppliers,
    currentPage,
    pageSize,
    totalPages,
    total,
    isLoading,
    isError,
    error: error as Error | null,
    searchTerm,
    setSearchTerm: handleSearchChange,
    setCurrentPage,
    setPageSize,
  };
};