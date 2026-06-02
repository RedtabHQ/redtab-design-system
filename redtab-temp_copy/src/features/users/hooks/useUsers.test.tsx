// @ts-nocheck

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useUsers,
  useUser,
  useMe,
  useUserSettings,
  useCreateUser,
  useUpdateUser,
  useUpdateUserSettings,
  useUploadAvatar,
  useDeleteUser,
  userKeys,
} from '@features/users/hooks';
import { userApi } from '@services';
import type { User, UserSettings } from '@types';

// vi.hoisted runs before vi.mock factories (which are hoisted to top of file)
const { mockUserService } = vi.hoisted(() => ({
  mockUserService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock userService (used by createResourceHooks for CRUD: useUsers, useCreateUser, useDeleteUser)
vi.mock('@/lib/apiService', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return { ...actual, userService: mockUserService };
});

// Mock userApi (used by custom hooks: useMe, useUserSettings, useUpdateUser, etc.)
vi.mock('@services', () => ({
  userApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    me: vi.fn(),
    getUserSettings: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateSettings: vi.fn(),
    uploadAvatar: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useUsers Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  const mockUser: User = {
    id: 'U123',
    email: 'user@example.com',
    username: 'testuser',
    role: 'USER',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockUserSettings: UserSettings = {
    userId: 'U123',
    notifications: true,
    theme: 'light',
    language: 'en',
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('userKeys', () => {
    it('should generate correct query keys', () => {
      expect(userKeys.all).toEqual(['users']);
      expect(userKeys.lists()).toEqual(['users', 'list']);
      expect(userKeys.list({ page: 1 })).toEqual(['users', 'list', { page: 1 }]);
      expect(userKeys.details()).toEqual(['users', 'detail']);
      expect(userKeys.detail('U123')).toEqual(['users', 'detail', 'U123']);
      expect(userKeys.me()).toEqual(['users', 'me']);
      expect(userKeys.settings('U123')).toEqual(['users', 'settings', 'U123']);
    });
  });

  describe('useUsers', () => {
    it('should fetch paginated users list', async () => {
      const mockResponse = {
        data: [mockUser],
        total: 1,
        totalPages: 1,
      };

      mockUserService.getAll.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useUsers({ page: 1, pageSize: 20 }), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockResponse);
      expect(mockUserService.getAll).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
    });

    it('should support filtering and sorting', async () => {
      const mockResponse = {
        data: [mockUser],
        total: 1,
        totalPages: 1,
      };

      const params = {
        search: 'test',
        role: 'USER',
        isActive: true,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
      };

      mockUserService.getAll.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useUsers(params), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockUserService.getAll).toHaveBeenCalledWith(params);
    });

    it('should handle users list error', async () => {
      const error = new Error('Failed to fetch users');
      mockUserService.getAll.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUsers(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUser', () => {
    it('should fetch single user by ID', async () => {
      mockUserService.getById.mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useUser('U123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockUser);
      expect(mockUserService.getById).toHaveBeenCalledWith('U123');
    });

    it('should not fetch when ID is empty', () => {
      const { result } = renderHook(() => useUser(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockUserService.getById).not.toHaveBeenCalled();
    });

    it('should handle user detail error', async () => {
      const error = new Error('User not found');
      mockUserService.getById.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUser('U123'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useMe', () => {
    it('should fetch current user profile', async () => {
      vi.mocked(userApi.me).mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockUser);
      expect(userApi.me).toHaveBeenCalled();
    });

    it('should use 5 minute stale time', async () => {
      vi.mocked(userApi.me).mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Data should still be fresh after initial fetch
      expect(result.current.isStale).toBe(false);
    });

    it('should handle me endpoint error', async () => {
      const error = new Error('Unauthorized');
      vi.mocked(userApi.me).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should support refetch', async () => {
      const mockUser1 = { ...mockUser, username: 'user1' };
      const mockUser2 = { ...mockUser, username: 'user2' };

      vi.mocked(userApi.me)
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2);

      const { result } = renderHook(() => useMe(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockUser1);

      result.current.refetch();

      await waitFor(() => expect(result.current.data).toEqual(mockUser2));
    });
  });

  describe('useUserSettings', () => {
    it('should fetch user settings', async () => {
      vi.mocked(userApi.getUserSettings).mockResolvedValueOnce(mockUserSettings);

      const { result } = renderHook(() => useUserSettings('U123'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockUserSettings);
      expect(userApi.getUserSettings).toHaveBeenCalledWith('U123');
    });

    it('should not fetch when user ID is empty', () => {
      const { result } = renderHook(() => useUserSettings(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(userApi.getUserSettings).not.toHaveBeenCalled();
    });
  });

  describe('useCreateUser', () => {
    it('should create user and invalidate list cache', async () => {
      const createData = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
        role: 'USER' as const,
      };

      mockUserService.create.mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useCreateUser(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate(createData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockUserService.create).toHaveBeenCalledWith(createData);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: userKeys.lists() });
    });

    it('should handle create error', async () => {
      const error = new Error('Email already exists');
      mockUserService.create.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreateUser(), { wrapper });

      result.current.mutate({
        email: 'existing@example.com',
        username: 'existing',
        password: 'password123',
        role: 'USER',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUpdateUser', () => {
    it('should update user and invalidate caches', async () => {
      const updatedUser = { ...mockUser, username: 'updateduser' };
      vi.mocked(userApi.update).mockResolvedValueOnce(updatedUser);

      const { result } = renderHook(() => useUpdateUser(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        id: 'U123',
        data: { username: 'updateduser' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(userApi.update).toHaveBeenCalledWith('U123', { username: 'updateduser' });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: userKeys.detail('U123') });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: userKeys.lists() });
    });

    it('should invalidate me cache when updating current user', async () => {
      const updatedUser = { ...mockUser, username: 'updateduser' };
      vi.mocked(userApi.update).mockResolvedValueOnce(updatedUser);

      // Set current user in cache
      queryClient.setQueryData(userKeys.me(), mockUser);

      const { result } = renderHook(() => useUpdateUser(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        id: 'U123',
        data: { username: 'updateduser' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: userKeys.me() });
    });

    it('should not invalidate me cache when updating different user', async () => {
      const updatedUser = { ...mockUser, id: 'U456', username: 'updateduser' };
      vi.mocked(userApi.update).mockResolvedValueOnce(updatedUser);

      // Set current user in cache (different from updated user)
      queryClient.setQueryData(userKeys.me(), mockUser);

      const { result } = renderHook(() => useUpdateUser(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        id: 'U456',
        data: { username: 'updateduser' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should not invalidate me cache since it's a different user
      const meCalls = invalidateSpy.mock.calls.filter(
        (call) => JSON.stringify(call[0].queryKey) === JSON.stringify(userKeys.me())
      );
      expect(meCalls).toHaveLength(0);
    });
  });

  describe('useUpdateUserSettings', () => {
    it('should update user settings and invalidate cache', async () => {
      const updatedSettings = { ...mockUserSettings, theme: 'dark' as const };
      vi.mocked(userApi.updateSettings).mockResolvedValueOnce(updatedSettings);

      const { result } = renderHook(() => useUpdateUserSettings(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        userId: 'U123',
        data: { theme: 'dark' },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(userApi.updateSettings).toHaveBeenCalledWith('U123', { theme: 'dark' });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: userKeys.settings('U123') });
    });
  });

  describe('useUploadAvatar', () => {
    it('should upload avatar and invalidate caches', async () => {
      const mockFile = new File(['avatar'], 'avatar.png', { type: 'image/png' });
      const mockResponse = { avatarUrl: 'https://example.com/avatar.png' };

      vi.mocked(userApi.uploadAvatar).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useUploadAvatar(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate({
        userId: 'U123',
        file: mockFile,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(userApi.uploadAvatar).toHaveBeenCalledWith('U123', mockFile);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: userKeys.detail('U123') });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: userKeys.me() });
    });

    it('should handle upload error', async () => {
      const mockFile = new File(['avatar'], 'avatar.png', { type: 'image/png' });
      const error = new Error('File too large');
      vi.mocked(userApi.uploadAvatar).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUploadAvatar(), { wrapper });

      result.current.mutate({ userId: 'U123', file: mockFile });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useDeleteUser', () => {
    it('should delete user and invalidate list cache', async () => {
      mockUserService.delete.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useDeleteUser(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      result.current.mutate('U123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockUserService.delete).toHaveBeenCalledWith('U123');
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: userKeys.lists() });
    });

    it('should handle delete error', async () => {
      const error = new Error('Cannot delete admin user');
      mockUserService.delete.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDeleteUser(), { wrapper });

      result.current.mutate('U123');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });
});
