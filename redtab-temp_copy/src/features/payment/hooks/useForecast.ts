import { useCallback } from 'react';
import { useForecastContext } from '@/contexts/ForecastContext';
import { Transaction } from '@/types';

/**
 * Hook to manage forecast execution
 * Wraps ForecastContext for convenient API
 *
 * @param transactions - Array of transactions to forecast on
 * @param segmentId - Optional segment ID for context
 * @returns Forecast state and methods
 *
 * @example
 * ```typescript
 * const { isForecastMode, isForecasting, handleRunForecast } = useForecast(transactions, segmentId);
 * ```
 */
export const useForecast = (transactions: Transaction[], segmentId?: string) => {
  const { isForecastMode, isForecasting, aiForecast, handleRunForecast: contextForecast } = useForecastContext();

  const handleRunForecast = useCallback(() => {
    contextForecast(transactions, segmentId);
  }, [transactions, segmentId, contextForecast]);

  return {
    isForecastMode,
    isForecasting,
    aiForecast,
    handleRunForecast,
  };
};
