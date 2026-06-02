import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSupplierDirectory } from './useSupplierDirectory';
import { useSuppliers } from '@/features/suppliers/hooks';
import type { Supplier } from '@types';
import { SettlementMode } from '@types';

// Mock the useSuppliers hook
vi.mock('@/features/suppliers/hooks');

const mockUseSuppliers = vi.mocked(useSuppliers);

interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// Helper to create mock responses with proper types
function createMockQueryResult<T>(
  data: T | undefined,
  overrides?: Partial<UseQueryResult<T>>
): UseQueryResult<T> {
  return {
    data,
    isLoading: false,
    isError: false,
    error: null,
    ...overrides,
  };
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Test Supplier 1',
    category: 'Category A',
    isVerified: true,
    bankAccount: '1234567890',
    contactPerson: 'John Doe',
    email: 'john@example.com',
    phone: '555-0001',
    onboardingDate: '2024-01-01',
    paymentTermDays: 30,
    supplierFeeRate: 0.05,
    settlementMode: SettlementMode.BATCHED,
    currency: 'USD',
  },
  {
    id: '2',
    name: 'Test Supplier 2',
    category: 'Category B',
    isVerified: true,
    bankAccount: '0987654321',
    contactPerson: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-0002',
    onboardingDate: '2024-01-02',
    paymentTermDays: 60,
    supplierFeeRate: 0.03,
    settlementMode: SettlementMode.REAL_TIME,
    currency: 'EUR',
  },
];

describe('useSupplierDirectory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return suppliers from API response', async () => {
    const mockResponse: UseQueryResult<PaginatedResponse<Supplier>> = {
      data: {
        items: mockSuppliers,
        meta: {
          total: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    };
    mockUseSuppliers.mockReturnValue(mockResponse);

    const { result } = renderHook(() => useSupplierDirectory());

    await waitFor(() => {
      expect(result.current.suppliers).toEqual(mockSuppliers);
    });
  });

  it('should handle loading state', () => {
    mockUseSuppliers.mockReturnValue(
      createMockQueryResult<PaginatedResponse<Supplier>>(undefined, {
        isLoading: true,
      })
    );

    const { result } = renderHook(() => useSupplierDirectory());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.suppliers).toEqual([]);
  });

  it('should handle error state', () => {
    const mockError = new Error('API Error');
    mockUseSuppliers.mockReturnValue(
      createMockQueryResult<PaginatedResponse<Supplier>>(undefined, {
        isError: true,
        error: mockError,
      })
    );

    const { result } = renderHook(() => useSupplierDirectory());

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
  });

  it('should calculate pagination correctly', () => {
    const paginatedResponse: PaginatedResponse<Supplier> = {
      items: mockSuppliers,
      meta: {
        total: 25,
        page: 1,
        pageSize: 10,
        totalPages: 3,
      },
    };
    mockUseSuppliers.mockReturnValue(
      createMockQueryResult<PaginatedResponse<Supplier>>(paginatedResponse)
    );

    const { result } = renderHook(() => useSupplierDirectory({ pageSize: 10 }));

    expect(result.current.total).toBe(25);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.pageSize).toBe(10);
  });

  it('should reset page to 1 when search term changes', async () => {
    const paginatedResponse: PaginatedResponse<Supplier> = {
      items: mockSuppliers,
      meta: {
        total: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    };
    mockUseSuppliers.mockReturnValue(
      createMockQueryResult<PaginatedResponse<Supplier>>(paginatedResponse)
    );

    const { result } = renderHook(() => useSupplierDirectory());

    // Change to page 3
    act(() => {
      result.current.setCurrentPage(3);
    });

    expect(result.current.currentPage).toBe(3);

    // Change search term
    act(() => {
      result.current.setSearchTerm('test');
    });

    // Should reset to page 1
    expect(result.current.currentPage).toBe(1);
  });

  it('should respect initial pageSize option', () => {
    const paginatedResponse: PaginatedResponse<Supplier> = {
      items: mockSuppliers,
      meta: {
        total: 2,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      },
    };
    mockUseSuppliers.mockReturnValue(
      createMockQueryResult<PaginatedResponse<Supplier>>(paginatedResponse)
    );

    const { result } = renderHook(() => useSupplierDirectory({ pageSize: 20 }));

    expect(result.current.pageSize).toBe(20);
  });

  it('should allow changing page size', async () => {
    const paginatedResponse: PaginatedResponse<Supplier> = {
      items: mockSuppliers,
      meta: {
        total: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    };
    mockUseSuppliers.mockReturnValue(
      createMockQueryResult<PaginatedResponse<Supplier>>(paginatedResponse)
    );

    const { result } = renderHook(() => useSupplierDirectory());

    act(() => {
      result.current.setPageSize(20);
    });

    expect(result.current.pageSize).toBe(20);
  });

  it('should handle empty suppliers list', () => {
    const emptyResponse: PaginatedResponse<Supplier> = {
      items: [],
      meta: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    };
    mockUseSuppliers.mockReturnValue(
      createMockQueryResult<PaginatedResponse<Supplier>>(emptyResponse)
    );

    const { result } = renderHook(() => useSupplierDirectory());

    expect(result.current.suppliers).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.totalPages).toBe(0);
  });

  it('should handle malformed API response gracefully', () => {
    mockUseSuppliers.mockReturnValue(
      createMockQueryResult<PaginatedResponse<Supplier>>(undefined)
    );

    const { result } = renderHook(() => useSupplierDirectory());

    expect(result.current.suppliers).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.totalPages).toBe(0);
  });
});
