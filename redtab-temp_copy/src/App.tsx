// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import { migrateStorageKeys } from './utils/storage-migration';
import { setupGlobalErrorHandling } from './lib/setupGlobalErrorHandling';
import './lib/i18n';
import { MarketSegmentProvider } from './contexts/MarketSegmentContext';
import { ExchangeRateProvider } from './contexts/ExchangeRateContext';
import { ForecastProvider } from './contexts/ForecastContext';
import { TimezoneProvider } from './contexts/TimezoneContext';
import { ToastProvider } from '@/components/common';
import { ErrorBoundary } from '@/components/error';
import { AppRoutes } from '@/routes';

const App: React.FC = () => {
  useEffect(() => {
    setupGlobalErrorHandling();
    migrateStorageKeys();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ToastProvider>
          <TimezoneProvider>
          <MarketSegmentProvider>
            <ForecastProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ForecastProvider>
          </MarketSegmentProvider>
          </TimezoneProvider>
        </ToastProvider>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
