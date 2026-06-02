import { vi } from 'vitest';

// Mock axios
export const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  create: vi.fn(() => mockAxios),
  defaults: {
    headers: {
      common: {},
    },
  },
  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn(),
    },
    response: {
      use: vi.fn(),
      eject: vi.fn(),
    },
  },
};

// Mock localStorage
export const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

// Mock sessionStorage
export const mockSessionStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

// Setup global mocks
export const setupGlobalMocks = () => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
  });
};

// Mock data factories
export const createMockMerchant = (overrides = {}) => ({
  id: '1',
  name: 'Test Merchant',
  email: 'merchant@test.com',
  phone: '+1234567890',
  status: 'active',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'user@test.com',
  name: 'Test User',
  role: 'admin',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockContract = (overrides = {}) => ({
  id: '1',
  merchantId: '1',
  amount: 10000,
  status: 'active',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockPayment = (overrides = {}) => ({
  id: '1',
  contractId: '1',
  amount: 1000,
  status: 'completed',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockDashboardStats = (overrides = {}) => ({
  totalMerchants: 100,
  activeContracts: 50,
  totalRevenue: 1000000,
  pendingPayments: 10,
  ...overrides,
});
