import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import {
  systemApi,
  type UpdateConfigData,
  type UpdateFeatureFlagData,
  type UpdateSettingData,
} from '@services';
import type { SystemConfig, SystemStatus } from '@types';

export const systemKeys = {
  all: ['system'] as const,
  config: () => [...systemKeys.all, 'config'] as const,
  status: () => [...systemKeys.all, 'status'] as const,
  health: () => [...systemKeys.all, 'health'] as const,
};

/**
 * Hook to fetch system configuration
 */
export function useSystemConfig(
  options?: Omit<UseQueryOptions<SystemConfig>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: systemKeys.config(),
    queryFn: () => systemApi.getConfig(),
    ...options,
  });
}

/**
 * Hook to fetch system status
 */
export function useSystemStatus(
  options?: Omit<UseQueryOptions<SystemStatus>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: systemKeys.status(),
    queryFn: () => systemApi.getStatus(),
    refetchInterval: 30000, // Refetch every 30 seconds
    ...options,
  });
}

/**
 * Hook to check system health
 */
export function useSystemHealth(
  options?: Omit<UseQueryOptions<{ status: string; timestamp: string }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: systemKeys.health(),
    queryFn: () => systemApi.healthCheck(),
    refetchInterval: 60000, // Refetch every minute
    ...options,
  });
}

/**
 * Hook to update system configuration
 */
export function useUpdateSystemConfig(
  options?: Omit<UseMutationOptions<SystemConfig, Error, UpdateConfigData>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateConfigData) => systemApi.updateConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemKeys.config() });
    },
    ...options,
  });
}

/**
 * Hook to update feature flag
 */
export function useUpdateFeatureFlag(
  options?: Omit<UseMutationOptions<SystemConfig, Error, { flag: string; data: UpdateFeatureFlagData }>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flag, data }: { flag: string; data: UpdateFeatureFlagData }) =>
      systemApi.updateFeatureFlag(flag, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemKeys.config() });
    },
    ...options,
  });
}

/**
 * Hook to update system setting
 */
export function useUpdateSystemSetting(
  options?: Omit<UseMutationOptions<SystemConfig, Error, { key: string; data: UpdateSettingData }>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: UpdateSettingData }) =>
      systemApi.updateSetting(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemKeys.config() });
    },
    ...options,
  });
}

/**
 * Hook to clear system cache
 */
export function useClearCache(
  options?: Omit<UseMutationOptions<{ message: string }, Error, void>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => systemApi.clearCache(),
    onSuccess: () => {
      // Clear the React Query cache as well
      queryClient.clear();
    },
    ...options,
  });
}
