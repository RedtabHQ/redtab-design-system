import { useState, useCallback } from 'react';

export interface FilterState {
  [key: string]: string | undefined;
}

interface UseFilterStateOptions {
  initialState?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
}

/**
 * Hook for managing filter state in a standardized way
 * Reduces boilerplate when managing multiple filter fields
 */
export const useFilterState = (options: UseFilterStateOptions = {}) => {
  const { initialState = {}, onFiltersChange } = options;
  const [filters, setFilters] = useState<FilterState>(initialState);

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };
        onFiltersChange?.(newFilters);
        return newFilters;
      });
    },
    [onFiltersChange]
  );

  const clearFilters = useCallback(() => {
    setFilters({});
    onFiltersChange?.({});
  }, [onFiltersChange]);

  const getActiveFilterCount = useCallback(() => {
    return Object.values(filters).filter((v) => v !== undefined && v !== '').length;
  }, [filters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    getActiveFilterCount,
  };
};
