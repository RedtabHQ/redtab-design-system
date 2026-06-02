/**
 * Storage Keys Configuration
 * Centralized storage key definitions for auth-related data
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  REMEMBER_ME: 'rememberMe',

  // Legacy keys for backward compatibility migration
  LEGACY_ACCESS_TOKEN: 'access_token',
  LEGACY_REFRESH_TOKEN: 'refresh_token',
  LEGACY_REMEMBER_ME: 'remember_me',
} as const;

/**
 * Migrate legacy snake_case localStorage keys to camelCase
 *
 * This function should be called once on app initialization to migrate
 * existing users' storage keys from the old snake_case format to the new camelCase format.
 *
 * @example
 * ```typescript
 * // In App.tsx
 * useEffect(() => {
 *   migrateStorageKeys();
 * }, []);
 * ```
 */
export function migrateStorageKeys(): void {
  const storages: Storage[] = [localStorage, sessionStorage];

  storages.forEach((storage) => {
    // Migrate access_token -> accessToken
    const oldAccessToken = storage.getItem(STORAGE_KEYS.LEGACY_ACCESS_TOKEN);
    if (oldAccessToken && !storage.getItem(STORAGE_KEYS.ACCESS_TOKEN)) {
      storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, oldAccessToken);
      storage.removeItem(STORAGE_KEYS.LEGACY_ACCESS_TOKEN);
    }

    // Migrate refresh_token -> refreshToken
    const oldRefreshToken = storage.getItem(STORAGE_KEYS.LEGACY_REFRESH_TOKEN);
    if (oldRefreshToken && !storage.getItem(STORAGE_KEYS.REFRESH_TOKEN)) {
      storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, oldRefreshToken);
      storage.removeItem(STORAGE_KEYS.LEGACY_REFRESH_TOKEN);
    }

    // Migrate remember_me -> rememberMe
    const oldRememberMe = storage.getItem(STORAGE_KEYS.LEGACY_REMEMBER_ME);
    if (oldRememberMe && !storage.getItem(STORAGE_KEYS.REMEMBER_ME)) {
      storage.setItem(STORAGE_KEYS.REMEMBER_ME, oldRememberMe);
      storage.removeItem(STORAGE_KEYS.LEGACY_REMEMBER_ME);
    }
  });
}

/**
 * Get token with fallback to legacy key for backward compatibility
 *
 * @param storage - Storage object (localStorage or sessionStorage)
 * @param key - Token key ('accessToken' or 'refreshToken')
 * @returns Token value or null
 */
export function getTokenWithFallback(
  storage: Storage,
  key: 'accessToken' | 'refreshToken'
): string | null {
  const newKey = key === 'accessToken' ? STORAGE_KEYS.ACCESS_TOKEN : STORAGE_KEYS.REFRESH_TOKEN;
  const legacyKey = key === 'accessToken'
    ? STORAGE_KEYS.LEGACY_ACCESS_TOKEN
    : STORAGE_KEYS.LEGACY_REFRESH_TOKEN;

  return storage.getItem(newKey) || storage.getItem(legacyKey);
}

/**
 * Check if user has old storage keys (for migration notice)
 *
 * @returns True if old keys are detected
 */
export function hasLegacyStorageKeys(): boolean {
  return !!(
    localStorage.getItem(STORAGE_KEYS.LEGACY_ACCESS_TOKEN) ||
    sessionStorage.getItem(STORAGE_KEYS.LEGACY_ACCESS_TOKEN) ||
    localStorage.getItem(STORAGE_KEYS.LEGACY_REFRESH_TOKEN) ||
    sessionStorage.getItem(STORAGE_KEYS.LEGACY_REFRESH_TOKEN)
  );
}
