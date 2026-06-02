import { apiClient } from '@/lib/api';
import { authStorage } from '@/utils/storage';
import type { User, AuthToken } from '@types';

export interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  requires2FA?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  role?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface PasswordlessRequestData {
  email: string;
}

export interface PasswordlessRequestResponse {
  message: string;
}

export interface PasswordlessCallbackResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface Enable2FAResponse {
  secret: string;
  qrCode: string;
}

export interface Verify2FAData {
  code: string;
}

export interface Verify2FAResponse {
  message: string;
  success: boolean;
}

export interface ActivateAccountResponse {
  message: string;
  user: User;
}

export const authApi = {
  /**
   * Login with email and password
   * @param email - User email
   * @param password - User password
   * @param twoFactorCode - Optional 2FA code
   * @returns Promise with access token, refresh token, and user data
   */
  async login(email: string, password: string, twoFactorCode?: string): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', {
      username: email, // support email / username together
      password,
      twoFactorCode,
    });
  },

  /**
   * Register a new user
   * @param data - Registration data
   * @returns Promise with registration response
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  },

  /**
   * Activate user account with token
   * @param token - Activation token from email
   * @returns Promise with activation response
   */
  async activate(token: string): Promise<ActivateAccountResponse> {
    return apiClient.get<ActivateAccountResponse>(`/auth/activate?token=${token}`);
  },

  /**
   * Logout the current user
   * @returns Promise that resolves when logout is complete
   */
  async logout(): Promise<void> {
    await apiClient.post<void>('/auth/logout');
  },

  /**
   * Refresh the access token using refresh token
   * @returns Promise with new access token
   */
  async refresh(): Promise<RefreshTokenResponse> {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
  },

  /**
   * Get current user information
   * @returns Promise with user data
   */
  async me(): Promise<User> {
    return apiClient.get<User>('/users/me');
  },

  /**
   * Request passwordless magic link
   * @param email - User email
   * @returns Promise with request response
   */
  async requestPasswordless(email: string): Promise<PasswordlessRequestResponse> {
    return apiClient.post<PasswordlessRequestResponse>('/auth/passwordless/request', {
      email,
    });
  },

  /**
   * Login via passwordless magic link
   * @param token - Magic link token
   * @returns Promise with access token, refresh token, and user data
   */
  async passwordlessCallback(token: string): Promise<PasswordlessCallbackResponse> {
    return apiClient.get<PasswordlessCallbackResponse>(
      `/auth/passwordless/callback?token=${token}`
    );
  },

  /**
   * Request password reset
   * @param email - User email
   * @returns Promise with forgot password response
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/auth/forgot', { email });
  },

  /**
   * Reset password with token
   * @param data - Reset password data
   * @returns Promise with reset password response
   */
  async resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
    return apiClient.post<ResetPasswordResponse>('/auth/reset', data);
  },

  /**
   * Enable two-factor authentication
   * @returns Promise with 2FA secret and QR code
   */
  async enable2FA(): Promise<Enable2FAResponse> {
    return apiClient.post<Enable2FAResponse>('/auth/2fa/enable');
  },

  /**
   * Verify two-factor authentication code
   * @param code - 2FA code
   * @returns Promise with verification response
   */
  async verify2FA(code: string): Promise<Verify2FAResponse> {
    return apiClient.post<Verify2FAResponse>('/auth/2fa/verify', { code });
  },

  /**
   * Initiate Google OAuth login
   * @returns Redirects to Google OAuth page
   */
  googleLogin(): void {
    const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
    window.location.href = `${apiUrl}/api/v1/auth/google`;
  },

  /**
   * Initiate Facebook OAuth login
   * @returns Redirects to Facebook OAuth page
   */
  facebookLogin(): void {
    const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
    window.location.href = `${apiUrl}/api/v1/auth/facebook`;
  },
};
