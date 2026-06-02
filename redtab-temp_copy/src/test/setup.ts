import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import English translations for testing
import commonEn from '@/locales/en/common.json';
import navigationEn from '@/locales/en/navigation.json';
import authEn from '@/locales/en/auth.json';
import validationEn from '@/locales/en/validation.json';
import dashboardEn from '@/locales/en/dashboard.json';
import merchantsEn from '@/locales/en/merchants.json';
import suppliersEn from '@/locales/en/suppliers.json';
import contractsEn from '@/locales/en/contracts.json';
import adminEn from '@/locales/en/admin.json';
import workbenchEn from '@/locales/en/workbench.json';
import auditEn from '@/locales/en/audit.json';
import paymentEn from '@/locales/en/payment.json';
import developerEn from '@/locales/en/developer.json';
import errorsEn from '@/locales/en/errors.json';

// Initialize i18next for testing synchronously
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
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
  initImmediate: false, // Ensure synchronous initialization
  resources: {
    en: {
      common: commonEn,
      navigation: navigationEn,
      auth: authEn,
      validation: validationEn,
      dashboard: dashboardEn,
      merchants: merchantsEn,
      suppliers: suppliersEn,
      contracts: contractsEn,
      admin: adminEn,
      workbench: workbenchEn,
      audit: auditEn,
      payment: paymentEn,
      developer: developerEn,
      errors: errorsEn,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Cleanup after each test case
afterEach(() => {
  cleanup();
  localStorageMock.clear();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver implements globalThis.IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver implements globalThis.ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
