/**
 * Safe localStorage wrapper that handles SSR and errors gracefully
 */
export const safeStorage = {
  /**
   * Get item from localStorage
   * @param key - Storage key
   * @returns Value or null if not found or error occurs
   */
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`localStorage.getItem failed for key: ${key}`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage
   * @param key - Storage key
   * @param value - Value to store
   */
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`localStorage.setItem failed for key: ${key}`, error);
    }
  },

  /**
   * Remove item from localStorage
   * @param key - Storage key
   */
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`localStorage.removeItem failed for key: ${key}`, error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear: (): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('localStorage.clear failed', error);
    }
  },
};

/**
 * Auth-specific storage utilities
 * Handles localStorage/sessionStorage selection based on rememberMe flag
 */
export const authStorage = {
  /**
   * Determines which storage to use (localStorage or sessionStorage)
   * based on the rememberMe flag stored in browser storage
   *
   * @returns {Storage} localStorage if rememberMe=true, else sessionStorage
   */
  getStorage: (): Storage => {
    const rememberMe =
      localStorage.getItem('rememberMe') === 'true' ||
      sessionStorage.getItem('rememberMe') === 'true';
    return rememberMe ? localStorage : sessionStorage;
  },

  /**
   * Gets access token from the correct storage
   * @returns {string | null} Access token or null if not found
   */
  getAccessToken: (): string | null => {
    const storage = authStorage.getStorage();
    return storage.getItem('accessToken');
  },

  /**
   * Gets refresh token from the correct storage
   * @returns {string | null} Refresh token or null if not found
   */
  getRefreshToken: (): string | null => {
    const storage = authStorage.getStorage();
    return storage.getItem('refreshToken');
  },

  /**
   * Sets both tokens in the correct storage
   * @param accessToken - New access token
   * @param refreshToken - New refresh token
   */
  setTokens: (accessToken: string, refreshToken: string): void => {
    const storage = authStorage.getStorage();
    storage.setItem('accessToken', accessToken);
    storage.setItem('refreshToken', refreshToken);
  },

  /**
   * Clears all auth-related items from both storages (for logout)
   */
  clearAll: (): void => {
    const keysToRemove = ['accessToken', 'refreshToken', 'user', 'rememberMe'];
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  },

  /**
   * Checks if user is authenticated (has valid access token)
   * @returns {boolean} True if access token exists
   */
  isAuthenticated: (): boolean => {
    return !!authStorage.getAccessToken();
  },

  /**
   * Gets current storage type being used
   * @returns {'localStorage' | 'sessionStorage'} Current storage type
   */
  getStorageType: (): 'localStorage' | 'sessionStorage' => {
    const rememberMe =
      localStorage.getItem('rememberMe') === 'true' ||
      sessionStorage.getItem('rememberMe') === 'true';
    return rememberMe ? 'localStorage' : 'sessionStorage';
  },
};
