import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { SCORING_HIERARCHY } from '@/constants';

/**
 * Scoring hierarchy configuration type
 */
export interface ScoringHierarchy {
  CAPACITY: ScoringCategory;
  INTENTION: ScoringCategory;
  DYNAMIC_FACTORS: Record<string, DynamicFactor>;
}

interface ScoringCategory {
  weight: number;
  subMetrics: Record<string, SubMetric>;
}

interface SubMetric {
  weight: number;
  logic?: string;
  targetValue?: number;
  unit?: string;
  description?: string;
}

interface DynamicFactor {
  logic: string;
  label: string;
}

// API response type from backend
interface FactorResponse {
  weight: number;
  logic?: string;
  targetValue?: number;
  unit?: string;
  description?: string;
}

interface ScoringConfigResponse {
  id: string;
  configName: string;
  categories: Record<
    string,
    {
      weight: number;
      factors: Record<string, FactorResponse>;
    }
  >;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const QUERY_KEY = ['scoringHierarchy'] as const;

/**
 * Transform API response to ScoringHierarchy format
 */
function transformToHierarchy(config: ScoringConfigResponse): ScoringHierarchy {
  const capacity = config.categories['CAPACITY'];
  const intention = config.categories['INTENTION'];
  const dynamicFactors = config.categories['DYNAMIC_FACTORS'];

  return {
    CAPACITY: {
      weight: capacity?.weight ?? 0.6,
      subMetrics: capacity?.factors ?? {},
    },
    INTENTION: {
      weight: intention?.weight ?? 0.4,
      subMetrics: intention?.factors ?? {},
    },
    DYNAMIC_FACTORS: dynamicFactors?.factors
      ? Object.fromEntries(
          Object.entries(dynamicFactors.factors).map(([key, factor]) => [
            key,
            {
              logic: factor.logic ?? '',
              label: factor.description ?? key,
            },
          ])
        )
      : {},
  };
}

/**
 * Hook to fetch scoring hierarchy configuration
 *
 * Features:
 * - Fetches from API endpoint /api/v1/scoring/configs/active
 * - Caches configuration for 1 hour
 * - Falls back to constants if API fails
 *
 * @returns Query result with scoring hierarchy data
 *
 * @example
 * ```tsx
 * const { data: scoringHierarchy, isLoading, error } = useScoringHierarchy();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * const capacityWeight = scoringHierarchy.CAPACITY.weight;
 * ```
 */
export function useScoringHierarchy(
  options?: Omit<UseQueryOptions<ScoringHierarchy>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await apiClient.get<ScoringConfigResponse>('/scoring/configs/active');
        return transformToHierarchy(response as ScoringConfigResponse);
      } catch (error) {
        // Fallback to constants if API fails
        console.warn('Failed to fetch scoring config from API, using fallback:', error);
        return SCORING_HIERARCHY as ScoringHierarchy;
      }
    },
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
    gcTime: 24 * 60 * 60 * 1000, // Keep in memory for 24 hours
    retry: 1,
    ...options,
  });
}
