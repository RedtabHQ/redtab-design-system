import React, { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import { WarningTriangleIcon } from '@/components/icons';
import { useActiveMarketSegments } from '@hooks/useMarketSegments';
import { useLocalStorage } from '../utils/useLocalStorage';
import { DEFAULT_GLOBAL_CURRENCY, DEFAULT_GLOBAL_CURRENCY_SYMBOL } from '@/constants/currency';
import type { MarketSegment } from '@/types';

interface MarketSegmentContextType {
  selectedSegment: MarketSegment | null;
  setSelectedSegment: (segment: MarketSegment | null) => void;
  availableSegments: MarketSegment[];
  isLoading: boolean;
  isGlobalView: boolean;
  segmentId: string | undefined;
  defaultCurrency: string;
  defaultCurrencySymbol: string;
}

const MarketSegmentContext = createContext<MarketSegmentContextType | undefined>(undefined);

const STORAGE_KEY = 'rpl_selected_market_segment';

interface MarketSegmentProviderProps {
  children: ReactNode;
}

export function MarketSegmentProvider({ children }: MarketSegmentProviderProps) {
  const [selectedSegmentId, setSelectedSegmentId, removeSelectedSegmentId] = useLocalStorage<string | null>(
    STORAGE_KEY,
    null
  );

  // Only fetch market segments if user is authenticated
  const isAuthenticated = !!(localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'));
  const { data: availableSegments = [], isLoading, error } = useActiveMarketSegments({
    enabled: isAuthenticated, // Only fetch when authenticated
    retry: 2, // Retry up to 2 times on failure (helps with transient auth errors)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Handle API error gracefully
  useEffect(() => {
    if (error) {
      console.error('Failed to load market segments:', error);
      // Log detailed error info for debugging
      if (error instanceof Error) {
        const apiError = error as Error & { status?: number };
        if (apiError.status === 401) {
          console.warn('[MarketSegment] Authentication error - user may need to re-authenticate');
        } else if (apiError.status === 403) {
          console.warn('[MarketSegment] Authorization error - user lacks permission');
        }
      }
    }
  }, [error]);

  // Find the actual segment object from the ID
  const selectedSegment = useMemo(() => {
    if (!selectedSegmentId || availableSegments.length === 0) return null;
    return availableSegments.find((s) => s.id === selectedSegmentId) || null;
  }, [selectedSegmentId, availableSegments]);

  // Clear invalid segment ID if it no longer exists in available segments
  useEffect(() => {
    if (selectedSegmentId && availableSegments.length > 0 && !selectedSegment) {
      removeSelectedSegmentId();
    }
  }, [selectedSegmentId, availableSegments, selectedSegment, removeSelectedSegmentId]);

  // Memoize setSelectedSegment to prevent re-creates
  const setSelectedSegment = useMemo(() => 
    (segment: MarketSegment | null) => {
      if (segment) {
        setSelectedSegmentId(segment.id);
      } else {
        removeSelectedSegmentId();
      }
    },
    [setSelectedSegmentId, removeSelectedSegmentId]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      selectedSegment,
      setSelectedSegment,
      availableSegments,
      isLoading,
      isGlobalView: selectedSegment === null,
      segmentId: selectedSegment?.id,
      defaultCurrency: DEFAULT_GLOBAL_CURRENCY,
      defaultCurrencySymbol: DEFAULT_GLOBAL_CURRENCY_SYMBOL,
    }),
    [selectedSegment, setSelectedSegment, availableSegments, isLoading]
  );

  // Show error state if segments fail to load AND no segments cached
  if (error && availableSegments.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WarningTriangleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to Load Market Segments
          </h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Unable to connect to the server'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <MarketSegmentContext.Provider value={contextValue}>
      {children}
    </MarketSegmentContext.Provider>
  );
}

/**
 * Hook to access market segment context
 *
 * @example
 * ```typescript
 * const { selectedSegment, setSelectedSegment, isGlobalView } = useMarketSegment();
 * ```
 */
export function useMarketSegment() {
  const context = useContext(MarketSegmentContext);
  if (context === undefined) {
    throw new Error('useMarketSegment must be used within a MarketSegmentProvider');
  }
  return context;
}


export function useCurrentMarketSegment() {
  const { selectedSegment, isGlobalView } = useMarketSegment();
  return isGlobalView ? undefined : selectedSegment?.name;
}

export function useIsGlobalMarketView() {
  const { isGlobalView } = useMarketSegment();
  return isGlobalView;
}