import { apiClient } from '@/lib/api';
import type { Role, User } from '@types';

export interface CreateRoleData {
  name: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
}

export interface UpdatePermissionsData {
  permissions: string[];
}

export const roleApi = {
  /**
   * Get all roles
   */
  async getAll(): Promise<Role[]> {
    const response = await apiClient.get<Role[]>('/roles');
    return response as Role[];
  },

  /**
   * Get role by ID
   */
  async getById(id: string): Promise<Role> {
    const response = await apiClient.get<Role>(`/roles/${id}`);
    return response as Role;
  },

  /**
   * Create a new role
   */
  async create(data: CreateRoleData): Promise<Role> {
    const response = await apiClient.post<Role>('/roles', data);
    return response as Role;
  },

  /**
   * Update a role
   */
  async update(id: string, data: UpdateRoleData): Promise<Role> {
    const response = await apiClient.patch<Role>(`/roles/${id}`, data);
    return response as Role;
  },

  /**
   * Delete a role
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/roles/${id}`);
  },

  /**
   * Get role permissions
   */
  async getPermissions(id: string): Promise<string[]> {
    const response = await apiClient.get<string[]>(`/roles/${id}/permissions`);
    return response as string[];
  },

  /**
   * Update role permissions
   */
  async updatePermissions(id: string, data: UpdatePermissionsData): Promise<Role> {
    const response = await apiClient.post<Role>(`/roles/${id}/permissions`, data);
    return response as Role;
  },

  /**
   * Get users with this role
   */
  async getUsers(id: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(`/roles/${id}/users`);
    return response as User[];
  },
};
