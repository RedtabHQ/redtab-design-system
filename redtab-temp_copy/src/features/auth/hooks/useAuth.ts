import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { useAuthStore } from '@stores';
import { authApi, type RegisterData, type ResetPasswordData } from '@services';
import type { User } from '@types';

/**
 * Hook for login mutation
 *
 * Automatically updates auth store on success
 *
 * @returns Mutation object for login
 *
 * @example
 * ```tsx
 * const login = useLogin();
 *
 * login.mutate({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   twoFactorCode: '123456', // Optional
 * }, {
 *   onSuccess: () => {
 *     navigate('/dashboard');
 *   },
 *   onError: (error) => {
 *     toast.error('Login failed');
 *   },
 * });
 * ```
 */
export function useLogin() {
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password, twoFactorCode, rememberMe }: {
      email: string;
      password: string;
      twoFactorCode?: string;
      rememberMe?: boolean;
    }) =>
      storeLogin(email, password, twoFactorCode, rememberMe),
    // No need to update store manually - the store's login function handles it
  });
}

/**
 * Hook for user registration
 *
 * @example
 * ```tsx
 * const register = useRegister();
 *
 * register.mutate({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   username: 'johndoe',
 * }, {
 *   onSuccess: () => {
 *     toast.success('Registration successful! Check your email to activate your account.');
 *   },
 * });
 * ```
 */
export function useRegister(
  options?: Omit<UseMutationOptions<unknown, Error, RegisterData>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    ...options,
  });
}

/**
 * Hook for account activation
 *
 * @example
 * ```tsx
 * const activate = useActivateAccount();
 *
 * activate.mutate(token, {
 *   onSuccess: () => {
 *     toast.success('Account activated successfully!');
 *     navigate('/login');
 *   },
 * });
 * ```
 */
export function useActivateAccount(
  options?: Omit<UseMutationOptions<unknown, Error, string>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (token: string) => authApi.activate(token),
    ...options,
  });
}

/**
 * Hook for requesting passwordless magic link
 *
 * @example
 * ```tsx
 * const requestPasswordless = useRequestPasswordless();
 *
 * requestPasswordless.mutate('user@example.com', {
 *   onSuccess: () => {
 *     toast.success('Check your email for the magic link!');
 *   },
 * });
 * ```
 */
export function useRequestPasswordless(
  options?: Omit<UseMutationOptions<unknown, Error, string>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (email: string) => authApi.requestPasswordless(email),
    ...options,
  });
}

/**
 * Hook for passwordless login callback
 *
 * @example
 * ```tsx
 * const passwordlessCallback = usePasswordlessCallback();
 *
 * passwordlessCallback.mutate(token, {
 *   onSuccess: (data) => {
 *     // Store tokens and user
 *     navigate('/dashboard');
 *   },
 * });
 * ```
 */
export function usePasswordlessCallback(
  options?: Omit<UseMutationOptions<unknown, Error, string>, 'mutationFn'>
) {
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (token: string) => authApi.passwordlessCallback(token),
    onSuccess: (data: unknown) => {
      const response = data as { accessToken: string; refreshToken: string; user: User };
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
    },
    ...options,
  });
}

/**
 * Hook for forgot password request
 *
 * @example
 * ```tsx
 * const forgotPassword = useForgotPassword();
 *
 * forgotPassword.mutate('user@example.com', {
 *   onSuccess: () => {
 *     toast.success('Password reset link sent to your email!');
 *   },
 * });
 * ```
 */
export function useForgotPassword(
  options?: Omit<UseMutationOptions<unknown, Error, string>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    ...options,
  });
}

/**
 * Hook for password reset
 *
 * @example
 * ```tsx
 * const resetPassword = useResetPassword();
 *
 * resetPassword.mutate({
 *   token: 'reset-token',
 *   password: 'newPassword123',
 * }, {
 *   onSuccess: () => {
 *     toast.success('Password reset successful!');
 *     navigate('/login');
 *   },
 * });
 * ```
 */
export function useResetPassword(
  options?: Omit<UseMutationOptions<unknown, Error, ResetPasswordData>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
    ...options,
  });
}

/**
 * Hook for enabling 2FA
 *
 * @example
 * ```tsx
 * const enable2FA = useEnable2FA();
 *
 * enable2FA.mutate(undefined, {
 *   onSuccess: (data) => {
 *     // Display QR code from data.qrCode
 *     // Save secret: data.secret
 *   },
 * });
 * ```
 */
export function useEnable2FA(
  options?: Omit<UseMutationOptions<unknown, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: () => authApi.enable2FA(),
    ...options,
  });
}

/**
 * Hook for verifying 2FA code
 *
 * @example
 * ```tsx
 * const verify2FA = useVerify2FA();
 *
 * verify2FA.mutate('123456', {
 *   onSuccess: () => {
 *     toast.success('2FA enabled successfully!');
 *   },
 * });
 * ```
 */
export function useVerify2FA(
  options?: Omit<UseMutationOptions<unknown, Error, string>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (code: string) => authApi.verify2FA(code),
    ...options,
  });
}

/**
 * Hook for logout mutation
 *
 * Automatically clears auth store and query cache on success
 *
 * @returns Mutation object for logout
 *
 * @example
 * ```tsx
 * const logout = useLogout();
 *
 * logout.mutate(undefined, {
 *   onSuccess: () => {
 *     navigate('/login');
 *   },
 * });
 * ```
 */
export function useLogout() {
  const { logout: storeLogout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => storeLogout(),
    onSuccess: () => {
      // Clear all cached queries on logout
      queryClient.clear();
    },
  });
}

/**
 * Hook for token refresh mutation
 *
 * @returns Mutation object for token refresh
 *
 * @example
 * ```tsx
 * const refreshToken = useRefreshToken();
 *
 * refreshToken.mutate();
 * ```
 */
export function useRefreshToken() {
  const { refreshAccessToken } = useAuthStore();

  return useMutation({
    mutationFn: () => refreshAccessToken(),
  });
}

/**
 * Get current user from auth store
 *
 * This is a convenience wrapper that returns the current user
 * from the Zustand store, not a React Query hook.
 *
 * @returns Current user or null
 *
 * @example
 * ```tsx
 * const user = useCurrentUser();
 *
 * if (!user) {
 *   return <Navigate to="/login" />;
 * }
 * ```
 */
export function useCurrentUser(): User | null {
  return useAuthStore((state) => state.user);
}

/**
 * Check if user is authenticated
 *
 * @returns boolean indicating authentication status
 *
 * @example
 * ```tsx
 * const isAuthenticated = useIsAuthenticated();
 *
 * if (!isAuthenticated) {
 *   return <Navigate to="/login" />;
 * }
 * ```
 */
export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.isAuthenticated);
}
