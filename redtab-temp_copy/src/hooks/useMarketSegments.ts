import { createResourceHooks } from './createResourceHooks';
import { marketSegmentService } from '@/lib/apiService';
import { apiClient } from '@/lib/api';
import type { MarketSegment } from '@types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PaginatedResponse } from '@/types';

const marketSegmentHooks = createResourceHooks<MarketSegment>('market-segments', marketSegmentService);

// Export standard CRUD hooks
export const useMarketSegments = marketSegmentHooks.useList;
export const useCreateMarketSegment = marketSegmentHooks.useCreate;
export const useUpdateMarketSegment = marketSegmentHooks.usePatch;
export const useDeleteMarketSegment = marketSegmentHooks.useDelete;

/**
 * Hook to fetch active market segments for dropdowns and lists
 *
 * This hook provides the data for region/market segment selectors.
 * For global market segment state (selected segment), use useMarketSegment from MarketSegmentContext.
 *
 * @example
 * ```typescript
 * const { data: activeSegments, isLoading } = useActiveMarketSegments();
 * const options = activeSegments?.map(s => ({ label: s.name, value: s.id }));
 * ```
 */
export function useActiveMarketSegments(
  options?: Omit<UseQueryOptions<MarketSegment[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: marketSegmentKeys.active(),
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<MarketSegment>>('/market-segments', {
        params: { status: 'ACTIVE', limit: 100 },
      });

      return response.items;
    },
    // Cache active segments for 5 minutes since they're relatively stable
    // and loaded frequently across the app (Header, RegionSelection, etc)
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

// Export query keys for cache invalidation
export const marketSegmentKeys = {
  all: ['market-segments'] as const,
  lists: () => [...marketSegmentKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...marketSegmentKeys.lists(), filters] as const,
  details: () => [...marketSegmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...marketSegmentKeys.details(), id] as const,
  active: () => [...marketSegmentKeys.all, 'active'] as const,
};
