import { describe, it, expect, beforeEach, vi } from 'vitest';
import { roleApi } from './roleApi';
import { apiClient } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('roleApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all roles', async () => {
      const mockRoles = [
        { id: '1', name: 'Admin', description: 'Administrator role', permissions: ['*'] },
        { id: '2', name: 'User', description: 'Standard user role', permissions: ['read'] },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockRoles);

      const result = await roleApi.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/roles');
      expect(result).toEqual(mockRoles);
    });

    it('should handle empty roles list', async () => {
      vi.mocked(apiClient.get).mockResolvedValue([]);

      const result = await roleApi.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should fetch role by ID', async () => {
      const mockRole = {
        id: '1',
        name: 'Admin',
        description: 'Administrator role',
        permissions: ['users:read', 'users:write', 'roles:manage'],
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockRole);

      const result = await roleApi.getById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/roles/1');
      expect(result).toEqual(mockRole);
    });

    it('should handle role not found', async () => {
      const mockError = new Error('Role not found');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(roleApi.getById('nonexistent')).rejects.toThrow('Role not found');
    });
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const roleData = {
        name: 'Manager',
        description: 'Manager role',
        permissions: ['users:read', 'reports:read'],
      };

      const mockRole = {
        id: '3',
        ...roleData,
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockRole);

      const result = await roleApi.create(roleData);

      expect(apiClient.post).toHaveBeenCalledWith('/roles', roleData);
      expect(result).toEqual(mockRole);
    });

    it('should create role without description', async () => {
      const roleData = {
        name: 'Viewer',
        permissions: ['read'],
      };

      const mockRole = {
        id: '4',
        ...roleData,
        description: null,
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockRole);

      const result = await roleApi.create(roleData);

      expect(apiClient.post).toHaveBeenCalledWith('/roles', roleData);
      expect(result).toEqual(mockRole);
    });

    it('should handle duplicate role name error', async () => {
      const mockError = new Error('Role name already exists');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const roleData = {
        name: 'Admin',
        permissions: ['*'],
      };

      await expect(roleApi.create(roleData)).rejects.toThrow('Role name already exists');
    });
  });

  describe('update', () => {
    it('should update role name and description', async () => {
      const updateData = {
        name: 'Super Admin',
        description: 'Updated admin role',
      };

      const mockRole = {
        id: '1',
        ...updateData,
        permissions: ['*'],
      };

      vi.mocked(apiClient.patch).mockResolvedValue(mockRole);

      const result = await roleApi.update('1', updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/roles/1', updateData);
      expect(result).toEqual(mockRole);
    });

    it('should update only role name', async () => {
      const updateData = {
        name: 'Administrator',
      };

      const mockRole = {
        id: '1',
        ...updateData,
        description: 'Admin role',
        permissions: ['*'],
      };

      vi.mocked(apiClient.patch).mockResolvedValue(mockRole);

      const result = await roleApi.update('1', updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/roles/1', updateData);
      expect(result).toEqual(mockRole);
    });

    it('should handle update error', async () => {
      const mockError = new Error('Cannot update system role');
      vi.mocked(apiClient.patch).mockRejectedValue(mockError);

      await expect(roleApi.update('1', { name: 'NewName' })).rejects.toThrow('Cannot update system role');
    });
  });

  describe('delete', () => {
    it('should delete a role', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue(undefined);

      await roleApi.delete('3');

      expect(apiClient.delete).toHaveBeenCalledWith('/roles/3');
    });

    it('should handle delete system role error', async () => {
      const mockError = new Error('Cannot delete system role');
      vi.mocked(apiClient.delete).mockRejectedValue(mockError);

      await expect(roleApi.delete('1')).rejects.toThrow('Cannot delete system role');
    });

    it('should handle role in use error', async () => {
      const mockError = new Error('Role is assigned to users');
      vi.mocked(apiClient.delete).mockRejectedValue(mockError);

      await expect(roleApi.delete('2')).rejects.toThrow('Role is assigned to users');
    });
  });

  describe('getPermissions', () => {
    it('should fetch role permissions', async () => {
      const mockPermissions = ['users:read', 'users:write', 'roles:read'];

      vi.mocked(apiClient.get).mockResolvedValue(mockPermissions);

      const result = await roleApi.getPermissions('1');

      expect(apiClient.get).toHaveBeenCalledWith('/roles/1/permissions');
      expect(result).toEqual(mockPermissions);
    });

    it('should handle empty permissions', async () => {
      vi.mocked(apiClient.get).mockResolvedValue([]);

      const result = await roleApi.getPermissions('4');

      expect(result).toEqual([]);
    });
  });

  describe('updatePermissions', () => {
    it('should update role permissions', async () => {
      const permissionsData = {
        permissions: ['users:read', 'users:write', 'reports:read', 'reports:write'],
      };

      const mockRole = {
        id: '2',
        name: 'Manager',
        description: 'Manager role',
        permissions: permissionsData.permissions,
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockRole);

      const result = await roleApi.updatePermissions('2', permissionsData);

      expect(apiClient.post).toHaveBeenCalledWith('/roles/2/permissions', permissionsData);
      expect(result).toEqual(mockRole);
    });

    it('should update permissions with wildcard', async () => {
      const permissionsData = {
        permissions: ['*'],
      };

      const mockRole = {
        id: '1',
        name: 'Admin',
        description: 'Administrator role',
        permissions: ['*'],
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockRole);

      const result = await roleApi.updatePermissions('1', permissionsData);

      expect(apiClient.post).toHaveBeenCalledWith('/roles/1/permissions', permissionsData);
      expect(result).toEqual(mockRole);
    });

    it('should handle update permissions error', async () => {
      const mockError = new Error('Invalid permissions');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const permissionsData = {
        permissions: ['invalid:permission'],
      };

      await expect(roleApi.updatePermissions('1', permissionsData)).rejects.toThrow('Invalid permissions');
    });
  });

  describe('getUsers', () => {
    it('should fetch users with role', async () => {
      const mockUsers = [
        { id: '1', username: 'admin1', email: 'admin1@example.com', role: 'Admin' },
        { id: '2', username: 'admin2', email: 'admin2@example.com', role: 'Admin' },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockUsers);

      const result = await roleApi.getUsers('1');

      expect(apiClient.get).toHaveBeenCalledWith('/roles/1/users');
      expect(result).toEqual(mockUsers);
    });

    it('should handle role with no users', async () => {
      vi.mocked(apiClient.get).mockResolvedValue([]);

      const result = await roleApi.getUsers('3');

      expect(result).toEqual([]);
    });

    it('should handle error fetching users', async () => {
      const mockError = new Error('Role not found');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(roleApi.getUsers('nonexistent')).rejects.toThrow('Role not found');
    });
  });
});
