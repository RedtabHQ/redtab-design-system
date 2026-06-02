import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useRoles,
  useRole,
  useRolePermissions,
  useCreateRole,
  useUpdateRole,
  useUpdateRolePermissions,
  useDeleteRole,
  roleKeys,
} from '@features/users/hooks';
import { roleApi } from '@services';
import type { Role, Permission } from '@types';

// Mock role API
vi.mock('@services', () => ({
  roleApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getPermissions: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updatePermissions: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useRoles Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  const mockRole: Role = {
    id: 'R123',
    name: 'Admin',
    description: 'Administrator role',
    permissions: ['read', 'write', 'delete'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockPermissions: Permission[] = [
    { id: 'P1', name: 'read', resource: 'merchants' },
    { id: 'P2', name: 'write', resource: 'merchants' },
  ];

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useRoles', () => {
    it('should fetch all roles', async () => {
      const mockRoles = [mockRole];
      vi.mocked(roleApi.getAll).mockResolvedValueOnce(mockRoles);

      const { result } = renderHook(() => useRoles(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockRoles);
      expect(roleApi.getAll).toHaveBeenCalled();
    });

    it('should handle roles list error', async () => {
      const error = new Error('Failed to fetch roles');
      vi.mocked(roleApi.getAll).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useRoles(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRole', () => {
    it('should fetch single role by ID', async () => {
      vi.mocked(roleApi.getById).mockResolvedValueOnce(mockRole);

      const { result } = renderHook(() => useRole('R123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockRole);
      expect(roleApi.getById).toHaveBeenCalledWith('R123');
    });

    it('should not fetch when ID is empty', () => {
      const { result } = renderHook(() => useRole(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(roleApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('useRolePermissions', () => {
    it('should fetch permissions for a role', async () => {
      vi.mocked(roleApi.getPermissions).mockResolvedValueOnce(mockPermissions);

      const { result } = renderHook(() => useRolePermissions('R123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPermissions);
      expect(roleApi.getPermissions).toHaveBeenCalledWith('R123');
    });

    it('should not fetch when role ID is empty', () => {
      const { result } = renderHook(() => useRolePermissions(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(roleApi.getPermissions).not.toHaveBeenCalled();
    });
  });

  describe('useCreateRole', () => {
    it('should create role and invalidate list cache', async () => {
      const createData = {
        name: 'Manager',
        description: 'Manager role',
        permissions: ['read', 'write'],
      };

      vi.mocked(roleApi.create).mockResolvedValueOnce(mockRole);

      const { result } = renderHook(() => useCreateRole(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate(createData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(roleApi.create).toHaveBeenCalledWith(createData);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roleKeys.lists() });
    });
  });

  describe('useUpdateRole', () => {
    it('should update role and invalidate caches', async () => {
      const updatedRole = { ...mockRole, name: 'Super Admin' };
      vi.mocked(roleApi.update).mockResolvedValueOnce(updatedRole);

      const { result } = renderHook(() => useUpdateRole(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        id: 'R123',
        data: { name: 'Super Admin' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(roleApi.update).toHaveBeenCalledWith('R123', { name: 'Super Admin' });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roleKeys.detail('R123') });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roleKeys.lists() });
    });
  });

  describe('useUpdateRolePermissions', () => {
    it('should update role permissions and invalidate caches', async () => {
      vi.mocked(roleApi.updatePermissions).mockResolvedValueOnce(mockPermissions);

      const { result } = renderHook(() => useUpdateRolePermissions(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const permissionsData = {
        permissionIds: ['P1', 'P2', 'P3'],
      };

      result.current.mutate({
        roleId: 'R123',
        data: permissionsData,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(roleApi.updatePermissions).toHaveBeenCalledWith('R123', permissionsData);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roleKeys.permissions('R123') });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roleKeys.detail('R123') });
    });
  });

  describe('useDeleteRole', () => {
    it('should delete role and invalidate list cache', async () => {
      vi.mocked(roleApi.delete).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useDeleteRole(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate('R123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(roleApi.delete).toHaveBeenCalledWith('R123');
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: roleKeys.lists() });
    });
  });
});
