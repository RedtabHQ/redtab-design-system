import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enCommon from '@/locales/en/common.json';
import enNavigation from '@/locales/en/navigation.json';
import enAuth from '@/locales/en/auth.json';
import enValidation from '@/locales/en/validation.json';
import enDashboard from '@/locales/en/dashboard.json';
import enMerchants from '@/locales/en/merchants.json';
import enSuppliers from '@/locales/en/suppliers.json';
import enContracts from '@/locales/en/contracts.json';
import enAdmin from '@/locales/en/admin.json';
import enWorkbench from '@/locales/en/workbench.json';
import enAudit from '@/locales/en/audit.json';
import enPayment from '@/locales/en/payment.json';
import enDeveloper from '@/locales/en/developer.json';
import enErrors from '@/locales/en/errors.json';

// Import Vietnamese translations
import viCommon from '@/locales/vi/common.json';
import viNavigation from '@/locales/vi/navigation.json';
import viAuth from '@/locales/vi/auth.json';
import viValidation from '@/locales/vi/validation.json';
import viDashboard from '@/locales/vi/dashboard.json';
import viMerchants from '@/locales/vi/merchants.json';
import viSuppliers from '@/locales/vi/suppliers.json';
import viContracts from '@/locales/vi/contracts.json';
import viAdmin from '@/locales/vi/admin.json';
import viWorkbench from '@/locales/vi/workbench.json';
import viAudit from '@/locales/vi/audit.json';
import viPayment from '@/locales/vi/payment.json';
import viDeveloper from '@/locales/vi/developer.json';
import viErrors from '@/locales/vi/errors.json';

// Import Nepali translations
import neCommon from '@/locales/ne/common.json';
import neNavigation from '@/locales/ne/navigation.json';
import neAuth from '@/locales/ne/auth.json';
import neValidation from '@/locales/ne/validation.json';
import neDashboard from '@/locales/ne/dashboard.json';
import neMerchants from '@/locales/ne/merchants.json';
import neSuppliers from '@/locales/ne/suppliers.json';
import neContracts from '@/locales/ne/contracts.json';
import neAdmin from '@/locales/ne/admin.json';
import neWorkbench from '@/locales/ne/workbench.json';
import neAudit from '@/locales/ne/audit.json';
import nePayment from '@/locales/ne/payment.json';
import neDeveloper from '@/locales/ne/developer.json';
import neErrors from '@/locales/ne/errors.json';

export const SUPPORTED_LANGUAGES = ['en', 'vi', 'ne'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_CONFIG: Record<
  SupportedLanguage,
  { name: string; nativeName: string; flag: string }
> = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  ne: { name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    auth: enAuth,
    validation: enValidation,
    dashboard: enDashboard,
    merchants: enMerchants,
    suppliers: enSuppliers,
    contracts: enContracts,
    admin: enAdmin,
    workbench: enWorkbench,
    audit: enAudit,
    payment: enPayment,
    developer: enDeveloper,
    errors: enErrors,
  },
  vi: {
    common: viCommon,
    navigation: viNavigation,
    auth: viAuth,
    validation: viValidation,
    dashboard: viDashboard,
    merchants: viMerchants,
    suppliers: viSuppliers,
    contracts: viContracts,
    admin: viAdmin,
    workbench: viWorkbench,
    audit: viAudit,
    payment: viPayment,
    developer: viDeveloper,
    errors: viErrors,
  },
  ne: {
    common: neCommon,
    navigation: neNavigation,
    auth: neAuth,
    validation: neValidation,
    dashboard: neDashboard,
    merchants: neMerchants,
    suppliers: neSuppliers,
    contracts: neContracts,
    admin: neAdmin,
    workbench: neWorkbench,
    audit: neAudit,
    payment: nePayment,
    developer: neDeveloper,
    errors: neErrors,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'preferredLanguage',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    ns: [
      'common',
      'navigation',
      'auth',
      'validation',
      'dashboard',
      'merchants',
      'suppliers',
      'contracts',
      'admin',
      'workbench',
      'audit',
      'payment',
      'developer',
      'errors',
    ],
    defaultNS: 'common',
  });

export default i18n;
