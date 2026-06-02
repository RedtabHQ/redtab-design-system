import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scoringConfigService, type ScoringConfig, type ScoringCategory } from '@/features/admin/services/scoringConfigApi';
import type { PaginationParams, FilterParams } from '@/lib/apiService';
import type { PaginatedResponse } from '@types';

/**
 * Query keys for scoring configuration
 */
export const scoringConfigKeys = {
  all: ['scoringConfig'] as const,
  lists: () => [...scoringConfigKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...scoringConfigKeys.lists(), filters] as const,
  active: () => [...scoringConfigKeys.all, 'active'] as const,
  detail: (id: string) => [...scoringConfigKeys.all, 'detail', id] as const,
};

/**
 * Transform API response data to ensure consistent subMetrics naming
 * API uses 'factors' but UI expects 'subMetrics'
 */
const normalizeConfigFormat = (config: ScoringConfig): ScoringConfig => {
  if (!config?.categories) return config;

  const normalized: ScoringConfig = {
    ...config,
    categories: Object.entries(config.categories).reduce((acc, [key, category]) => {
      const factors = category.factors || category.subMetrics || {};
      acc[key] = {
        ...category,
        subMetrics: factors,
        factors: undefined, // Remove factors to avoid duplication
      } as ScoringCategory;
      return acc;
    }, {} as Record<string, ScoringCategory>),
  };

  return normalized;
};

/**
 * Hook to fetch the active scoring configuration
 * This is the main configuration used for scoring calculations
 */
export const useActiveScoringConfig = (options?: Record<string, unknown>) => {
  return useQuery({
    queryKey: scoringConfigKeys.active(),
    queryFn: async () => {
      const config = await scoringConfigService.getActiveConfig();
      return normalizeConfigFormat(config);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Hook to fetch paginated list of scoring configurations
 */
export const useScoringConfigs = (
  params?: PaginationParams & FilterParams,
  options?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: scoringConfigKeys.list(params),
    queryFn: () => scoringConfigService.getAllConfigs(params),
    placeholderData: (previousData: PaginatedResponse<ScoringConfig> | undefined) =>
      previousData ?? {
        items: [],
        meta: {
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 10,
          total: 0,
          totalPages: 1,
        },
      },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch a single scoring configuration by ID
 */
export const useScoringConfig = (id: string, options?: Record<string, unknown>) => {
  return useQuery({
    queryKey: scoringConfigKeys.detail(id),
    queryFn: () => scoringConfigService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to create a new scoring configuration
 */
export const useCreateScoringConfig = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ScoringConfig>) => scoringConfigService.create(data),
    onSuccess: () => {
      // Invalidate both list and active config queries
      queryClient.invalidateQueries({ queryKey: scoringConfigKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scoringConfigKeys.active() });
      if (options?.onSuccess) {
        (options.onSuccess as Function)?.();
      }
    },
    ...options,
  });
};

/**
 * Hook to update an existing scoring configuration
 */
export const useUpdateScoringConfig = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ScoringConfig> }) =>
      scoringConfigService.update(id, data),
    onSuccess: (data, variables) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: scoringConfigKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scoringConfigKeys.detail(variables.id) });
      if (options?.onSuccess) {
        (options.onSuccess as Function)?.(data);
      }
    },
    ...options,
  });
};

/**
 * Transform UI format back to API format (subMetrics → factors)
 */
const formatConfigForApi = (config: Partial<ScoringConfig>): Partial<ScoringConfig> => {
  if (!config?.categories) return config;

  const formatted: Partial<ScoringConfig> = {
    ...config,
    categories: Object.entries(config.categories).reduce((acc, [key, category]) => {
      const subMetrics = category.subMetrics || category.factors || {};
      acc[key] = {
        ...category,
        factors: subMetrics,
        subMetrics: undefined, // Remove subMetrics when sending to API
      } as ScoringCategory;
      return acc;
    }, {} as Record<string, ScoringCategory>),
  };

  return formatted;
};

/**
 * Hook to deploy a scoring configuration (activate it)
 */
export const useDeployScoringConfig = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (config: Partial<ScoringConfig>) => {
      const formatted = formatConfigForApi(config);
      return scoringConfigService.deployConfig(formatted);
    },
    onSuccess: (data) => {
      // Invalidate all scoring config queries since active config changed
      queryClient.invalidateQueries({ queryKey: scoringConfigKeys.all });
      if (options?.onSuccess) {
        (options.onSuccess as Function)?.(normalizeConfigFormat(data));
      }
    },
    ...options,
  });
};

/**
 * Hook to restore default scoring configuration
 */
export const useRestoreScoringConfigDefaults = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => scoringConfigService.restoreDefaults(),
    onSuccess: (data) => {
      // Invalidate all scoring config queries
      queryClient.invalidateQueries({ queryKey: scoringConfigKeys.all });
      if (options?.onSuccess) {
        (options.onSuccess as Function)?.(data);
      }
    },
    ...options,
  });
};
