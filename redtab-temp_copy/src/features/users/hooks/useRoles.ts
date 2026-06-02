import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { roleApi, type CreateRoleData, type UpdateRoleData, type UpdatePermissionsData } from '@services';
import type { Role } from '@types';

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
  permissions: (roleId: string) => [...roleKeys.all, 'permissions', roleId] as const,
};

/**
 * Hook to fetch all roles
 */
export function useRoles(
  options?: Omit<UseQueryOptions<Role[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: () => roleApi.getAll(),
    ...options,
  });
}

/**
 * Hook to fetch single role by ID
 */
export function useRole(
  id: string,
  options?: Omit<UseQueryOptions<Role>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleApi.getById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook to fetch permissions for a role
 */
export function useRolePermissions(
  roleId: string,
  options?: Omit<UseQueryOptions<string[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: roleKeys.permissions(roleId),
    queryFn: () => roleApi.getPermissions(roleId),
    enabled: !!roleId,
    ...options,
  });
}

/**
 * Hook to create a new role
 */
export function useCreateRole(
  options?: Omit<UseMutationOptions<Role, Error, CreateRoleData>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleData) => roleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
    ...options,
  });
}

/**
 * Hook to update role
 */
export function useUpdateRole(
  options?: Omit<UseMutationOptions<Role, Error, { id: string; data: UpdateRoleData }>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleData }) => roleApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
    ...options,
  });
}

/**
 * Hook to update role permissions
 */
export function useUpdateRolePermissions(
  options?: Omit<UseMutationOptions<Role, Error, { roleId: string; data: UpdatePermissionsData }>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: UpdatePermissionsData }) =>
      roleApi.updatePermissions(roleId, data),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.permissions(roleId) });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(roleId) });
    },
    ...options,
  });
}

/**
 * Hook to delete role
 */
export function useDeleteRole(
  options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
    ...options,
  });
}
