import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n, {
  type SupportedLanguage,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
} from '@/lib/i18n';
import { apiClient } from '@/lib/api';

interface LanguageState {
  language: SupportedLanguage;
  isLoading: boolean;
}

interface LanguageActions {
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  syncWithServer: (userId: string) => Promise<void>;
  initializeLanguage: (userPreference?: string | null) => void;
}

type LanguageStore = LanguageState & LanguageActions;

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: DEFAULT_LANGUAGE,
      isLoading: false,

      setLanguage: async (language: SupportedLanguage) => {
        set({ isLoading: true });

        try {
          // Change i18n language
          await i18n.changeLanguage(language);

          // Update state
          set({ language, isLoading: false });
        } catch (error) {
          console.error('[LanguageStore] Failed to change language:', error);
          set({ isLoading: false });
        }
      },

      syncWithServer: async (userId: string) => {
        const { language } = get();

        try {
          await apiClient.patch(`/users/${userId}/settings`, {
            preferredLanguage: language,
          });
          console.log('[LanguageStore] Language synced with server:', language);
        } catch (error) {
          console.error('[LanguageStore] Failed to sync language with server:', error);
        }
      },

      initializeLanguage: (userPreference?: string | null) => {
        // If user has a saved preference, use it
        if (
          userPreference &&
          SUPPORTED_LANGUAGES.includes(userPreference as SupportedLanguage)
        ) {
          i18n.changeLanguage(userPreference);
          set({ language: userPreference as SupportedLanguage });
          return;
        }

        // Otherwise, use the stored language from localStorage (via persist)
        const storedLanguage = get().language;
        if (storedLanguage && storedLanguage !== i18n.language) {
          i18n.changeLanguage(storedLanguage);
        }
      },
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({ language: state.language }),
    }
  )
);
