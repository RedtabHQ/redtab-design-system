import { useState, useCallback, useEffect } from 'react';

/**
 * Custom React hooks
 *
 * This module exports all custom GLOBAL hooks for the application.
 * Feature-specific hooks are located in their respective feature directories.
 */

// Market Segment hooks (global)
export {
  useMarketSegments,
  useCreateMarketSegment,
  useUpdateMarketSegment,
  useDeleteMarketSegment,
  useActiveMarketSegments,
  marketSegmentKeys,
} from './useMarketSegments';

// Transaction hooks (global)
export {
  useTransactions,
  useTransaction,
  useCreateTransaction,
  useUpdateTransaction,
  usePatchTransaction,
  useDeleteTransaction,
  useBulkDeleteTransactions,
  transactionKeys,
  type TransactionListParams,
} from './useTransactions';

// Filter state hook (global)
export { useFilterState, type FilterState } from './useFilterState';

// Pagination hooks (global)
export { useTablePagination, isValidPaginationMeta, type PaginationMeta } from './useTablePagination';
export { useListPagination } from './usePagination';

// Multi-step form hook (global)
export { useMultiStepForm } from './useMultiStepForm';

// UI/DOM hooks
export { useClickOutside } from './useClickOutside';

// Currency hook
export { useCurrency, type CurrencyInfo } from './useCurrency';

// Toast hook
export { useToast, type Toast, type ToastType } from './useToast';

// Utility hooks below

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (valueOrUpdater: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          typeof valueOrUpdater === 'function'
            ? (valueOrUpdater as (val: T) => T)(value)
            : valueOrUpdater;
        setValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error(err);
      }
    },
    [key, value]
  );

  return [value, setStoredValue] as const;
}

export function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function usePagination(total: number, pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    totalPages,
    goToPage: (p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
  };
}
