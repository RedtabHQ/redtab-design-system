import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userApi } from './userApi';
import { apiClient } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock image optimizer - returns file as-is for testing
vi.mock('@/utils/imageOptimizer', () => ({
  optimizeAvatar: vi.fn((file: File) => Promise.resolve(file)),
}));

describe('userApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('me', () => {
    it('should fetch current user', async () => {
      const mockUser = {
        id: '1',
        username: 'currentuser',
        email: 'current@example.com',
        role: 'admin',
        status: 'ACTIVE',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockUser);

      const result = await userApi.me();

      expect(apiClient.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });

    it('should handle unauthorized error', async () => {
      const mockError = new Error('Unauthorized');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(userApi.me()).rejects.toThrow('Unauthorized');
    });
  });

  describe('getAll', () => {
    it('should fetch all users without filters', async () => {
      const mockResponse = {
        data: [
          { id: '1', username: 'user1', email: 'user1@example.com', role: 'admin' },
          { id: '2', username: 'user2', email: 'user2@example.com', role: 'user' },
        ],
        total: 2,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await userApi.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/users', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch all users with pagination', async () => {
      const mockResponse = {
        data: [
          { id: '1', username: 'user1', email: 'user1@example.com', role: 'admin' },
        ],
        total: 10,
      };

      const params = { page: 1, limit: 10 };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await userApi.getAll(params);

      expect(apiClient.get).toHaveBeenCalledWith('/users', { params });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch users filtered by role', async () => {
      const mockResponse = {
        data: [
          { id: '1', username: 'admin1', email: 'admin1@example.com', role: 'admin' },
        ],
        total: 1,
      };

      const params = { role: 'admin' };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await userApi.getAll(params);

      expect(apiClient.get).toHaveBeenCalledWith('/users', { params });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch users filtered by status', async () => {
      const mockResponse = {
        data: [
          { id: '1', username: 'user1', email: 'user1@example.com', status: 'ACTIVE' },
        ],
        total: 1,
      };

      const params = { status: 'ACTIVE' };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await userApi.getAll(params);

      expect(apiClient.get).toHaveBeenCalledWith('/users', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should fetch user by ID', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        status: 'ACTIVE',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockUser);

      const result = await userApi.getById('1');

      expect(apiClient.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(mockUser);
    });

    it('should handle user not found error', async () => {
      const mockError = new Error('User not found');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(userApi.getById('nonexistent')).rejects.toThrow('User not found');
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
      };

      const mockUser = {
        id: '1',
        ...userData,
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockUser);

      const result = await userApi.create(userData);

      expect(apiClient.post).toHaveBeenCalledWith('/users', userData);
      expect(result).toEqual(mockUser);
    });

    it('should create user without role (default)', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        ...userData,
        role: 'user',
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockUser);

      const result = await userApi.create(userData);

      expect(apiClient.post).toHaveBeenCalledWith('/users', userData);
      expect(result).toEqual(mockUser);
    });

    it('should handle email already exists error', async () => {
      const mockError = new Error('Email already exists');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const userData = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123',
      };

      await expect(userApi.create(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = {
        username: 'updateduser',
        email: 'updated@example.com',
      };

      const mockUser = {
        id: '1',
        ...updateData,
        role: 'user',
        status: 'ACTIVE',
      };

      vi.mocked(apiClient.patch).mockResolvedValue(mockUser);

      const result = await userApi.update('1', updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/users/1', updateData);
      expect(result).toEqual(mockUser);
    });

    it('should update user role', async () => {
      const updateData = {
        role: 'admin',
      };

      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
        status: 'ACTIVE',
      };

      vi.mocked(apiClient.patch).mockResolvedValue(mockUser);

      const result = await userApi.update('1', updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/users/1', updateData);
      expect(result).toEqual(mockUser);
    });

    it('should update user status', async () => {
      const updateData = {
        status: 'SUSPENDED' as const,
      };

      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        status: 'SUSPENDED',
      };

      vi.mocked(apiClient.patch).mockResolvedValue(mockUser);

      const result = await userApi.update('1', updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/users/1', updateData);
      expect(result).toEqual(mockUser);
    });

    it('should handle update error', async () => {
      const mockError = new Error('Update failed');
      vi.mocked(apiClient.patch).mockRejectedValue(mockError);

      await expect(userApi.update('1', { username: 'newname' })).rejects.toThrow('Update failed');
    });
  });

  describe('updateSettings', () => {
    it('should update user settings with notifications', async () => {
      const settingsData = {
        notifications: {
          email: true,
          sms: false,
          whatsapp: true,
        },
      };

      const mockSettings = {
        id: 'settings-1',
        userId: '1',
        ...settingsData,
      };

      vi.mocked(apiClient.patch).mockResolvedValue(mockSettings);

      const result = await userApi.updateSettings('1', settingsData);

      expect(apiClient.patch).toHaveBeenCalledWith('/users/1/settings', settingsData);
      expect(result).toEqual(mockSettings);
    });

    it('should update user preferences', async () => {
      const settingsData = {
        preferences: {
          language: 'en',
          timezone: 'UTC',
          currency: 'USD',
        },
      };

      const mockSettings = {
        id: 'settings-1',
        userId: '1',
        ...settingsData,
      };

      vi.mocked(apiClient.patch).mockResolvedValue(mockSettings);

      const result = await userApi.updateSettings('1', settingsData);

      expect(apiClient.patch).toHaveBeenCalledWith('/users/1/settings', settingsData);
      expect(result).toEqual(mockSettings);
    });

    it('should update security settings', async () => {
      const settingsData = {
        security: {
          twoFactorEnabled: true,
          sessionTimeout: 3600,
        },
      };

      const mockSettings = {
        id: 'settings-1',
        userId: '1',
        ...settingsData,
      };

      vi.mocked(apiClient.patch).mockResolvedValue(mockSettings);

      const result = await userApi.updateSettings('1', settingsData);

      expect(apiClient.patch).toHaveBeenCalledWith('/users/1/settings', settingsData);
      expect(result).toEqual(mockSettings);
    });

    it('should handle settings update error', async () => {
      const mockError = new Error('Settings update failed');
      vi.mocked(apiClient.patch).mockRejectedValue(mockError);

      await expect(userApi.updateSettings('1', {})).rejects.toThrow('Settings update failed');
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue(undefined);

      await userApi.delete('1');

      expect(apiClient.delete).toHaveBeenCalledWith('/users/1');
    });

    it('should handle delete error', async () => {
      const mockError = new Error('Cannot delete user');
      vi.mocked(apiClient.delete).mockRejectedValue(mockError);

      await expect(userApi.delete('1')).rejects.toThrow('Cannot delete user');
    });
  });

  describe('uploadAvatar', () => {
    it('should upload user avatar', async () => {
      const mockFile = new File(['avatar'], 'avatar.png', { type: 'image/png' });

      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        avatarUrl: 'https://example.com/avatars/1.png',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockUser);

      const result = await userApi.uploadAvatar('1', mockFile);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/users/1/avatar',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle avatar upload error', async () => {
      const mockFile = new File(['avatar'], 'avatar.png', { type: 'image/png' });
      const mockError = new Error('File too large');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(userApi.uploadAvatar('1', mockFile)).rejects.toThrow('File too large');
    });
  });
});
