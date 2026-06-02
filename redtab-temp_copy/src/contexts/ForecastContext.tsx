import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getLiquidityForecast, AiInsightResult } from '@/lib/geminiService';
import { Transaction } from '@/types';

interface ForecastContextType {
  isForecastMode: boolean;
  isForecasting: boolean;
  aiForecast: string | null;
  forecastError: Error | null;
  selectedSegmentId: string | undefined;
  generatedAt: string | null;
  cached: boolean;
  handleRunForecast: (transactions: Transaction[], segmentId?: string, forceRefresh?: boolean) => void;
  resetForecast: () => void;
}

const ForecastContext = createContext<ForecastContextType | undefined>(undefined);

interface ForecastProviderProps {
  children: ReactNode;
}

export function ForecastProvider({ children }: ForecastProviderProps) {
  const [isForecastMode, setIsForecastMode] = useState(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | undefined>(undefined);
  const { i18n } = useTranslation();

  const forecastMutation = useMutation<AiInsightResult, Error, { txHistory: Array<{ id: string; amount: number; type: string; createdAt: string }>; activeContracts: Array<{ id: string; totalAmount: number; dueDate: string }>; forceRefresh?: boolean }>({
    mutationFn: async (payload) => {
      return getLiquidityForecast(
        payload.txHistory,
        payload.activeContracts,
        i18n.language || 'en',
        payload.forceRefresh,
      );
    },
    onSuccess: () => {
      setIsForecastMode(true);
    },
  });

  const handleRunForecast = useCallback((
    transactions: Transaction[],
    segmentId?: string,
    forceRefresh?: boolean,
  ) => {
    if (segmentId) {
      setSelectedSegmentId(segmentId);
    }

    const txHistory = transactions.map(t => ({
      id: t.id,
      amount: t.amount,
      type: t.type,
      createdAt: t.timestamp,
    }));

    forecastMutation.mutate({ txHistory, activeContracts: [], forceRefresh });
  }, [forecastMutation]);

  const resetForecast = useCallback(() => {
    setIsForecastMode(false);
    setSelectedSegmentId(undefined);
    forecastMutation.reset();
  }, [forecastMutation]);

  const contextValue = useMemo(
    () => ({
      isForecastMode,
      isForecasting: forecastMutation.isPending,
      aiForecast: forecastMutation.data?.content ?? null,
      forecastError: forecastMutation.error,
      selectedSegmentId,
      generatedAt: forecastMutation.data?.generatedAt ?? null,
      cached: forecastMutation.data?.cached ?? false,
      handleRunForecast,
      resetForecast,
    }),
    [isForecastMode, forecastMutation.isPending, forecastMutation.data, forecastMutation.error, selectedSegmentId, handleRunForecast, resetForecast]
  );

  return (
    <ForecastContext.Provider value={contextValue}>
      {children}
    </ForecastContext.Provider>
  );
}

export function useForecastContext() {
  const context = useContext(ForecastContext);
  if (context === undefined) {
    throw new Error('useForecastContext must be used within a ForecastProvider');
  }
  return context;
}
