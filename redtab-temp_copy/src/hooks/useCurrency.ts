/**
 * Custom hook to fetch currency detail by code from the Currency API.
 * Uses react-query with stale cache for performance.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import {
  DEFAULT_GLOBAL_CURRENCY,
  DEFAULT_GLOBAL_CURRENCY_SYMBOL,
} from '@/constants/currency';

export interface CurrencyDetail {
  code: string;
  symbol: string;
  exchangeRate: number;
  decimalPlaces: number;
}

export interface CurrencyInfo {
  /** ISO 4217 currency code (e.g., 'USD', 'NPR') */
  currency: string;
  /** Currency symbol (e.g., '$', 'रू') */
  symbol: string;
  /** Exchange rate: 1 USD = X this currency */
  exchangeRate: number;
  /** Decimal places for formatting */
  decimalPlaces: number;
  /** Whether in global/HQ view (no market segment selected) */
  isGlobal: boolean;
  /** Whether currency data is loading */
  isLoading: boolean;
}

/**
 * Fetch a single currency by code with stale cache.
 *
 * @example
 * ```tsx
 * const { data: npr } = useCurrencyByCode('NPR');
 * console.log(npr?.symbol); // 'रू'
 * console.log(npr?.exchangeRate); // 132.5
 * ```
 */
export function useCurrencyByCode(code: string | undefined) {
  return useQuery({
    queryKey: ['currency', code],
    queryFn: () => apiClient.get<CurrencyDetail>(`/currencies/${code}`),
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}



/**
 * Hook to get current currency info based on market segment context.
 * Fetches currency detail from API (cached) instead of relying on segment data.
 *
 * @example
 * ```tsx
 * const { currency, symbol, exchangeRate, isGlobal } = useCurrency();
 * ```
 */
export function useCurrency(): CurrencyInfo {
  const { selectedSegment, isGlobalView } = useMarketSegment();

  const currencyCode = isGlobalView
    ? DEFAULT_GLOBAL_CURRENCY
    : selectedSegment?.currency || DEFAULT_GLOBAL_CURRENCY;

  const { data, isLoading } = useCurrencyByCode(currencyCode);

  return useMemo(() => ({
    currency: data?.code || currencyCode,
    symbol: data?.symbol || (isGlobalView ? DEFAULT_GLOBAL_CURRENCY_SYMBOL : selectedSegment?.currencySymbol || DEFAULT_GLOBAL_CURRENCY_SYMBOL),
    exchangeRate: data?.exchangeRate ?? 1,
    decimalPlaces: data?.decimalPlaces ?? 2,
    isGlobal: isGlobalView,
    isLoading,
  }), [data, currencyCode, isGlobalView, selectedSegment?.currencySymbol, isLoading]);
}
