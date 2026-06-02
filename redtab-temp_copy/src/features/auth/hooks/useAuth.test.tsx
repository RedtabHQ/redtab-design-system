import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useLogin,
  useRegister,
  useActivateAccount,
  useRequestPasswordless,
  usePasswordlessCallback,
  useForgotPassword,
  useResetPassword,
  useEnable2FA,
  useVerify2FA,
  useLogout,
  useRefreshToken,
  useCurrentUser,
  useIsAuthenticated,
} from '@features/auth/hooks';
import { useAuthStore } from '@stores';
import { authApi } from '@services';
import type { User } from '@types';

// Mock dependencies
vi.mock('@stores', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@services', () => ({
  authApi: {
    register: vi.fn(),
    activate: vi.fn(),
    requestPasswordless: vi.fn(),
    passwordlessCallback: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    enable2FA: vi.fn(),
    verify2FA: vi.fn(),
  },
}));

describe('useAuth Hooks', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;
  let mockAuthStore: {
    user: User | null;
    isAuthenticated: boolean;
    login: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
    refreshAccessToken: ReturnType<typeof vi.fn>;
    setTokens: ReturnType<typeof vi.fn>;
    setUser: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    mockAuthStore = {
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
      setTokens: vi.fn(),
      setUser: vi.fn(),
    };
    vi.mocked(useAuthStore).mockImplementation(<T,>(selector?: (state: typeof mockAuthStore) => T) => {
      if (typeof selector === 'function') {
        return selector(mockAuthStore);
      }
      return mockAuthStore as T;
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useLogin', () => {
    it('should initialize with idle state', () => {
      const { result } = renderHook(() => useLogin(), { wrapper });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it('should call store login function on mutation', async () => {
      mockAuthStore.login.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useLogin(), { wrapper });

      result.current.mutate({
        email: 'test@example.com',
        password: 'password123',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAuthStore.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        undefined,
        undefined
      );
      expect(mockAuthStore.login).toHaveBeenCalledTimes(1);
    });

    it('should handle login with 2FA code', async () => {
      mockAuthStore.login.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useLogin(), { wrapper });

      result.current.mutate({
        email: 'test@example.com',
        password: 'password123',
        twoFactorCode: '123456',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAuthStore.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        '123456',
        undefined
      );
    });

    it('should handle login with rememberMe option', async () => {
      mockAuthStore.login.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useLogin(), { wrapper });

      result.current.mutate({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAuthStore.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        undefined,
        true
      );
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      mockAuthStore.login.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useLogin(), { wrapper });

      result.current.mutate({
        email: 'test@example.com',
        password: 'wrong',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should set pending state during login', async () => {
      let resolveLogin: (() => void) | undefined;
      mockAuthStore.login.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveLogin = resolve;
        })
      );

      const { result } = renderHook(() => useLogin(), { wrapper });

      result.current.mutate({
        email: 'test@example.com',
        password: 'password123',
      });

      await waitFor(() => expect(result.current.isPending).toBe(true));

      resolveLogin?.();
      await waitFor(() => expect(result.current.isPending).toBe(false));
    });
  });

  describe('useRegister', () => {
    it('should call authApi.register on mutation', async () => {
      const mockResponse = { message: 'Registration successful' };
      vi.mocked(authApi.register).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useRegister(), { wrapper });

      const registerData = {
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser',
      };

      result.current.mutate(registerData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.register).toHaveBeenCalledWith(registerData);
      expect(authApi.register).toHaveBeenCalledTimes(1);
    });

    it('should handle registration error', async () => {
      const error = new Error('Email already exists');
      vi.mocked(authApi.register).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useRegister(), { wrapper });

      result.current.mutate({
        email: 'existing@example.com',
        password: 'password123',
        username: 'existing',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should support custom onSuccess callback', async () => {
      const mockResponse = { message: 'Success' };
      vi.mocked(authApi.register).mockResolvedValueOnce(mockResponse);
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useRegister({ onSuccess }), {
        wrapper,
      });

      result.current.mutate({
        email: 'test@example.com',
        password: 'password123',
        username: 'test',
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });
  });

  describe('useActivateAccount', () => {
    it('should call authApi.activate with token', async () => {
      const mockResponse = { message: 'Account activated' };
      vi.mocked(authApi.activate).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useActivateAccount(), { wrapper });

      result.current.mutate('activation-token-123');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.activate).toHaveBeenCalledWith('activation-token-123');
    });

    it('should handle activation error', async () => {
      const error = new Error('Invalid token');
      vi.mocked(authApi.activate).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useActivateAccount(), { wrapper });

      result.current.mutate('invalid-token');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRequestPasswordless', () => {
    it('should call authApi.requestPasswordless with email', async () => {
      const mockResponse = { message: 'Magic link sent' };
      vi.mocked(authApi.requestPasswordless).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useRequestPasswordless(), { wrapper });

      result.current.mutate('user@example.com');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.requestPasswordless).toHaveBeenCalledWith('user@example.com');
    });

    it('should handle request error', async () => {
      const error = new Error('Email not found');
      vi.mocked(authApi.requestPasswordless).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useRequestPasswordless(), { wrapper });

      result.current.mutate('unknown@example.com');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('usePasswordlessCallback', () => {
    it('should set tokens and user on success', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'USER',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser,
      };

      vi.mocked(authApi.passwordlessCallback).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => usePasswordlessCallback(), { wrapper });

      result.current.mutate('passwordless-token');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.passwordlessCallback).toHaveBeenCalledWith('passwordless-token');
      expect(mockAuthStore.setTokens).toHaveBeenCalledWith('access-token', 'refresh-token');
      expect(mockAuthStore.setUser).toHaveBeenCalledWith(mockUser);
    });

    it('should handle callback error', async () => {
      const error = new Error('Invalid token');
      vi.mocked(authApi.passwordlessCallback).mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePasswordlessCallback(), { wrapper });

      result.current.mutate('invalid-token');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
      expect(mockAuthStore.setTokens).not.toHaveBeenCalled();
      expect(mockAuthStore.setUser).not.toHaveBeenCalled();
    });
  });

  describe('useForgotPassword', () => {
    it('should call authApi.forgotPassword with email', async () => {
      const mockResponse = { message: 'Reset link sent' };
      vi.mocked(authApi.forgotPassword).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useForgotPassword(), { wrapper });

      result.current.mutate('user@example.com');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.forgotPassword).toHaveBeenCalledWith('user@example.com');
    });

    it('should handle forgot password error', async () => {
      const error = new Error('Email not found');
      vi.mocked(authApi.forgotPassword).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useForgotPassword(), { wrapper });

      result.current.mutate('unknown@example.com');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useResetPassword', () => {
    it('should call authApi.resetPassword with token and password', async () => {
      const mockResponse = { message: 'Password reset successful' };
      vi.mocked(authApi.resetPassword).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useResetPassword(), { wrapper });

      const resetData = {
        token: 'reset-token',
        password: 'newPassword123',
      };

      result.current.mutate(resetData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.resetPassword).toHaveBeenCalledWith(resetData);
    });

    it('should handle reset password error', async () => {
      const error = new Error('Invalid or expired token');
      vi.mocked(authApi.resetPassword).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useResetPassword(), { wrapper });

      result.current.mutate({
        token: 'invalid-token',
        password: 'newPassword123',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useEnable2FA', () => {
    it('should call authApi.enable2FA and return QR code', async () => {
      const mockResponse = {
        qrCode: 'data:image/png;base64,ABC123',
        secret: 'SECRET123',
      };
      vi.mocked(authApi.enable2FA).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useEnable2FA(), { wrapper });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.enable2FA).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle enable 2FA error', async () => {
      const error = new Error('2FA already enabled');
      vi.mocked(authApi.enable2FA).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useEnable2FA(), { wrapper });

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useVerify2FA', () => {
    it('should call authApi.verify2FA with code', async () => {
      const mockResponse = { message: '2FA verified' };
      vi.mocked(authApi.verify2FA).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useVerify2FA(), { wrapper });

      result.current.mutate('123456');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(authApi.verify2FA).toHaveBeenCalledWith('123456');
    });

    it('should handle verify 2FA error', async () => {
      const error = new Error('Invalid code');
      vi.mocked(authApi.verify2FA).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useVerify2FA(), { wrapper });

      result.current.mutate('000000');

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useLogout', () => {
    it('should call store logout and clear query cache', async () => {
      mockAuthStore.logout.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useLogout(), { wrapper });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAuthStore.logout).toHaveBeenCalled();
    });

    it('should clear all cached queries on success', async () => {
      mockAuthStore.logout.mockResolvedValueOnce(undefined);
      const clearSpy = vi.spyOn(queryClient, 'clear');

      const { result } = renderHook(() => useLogout(), { wrapper });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(clearSpy).toHaveBeenCalled();
    });

    it('should handle logout error', async () => {
      const error = new Error('Logout failed');
      mockAuthStore.logout.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useLogout(), { wrapper });

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRefreshToken', () => {
    it('should call store refreshToken function', async () => {
      mockAuthStore.refreshAccessToken.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useRefreshToken(), { wrapper });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAuthStore.refreshAccessToken).toHaveBeenCalled();
    });

    it('should handle refresh token error', async () => {
      const error = new Error('Refresh token expired');
      mockAuthStore.refreshAccessToken.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useRefreshToken(), { wrapper });

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useCurrentUser', () => {
    it('should return null when user is not authenticated', () => {
      mockAuthStore.user = null;

      const { result } = renderHook(() => useCurrentUser());

      expect(result.current).toBeNull();
    });

    it('should return user when authenticated', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'USER',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockAuthStore.user = mockUser;

      const { result } = renderHook(() => useCurrentUser());

      expect(result.current).toEqual(mockUser);
    });

    it('should update when user changes', () => {
      mockAuthStore.user = null;

      const { result, rerender } = renderHook(() => useCurrentUser());

      expect(result.current).toBeNull();

      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'USER',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockAuthStore.user = mockUser;
      rerender();

      expect(result.current).toEqual(mockUser);
    });
  });

  describe('useIsAuthenticated', () => {
    it('should return false when not authenticated', () => {
      mockAuthStore.isAuthenticated = false;

      const { result } = renderHook(() => useIsAuthenticated());

      expect(result.current).toBe(false);
    });

    it('should return true when authenticated', () => {
      mockAuthStore.isAuthenticated = true;

      const { result } = renderHook(() => useIsAuthenticated());

      expect(result.current).toBe(true);
    });

    it('should update when authentication state changes', () => {
      mockAuthStore.isAuthenticated = false;

      const { result, rerender } = renderHook(() => useIsAuthenticated());

      expect(result.current).toBe(false);

      mockAuthStore.isAuthenticated = true;
      rerender();

      expect(result.current).toBe(true);
    });
  });
});
