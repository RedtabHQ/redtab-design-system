import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authApi } from './authApi';
import { apiClient } from '@/lib/api';
import { mockLocalStorage, mockSessionStorage } from '@/test/mocks';

// Mock the api client
vi.mock('@/lib/api', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock localStorage and sessionStorage
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(global, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    mockSessionStorage.clear();
  });

  describe('login', () => {
    it('should login with email and password', async () => {
      const mockResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'admin',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.login('test@example.com', 'password123');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        username: 'test@example.com',
        password: 'password123',
        twoFactorCode: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should login with email, password, and 2FA code', async () => {
      const mockResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'admin',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.login('test@example.com', 'password123', '123456');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        username: 'test@example.com',
        password: 'password123',
        twoFactorCode: '123456',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle login error', async () => {
      const mockError = new Error('Invalid credentials');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(authApi.login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockResponse = {
        message: 'User registered successfully',
        user: {
          id: '1',
          email: 'newuser@example.com',
          username: 'newuser',
          role: 'user',
        },
      };

      const registerData = {
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser',
        role: 'user',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.register(registerData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration error', async () => {
      const mockError = new Error('Email already exists');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        username: 'existinguser',
      };

      await expect(authApi.register(registerData)).rejects.toThrow('Email already exists');
    });
  });

  describe('activate', () => {
    it('should activate account with valid token', async () => {
      const mockResponse = {
        message: 'Account activated successfully',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'user',
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.activate('valid-token');

      expect(apiClient.get).toHaveBeenCalledWith('/auth/activate?token=valid-token');
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid activation token', async () => {
      const mockError = new Error('Invalid or expired token');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(authApi.activate('invalid-token')).rejects.toThrow('Invalid or expired token');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValue(undefined);

      await authApi.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('should handle logout error', async () => {
      const mockError = new Error('Logout failed');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(authApi.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('refresh', () => {
    it('should refresh token from localStorage', async () => {
      mockLocalStorage.setItem('rememberMe', 'true');
      mockLocalStorage.setItem('refreshToken', 'mock-refresh-token');

      const mockResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'admin',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.refresh();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'mock-refresh-token',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should refresh token from sessionStorage', async () => {
      mockSessionStorage.setItem('refreshToken', 'session-refresh-token');

      const mockResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'admin',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.refresh();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'session-refresh-token',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when no refresh token available', async () => {
      await expect(authApi.refresh()).rejects.toThrow('No refresh token available');
      expect(apiClient.post).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('should get current user information', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'admin',
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockUser);

      const result = await authApi.me();

      expect(apiClient.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });

    it('should handle unauthorized error', async () => {
      const mockError = new Error('Unauthorized');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(authApi.me()).rejects.toThrow('Unauthorized');
    });
  });

  describe('requestPasswordless', () => {
    it('should request passwordless login', async () => {
      const mockResponse = {
        message: 'Magic link sent to your email',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.requestPasswordless('test@example.com');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/passwordless/request', {
        email: 'test@example.com',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid email error', async () => {
      const mockError = new Error('Invalid email address');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(authApi.requestPasswordless('invalid-email')).rejects.toThrow('Invalid email address');
    });
  });

  describe('passwordlessCallback', () => {
    it('should complete passwordless login', async () => {
      const mockResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'user',
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authApi.passwordlessCallback('magic-token');

      expect(apiClient.get).toHaveBeenCalledWith('/auth/passwordless/callback?token=magic-token');
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid magic link token', async () => {
      const mockError = new Error('Invalid or expired magic link');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(authApi.passwordlessCallback('invalid-token')).rejects.toThrow('Invalid or expired magic link');
    });
  });

  describe('forgotPassword', () => {
    it('should request password reset', async () => {
      const mockResponse = {
        message: 'Password reset email sent',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.forgotPassword('test@example.com');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/forgot', { email: 'test@example.com' });
      expect(result).toEqual(mockResponse);
    });

    it('should handle user not found error', async () => {
      const mockError = new Error('User not found');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(authApi.forgotPassword('nonexistent@example.com')).rejects.toThrow('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const mockResponse = {
        message: 'Password reset successfully',
      };

      const resetData = {
        token: 'reset-token',
        password: 'newpassword123',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.resetPassword(resetData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/reset', resetData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid reset token', async () => {
      const mockError = new Error('Invalid or expired reset token');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const resetData = {
        token: 'invalid-token',
        password: 'newpassword123',
      };

      await expect(authApi.resetPassword(resetData)).rejects.toThrow('Invalid or expired reset token');
    });
  });

  describe('enable2FA', () => {
    it('should enable 2FA and return secret and QR code', async () => {
      const mockResponse = {
        secret: 'JBSWY3DPEHPK3PXP',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.enable2FA();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/2fa/enable');
      expect(result).toEqual(mockResponse);
    });

    it('should handle 2FA already enabled error', async () => {
      const mockError = new Error('2FA is already enabled');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(authApi.enable2FA()).rejects.toThrow('2FA is already enabled');
    });
  });

  describe('verify2FA', () => {
    it('should verify 2FA code successfully', async () => {
      const mockResponse = {
        message: '2FA verified successfully',
        success: true,
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authApi.verify2FA('123456');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/2fa/verify', { code: '123456' });
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid 2FA code', async () => {
      const mockError = new Error('Invalid 2FA code');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(authApi.verify2FA('000000')).rejects.toThrow('Invalid 2FA code');
    });
  });

  describe('OAuth redirects', () => {
    beforeEach(() => {
      delete (window as unknown as { location?: Location }).location;
      window.location = { href: '' } as unknown as Location;
    });

    it('should redirect to Google OAuth', () => {
      import.meta.env.VITE_API_URL = 'http://localhost:3000';
      authApi.googleLogin();
      expect(window.location.href).toBe('http://localhost:3000/api/v1/auth/google');
    });

    it('should redirect to Facebook OAuth', () => {
      import.meta.env.VITE_API_URL = 'http://localhost:3000';
      authApi.facebookLogin();
      expect(window.location.href).toBe('http://localhost:3000/api/v1/auth/facebook');
    });
  });
});
