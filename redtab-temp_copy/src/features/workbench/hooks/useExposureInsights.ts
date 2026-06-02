import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import {
  workbenchApi,
  type ExposureInsightsResponse,
  type GetExposureInsightsParams,
} from '../services/workbenchApi';

export const exposureInsightsKeys = {
  all: ['exposure-insights'] as const,
  detail: (merchantId?: string, marketSegmentId?: string | null) =>
    [...exposureInsightsKeys.all, merchantId, marketSegmentId] as const,
};

export function useExposureInsights(
  params: GetExposureInsightsParams,
  options?: Omit<UseQueryOptions<ExposureInsightsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: exposureInsightsKeys.detail(params?.merchantId, params?.marketSegmentId ?? null),
    queryFn: () => workbenchApi.getExposureInsights(params),
    enabled: Boolean(params?.merchantId),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
