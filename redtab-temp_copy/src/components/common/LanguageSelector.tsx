import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores';
import { useCurrentUser } from '@/features/auth/hooks';
import {
  LANGUAGE_CONFIG,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@/lib/i18n';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full';
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'full',
  showLabel = true,
}) => {
  const { t } = useTranslation('admin');
  const { language, setLanguage, syncWithServer, isLoading } = useLanguageStore();
  const user = useCurrentUser();

  const handleLanguageChange = async (newLang: SupportedLanguage) => {
    if (newLang === language || isLoading) return;

    await setLanguage(newLang);

    // Sync with server if user is logged in
    if (user?.id) {
      await syncWithServer(user.id);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              language === lang
                ? 'bg-redtab text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {LANGUAGE_CONFIG[lang].flag}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showLabel && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">
              {t('language.title')}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {t('language.description')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const config = LANGUAGE_CONFIG[lang];
          const isSelected = language === lang;

          return (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              disabled={isLoading}
              className={`relative p-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'border-redtab bg-red-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <Check size={16} className="text-redtab" />
                </div>
              )}

              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">{config.flag}</span>
                <div className="text-center">
                  <p
                    className={`text-sm font-bold ${
                      isSelected ? 'text-redtab' : 'text-gray-900'
                    }`}
                  >
                    {config.nativeName}
                  </p>
                  <p className="text-2xs text-gray-500 uppercase tracking-wide">
                    {config.name}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
