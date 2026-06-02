import React from 'react';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import type { TransactionListParams } from '@/hooks/useTransactions';

/**
 * Hook to build KPI filters scoped to the current market segment
 * Returns filters with marketSegmentId when in segment-specific view
 */
export const useSegmentKPIFilters = (searchTerm?: string) => {
  const { selectedSegment, isGlobalView } = useMarketSegment();

  return React.useMemo(() => ({
    search: searchTerm,
    marketSegmentId: !isGlobalView && selectedSegment?.id ? selectedSegment.id : undefined,
  }), [searchTerm, selectedSegment, isGlobalView]) as Omit<TransactionListParams, 'page' | 'pageSize' | 'type'> & { marketSegmentId?: string };
};
