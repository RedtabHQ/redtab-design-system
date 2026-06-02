import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@types';
import { authApi } from '@/features/auth/services/authApi';
import { authStorage } from '@/utils/storage';
import { useLanguageStore } from './languageStore';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  rememberMe: boolean; // Track if user chose to stay logged in
}

interface AuthActions {
  login: (email: string, password: string, twoFactorCode?: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: true, // Default to true

      // Actions
      login: async (email: string, password: string, twoFactorCode?: string, rememberMe: boolean = true) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password, twoFactorCode);

          // Choose storage based on rememberMe flag
          const storage = rememberMe ? localStorage : sessionStorage;

          // Store tokens in chosen storage
          storage.setItem('accessToken', response.accessToken);
          storage.setItem('refreshToken', response.refreshToken);
          storage.setItem('user', JSON.stringify(response.user));

          // Also store rememberMe flag to know which storage to use later
          storage.setItem('rememberMe', String(rememberMe));

          console.log('[AuthStore] Login successful', {
            storage: rememberMe ? 'localStorage' : 'sessionStorage',
            user: response.user.id,
            accessTokenLength: response.accessToken.length,
            refreshTokenLength: response.refreshToken.length
          });

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            rememberMe,
          });

          // Initialize language from user preference
          if (response.user.preferredLanguage) {
            useLanguageStore.getState().initializeLanguage(response.user.preferredLanguage);
          }

          // WebSocket connection is handled by useNotifications hook
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          // Call logout API
          await authApi.logout();
        } catch (error) {
          console.error('Logout API error:', error);
          // Continue with local logout even if API fails
        } finally {
          // Clear tokens from BOTH localStorage and sessionStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('rememberMe');

          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('rememberMe');

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            rememberMe: true, // Reset to default
          });
        }
      },

      refreshAccessToken: async () => {
        try {
          console.log('[AuthStore] Refreshing token...');

          const response = await authApi.refresh();

          // Use authStorage utility to set tokens in correct storage
          authStorage.setTokens(response.accessToken, response.refreshToken);

          const storage = authStorage.getStorage();
          storage.setItem('user', JSON.stringify(response.user));

          console.log('[AuthStore] Token refreshed', {
            storage: authStorage.getStorageType(),
            newAccessTokenLength: response.accessToken.length
          });

          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user,
          });

          // Initialize language from user preference on refresh
          if (response.user.preferredLanguage) {
            useLanguageStore.getState().initializeLanguage(response.user.preferredLanguage);
          }
        } catch (error) {
          console.error('[AuthStore] Token refresh failed:', error instanceof Error ? error.message : String(error));
          // If refresh fails, logout the user
          get().logout();
          throw error;
        }
      },

      setUser: (user: User | null) => {
        // Use authStorage utility to store in correct storage (localStorage or sessionStorage)
        const storage = authStorage.getStorage();
        if (user) {
          storage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
          sessionStorage.removeItem('user');
        }
        set({ user });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        // Store tokens in the correct storage
        authStorage.setTokens(accessToken, refreshToken);
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthStore) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
