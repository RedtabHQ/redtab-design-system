import React, { createContext, useContext, useMemo, useCallback, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

type RateMap = Map<string, number>;

interface ExchangeRateContextType {
  /** Get exchange rate for a currency to USD. Returns null if not found. */
  getRate: (currency: string) => number | null;
  /** Convert an amount from a given currency to USD */
  toUsd: (amount: number | null | undefined, currency: string) => number | null;
  /** Whether exchange rates are still loading */
  isLoading: boolean;
}

const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);

interface ExchangeRateProviderProps {
  children: ReactNode;
}

export function ExchangeRateProvider({ children }: ExchangeRateProviderProps) {
  const isAuthenticated = !!(
    localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
  );

  const { data: rates, isLoading } = useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async () => {
      return apiClient.get<Record<string, number>>('/currencies/exchange-rates');
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    retry: 2,
  });

  const rateMap: RateMap = useMemo(() => {
    const map = new Map<string, number>();
    map.set('USD', 1);
    if (rates) {
      for (const [currency, rate] of Object.entries(rates)) {
        if (Number.isFinite(rate) && rate > 0) {
          map.set(currency, rate);
        }
      }
    }
    return map;
  }, [rates]);

  const getRate = useCallback(
    (currency: string): number | null => {
      if (!currency) return null;
      return rateMap.get(currency) ?? null;
    },
    [rateMap],
  );

  const toUsd = useCallback(
    (amount: number | null | undefined, currency: string): number | null => {
      if (amount === null || amount === undefined || !Number.isFinite(amount)) {
        return null;
      }
      if (currency === 'USD') {
        return Number(amount.toFixed(2));
      }
      const rate = rateMap.get(currency);
      if (!rate || !Number.isFinite(rate)) {
        return null;
      }

      return Number((amount / rate).toFixed(2));
    },
    [rateMap],
  );

  const contextValue = useMemo(
    () => ({ getRate, toUsd, isLoading }),
    [getRate, toUsd, isLoading],
  );

  return (
    <ExchangeRateContext.Provider value={contextValue}>
      {children}
    </ExchangeRateContext.Provider>
  );
}

export function useExchangeRateContext() {
  const context = useContext(ExchangeRateContext);
  if (context === undefined) {
    throw new Error('useExchangeRateContext must be used within an ExchangeRateProvider');
  }
  return context;
}

export function useExchangeRate(currency: string) {
  const { getRate, toUsd: toUsdFull } = useExchangeRateContext();

  const rate = useMemo(() => getRate(currency), [getRate, currency]);

  const toUsd = useCallback(
    (amount: number | null | undefined): number | null => {
      return toUsdFull(amount, currency);
    },
    [toUsdFull, currency],
  );

  return { rate, toUsd };
}
