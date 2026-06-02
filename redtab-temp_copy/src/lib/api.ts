import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { authStorage } from '@/utils/storage';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || '') {
    // If baseURL is empty, use relative URLs (works with Vite proxy in dev)
    // Otherwise, use the provided baseURL (for production)
    const apiBase = baseURL ? `${baseURL}/api/v1` : '/api/v1';

    this.client = axios.create({
      baseURL: apiBase,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.startTokenRefreshScheduler();
  }

  private setupInterceptors() {
    // Request interceptor: add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = authStorage.getAccessToken();
        const storageType = authStorage.getStorageType();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          // Debug: log token state for troubleshooting
          if (config.url?.includes('/auth/')) {
            console.debug('[Auth] Token attached to request', {
              url: config.url,
              tokenLength: token.length,
              storage: storageType
            });
          }
        } else {
          console.warn('[Auth] No token found in storage', {
            url: config.url,
            storage: storageType
          });
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: handle errors and refresh token
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError<{ message?: string | string[]; error?: string; statusCode?: number }>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Exclude all /auth endpoints except /auth/refresh from token refresh retry
        const isAuthEndpoint = originalRequest.url?.includes('/auth/');
        const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');
        const shouldSkipTokenRefresh = isAuthEndpoint && !isRefreshEndpoint;

        // Handle 401 and 403 with "Authentication required": Logout immediately, no retry
        // 401 means token is invalid/expired/missing
        // 403 with "Authentication required" means PermissionGuard detected missing user
        const isAuthError = error.response?.status === 401 ||
                           (error.response?.status === 403 &&
                            error.response?.data?.message?.includes('Authentication required'));

        if (isAuthError && !shouldSkipTokenRefresh) {
          console.warn('[Auth] Authentication failed - logging out', {
            status: error.response?.status,
            message: error.response?.data?.message,
          });

          // Clear all auth state
          authStorage.clearAll();

          // Redirect to login page
          window.location.href = '/login';

          return Promise.reject(error);
        }

        // Format error message properly for the UI
        const errorData = error.response?.data;

        // Handle both string and array messages from NestJS
        let errorMessage: string;
        if (Array.isArray(errorData?.message)) {
          // Validation errors - join multiple messages
          errorMessage = errorData.message.join(', ');
        } else {
          // Single error message
          errorMessage = errorData?.message || errorData?.error || error.message || 'An error occurred';
        }

        // Create enhanced error object with proper typing
        interface ApiError extends Error {
          status?: number;
          statusCode?: number;
          data?: unknown;
          isValidationError?: boolean;
          validationErrors?: string[];
        }

        const formattedError: ApiError = new Error(errorMessage);
        formattedError.status = error.response?.status;
        formattedError.statusCode = errorData?.statusCode;
        formattedError.data = errorData;
        formattedError.isValidationError = Array.isArray(errorData?.message);
        formattedError.validationErrors = Array.isArray(errorData?.message) ? errorData.message : undefined;

        throw formattedError;
      }
    );
  }

  /**
   * Decode JWT token to get expiration time
   */
  private decodeToken(token: string): { exp?: number } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('[Auth] Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Schedule proactive token refresh before expiration
   */
  private startTokenRefreshScheduler() {
    // Check token expiration every 5 seconds
    this.tokenRefreshTimer = setInterval(() => {
      const token = authStorage.getAccessToken();
      if (!token) {
        return;
      }

      const decoded = this.decodeToken(token);
      if (!decoded?.exp) {
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - now;

      // Refresh token proactively 5 seconds before expiration
      // For 30s tokens, this means refresh at 25s mark
      if (expiresIn <= 5 && expiresIn > 0) {
        console.log('[Auth] Token expiring soon, refreshing proactively...', {
          expiresIn: `${expiresIn}s`,
        });
        this.refreshTokenProactively();
      }
    }, 5000);
  }

  /**
   * Proactively refresh token before expiration
   */
  private async refreshTokenProactively() {
    if (this.isRefreshing) {
      console.log('[Auth] Refresh already in progress, skipping proactive refresh');
      return;
    }

    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) {
      console.warn('[Auth] No refresh token available for proactive refresh');
      return;
    }

    this.isRefreshing = true;

    try {
      const response = await axios.post(
        `${this.client.defaults.baseURL}/auth/refresh`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data || response.data;
      authStorage.setTokens(accessToken, newRefreshToken);

      console.log('[Auth] Token refreshed proactively');
    } catch (error) {
      console.error('[Auth] Proactive token refresh failed:', error instanceof Error ? error.message : String(error));

      // If proactive refresh fails with 401, logout immediately
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn('[Auth] Refresh token invalid - logging out');
        authStorage.clearAll();
        window.location.href = '/login';
      }
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Stop token refresh scheduler (useful for cleanup)
   */
  public stopTokenRefreshScheduler() {
    if (this.tokenRefreshTimer) {
      clearInterval(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get<T>(url, config) as Promise<T>;
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post<T>(url, data, config) as Promise<T>;
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put<T>(url, data, config) as Promise<T>;
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete<T>(url, config) as Promise<T>;
  }

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch<T>(url, data, config) as Promise<T>;
  }
}

export const apiClient = new ApiClient();
