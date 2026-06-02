import { apiClient } from '@/lib/api';
import { optimizeAvatar } from '@/utils/imageOptimizer';
import type { User, UserSettings } from '@types';

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface UpdateUserSettingsData {
  notifications?: {
    email?: boolean;
    sms?: boolean;
    whatsapp?: boolean;
  };
  preferences?: {
    language?: string;
    timezone?: string;
    currency?: string;
  };
  security?: {
    twoFactorEnabled?: boolean;
    sessionTimeout?: number;
  };
}

export const userApi = {
  /**
   * Get current user
   */
  async me(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response as User;
  },

  /**
   * Get all users
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
  }): Promise<{ data: User[]; total: number }> {
    const response = await apiClient.get<{ data: User[]; total: number }>('/users', { params });
    return response as { data: User[]; total: number };
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response as User;
  },

  /**
   * Get user settings
   */
  async getUserSettings(id: string): Promise<UserSettings> {
    const response = await apiClient.get<UserSettings>(`/users/${id}/settings`);
    return response as UserSettings;
  },

  /**
   * Create a new user
   */
  async create(data: CreateUserData): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response as User;
  },

  /**
   * Update a user
   */
  async update(id: string, data: UpdateUserData): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response as User;
  },

  /**
   * Update user settings
   */
  async updateSettings(id: string, data: UpdateUserSettingsData): Promise<UserSettings> {
    const response = await apiClient.patch<UserSettings>(`/users/${id}/settings`, data);
    return response as UserSettings;
  },

  /**
   * Delete a user
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  /**
   * Upload user avatar with automatic optimization
   * Resizes to 512x512 and converts to WebP for faster uploads
   */
  async uploadAvatar(id: string, file: File): Promise<User> {
    // Optimize image before upload (resize to 512x512, convert to WebP)
    const optimizedFile = await optimizeAvatar(file);

    const formData = new FormData();
    formData.append('file', optimizedFile);
    const response = await apiClient.post<User>(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response as User;
  },
};
