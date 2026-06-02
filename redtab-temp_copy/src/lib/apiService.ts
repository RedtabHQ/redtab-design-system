import { apiClient } from '@/lib/api';
import type {
  AuditLog,
  Contract,
  CreditScore,
  KycDocumentConfig,
  KycStatusResponse,
  MarketSegment,
  Merchant,
  PaginatedResponse,
  Policy,
  Supplier,
  SupplierCategory,
  Transaction,
} from '@types';
import type { LifecycleEvent, PaymentScheduleInstallment, NextInstallmentSummary, ScheduleSummary } from '@/types/contract';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export type FilterParams = Record<string, unknown>;

/**
 * Generic API service with CRUD operations and pagination support
 */
export class ApiService<T> {
  constructor(protected resourcePath: string) {}

  /**
   * Get all resources with pagination
   * @param params - Pagination parameters
   * @returns Promise with paginated response
   */
  async getAll(params?: PaginationParams & FilterParams): Promise<PaginatedResponse<T>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${this.resourcePath}?${queryString}` : this.resourcePath;

    const response = await apiClient.get<PaginatedResponse<T>>(url);
    return response as PaginatedResponse<T>;
  }

  /**
   * Get a single resource by ID
   * @param id - Resource ID
   * @returns Promise with resource data
   */
  async getById(id: string | number): Promise<T> {
    const response = await apiClient.get<T>(`${this.resourcePath}/${id}`);
    return response as T;
  }

  /**
   * Create a new resource
   * @param data - Resource data
   * @returns Promise with created resource
   */
  async create(data: Partial<T>): Promise<T> {
    const response = await apiClient.post<T>(this.resourcePath, data);
    return response as T;
  }

  /**
   * Update an existing resource
   * @param id - Resource ID
   * @param data - Updated resource data
   * @returns Promise with updated resource
   */
  async update(id: string | number, data: Partial<T>): Promise<T> {
    const response = await apiClient.put<T>(`${this.resourcePath}/${id}`, data);
    return response as T;
  }

  /**
   * Partially update an existing resource
   * @param id - Resource ID
   * @param data - Partial resource data
   * @returns Promise with updated resource
   */
  async patch(id: string | number, data: Partial<T>): Promise<T> {
    const response = await apiClient.patch<T>(`${this.resourcePath}/${id}`, data);
    return response as T;
  }

  /**
   * Delete a resource
   * @param id - Resource ID
   * @returns Promise that resolves when deletion is complete
   */
  async delete(id: string | number): Promise<void> {
    await apiClient.delete<void>(`${this.resourcePath}/${id}`);
  }

  /**
   * Bulk delete resources
   * @param ids - Array of resource IDs
   * @returns Promise that resolves when deletion is complete
   */
  async bulkDelete(ids: (string | number)[]): Promise<void> {
    await apiClient.post<void>(`${this.resourcePath}/bulk-delete`, { ids });
  }

  /**
   * Get resource count
   * @param filters - Optional filters
   * @returns Promise with count
   */
  async count(filters?: FilterParams): Promise<number> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.resourcePath}/count?${queryString}`
      : `${this.resourcePath}/count`;

    const response = await apiClient.get<{ count: number }>(url);
    return (response as { count: number }).count;
  }

  /**
   * Check if a resource exists
   * @param id - Resource ID
   * @returns Promise with boolean indicating existence
   */
  async exists(id: string | number): Promise<boolean> {
    try {
      await this.getById(id);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Custom query endpoint
   * @param endpoint - Custom endpoint path (relative to resource path)
   * @param params - Query parameters
   * @returns Promise with response data
   */
  async query<R>(endpoint: string, params?: FilterParams): Promise<R> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.resourcePath}/${endpoint}?${queryString}`
      : `${this.resourcePath}/${endpoint}`;

    const response = await apiClient.get<R>(url);
    return response as R;
  }

  /**
   * Custom mutation endpoint
   * @param endpoint - Custom endpoint path (relative to resource path)
   * @param data - Request data
   * @returns Promise with response data
   */
  async mutate<R>(endpoint: string, data?: unknown): Promise<R> {
    const response = await apiClient.post<R>(`${this.resourcePath}/${endpoint}`, data);
    return response as R;
  }
}

/**
 * Extended Merchant Service with additional methods
 */
class MerchantService<T> extends ApiService<T> {
  /**
   * Get suppliers linked to a merchant through contracts
   * @param merchantId - Merchant ID
   * @param params - Pagination parameters
   * @returns Promise with paginated supplier response
   */
  async getLinkedSuppliers<S>(merchantId: string, params?: PaginationParams & FilterParams): Promise<PaginatedResponse<S>> {
    return this.query(`${merchantId}/linked-suppliers`, params);
  }

  /**
   * Get detailed score breakdown for a merchant
   * @param merchantId - Merchant ID
   * @returns Promise with score breakdown data
   */
  async getScoreBreakdown<R>(merchantId: string): Promise<R> {
    return this.query(`${merchantId}/score-breakdown`);
  }

  /**
   * Create or update merchant score breakdown
   * @param merchantId - Merchant ID
   * @param data - Score breakdown data
   * @returns Promise with updated score breakdown
   */
  async upsertScoreBreakdown<R>(merchantId: string, data: unknown): Promise<R> {
    const response = await apiClient.put<R>(`${this.resourcePath}/${merchantId}/score-breakdown`, data);
    return response as R;
  }

  /**
   * Get KYC status with document list and progress
   * @param merchantId - Merchant ID
   * @returns Promise with KYC status response
   */
  async getKycStatus(merchantId: string): Promise<KycStatusResponse> {
    return this.query<KycStatusResponse>(`${merchantId}/kyc/status`);
  }

  /**
   * Get document requirements for a merchant
   * @param merchantId - Merchant ID
   * @returns Promise with document configuration array
   */
  async getDocumentRequirements(merchantId: string): Promise<KycDocumentConfig[]> {
    return this.query<KycDocumentConfig[]>(`${merchantId}/kyc/requirements`);
  }

  async updateDocumentStatus(
    merchantId: string,
    documentType: string,
    data: { status: string; rejectionReason?: string; notes?: string },
  ): Promise<KycStatusResponse> {
    const response = await apiClient.patch<KycStatusResponse>(
      `${this.resourcePath}/${merchantId}/kyc/documents/${documentType}`,
      data,
    );
    return response as KycStatusResponse;
  }
}

/**
 * Extended Contract Service with additional methods
 */
class ContractService<T> extends ApiService<T> {
  /**
   * Get suppliers linked to a contract
   * @param contractId - Contract ID
   * @param params - Pagination parameters
   * @returns Promise with paginated supplier response
   */
  async getLinkedSuppliers<S>(contractId: string, params?: PaginationParams & FilterParams): Promise<PaginatedResponse<S>> {
    return this.query<PaginatedResponse<S>>(`${contractId}/linked-suppliers`, params);
  }

  /**
   * Get overdue contracts with filtering
   * @param params - Filter and pagination parameters
   * @returns Promise with paginated overdue contracts
   */
  async getOverdueContracts(params?: PaginationParams & FilterParams): Promise<PaginatedResponse<T>> {
    return this.query<PaginatedResponse<T>>('overdue', params);
  }

  /**
   * Get contract statistics
   * @returns Promise with contract statistics
   */
  async getStatistics(): Promise<Record<string, number>> {
    return this.query<Record<string, number>>('statistics');
  }

  /**
   * Get KPI aggregation for contracts
   * @returns Promise with KPI aggregation data
   */
  async getKpiAggregation(params?: FilterParams): Promise<{
    totalDisbursed: number;
    totalOutstanding: number;
    totalRecovered: number;
    recoveryProgress: number;
    currency: string;
    currencySymbol: string;
  }> {
    return this.query('kpi', params);
  }

  /**
   * Get paginated lifecycle events for a contract
   * @param contractId - Contract ID
   * @param params - Pagination and sorting parameters
   * @returns Promise with paginated lifecycle events
   */
  async getLifecycleEvents(contractId: string, params?: { page?: number; pageSize?: number; sortBy?: string; sortOrder?: string }): Promise<PaginatedResponse<LifecycleEvent>> {
    return this.query<PaginatedResponse<LifecycleEvent>>(`${contractId}/lifecycle-events`, params);
  }

  /**
   * Update lifecycle events for a contract
   * @param contractId - Contract ID
   * @param lifecycleEvents - Lifecycle events to update
   * @returns Promise with updated contract
   */
  async updateLifecycleEvents(contractId: string, lifecycleEvents: unknown[]): Promise<T> {
    const response = await apiClient.patch<T>(`${this.resourcePath}/${contractId}/lifecycle-events`, { lifecycleEvents });
    return response as T;
  }

  /**
   * Get all installment schedules for a contract
   */
  async getSchedules(contractId: string): Promise<PaymentScheduleInstallment[]> {
    const response = await apiClient.get<PaymentScheduleInstallment[]>(`${this.resourcePath}/${contractId}/schedules`);
    return response as PaymentScheduleInstallment[];
  }

  /**
   * Get next due installment for a contract
   */
  async getNextDueSchedule(contractId: string): Promise<NextInstallmentSummary | null> {
    const response = await apiClient.get<NextInstallmentSummary | null>(`${this.resourcePath}/${contractId}/schedules/next-due`);
    return response as NextInstallmentSummary | null;
  }

  /**
   * Get schedule summary (paid/total, remaining balance, etc.)
   */
  async getScheduleSummary(contractId: string): Promise<ScheduleSummary> {
    const response = await apiClient.get<ScheduleSummary>(`${this.resourcePath}/${contractId}/schedules/summary`);
    return response as ScheduleSummary;
  }
}

/**
 * Extended Transaction Service with supplier/merchant-scoped endpoints
 */
class TransactionService<T> extends ApiService<T> {
  async getBySupplier(supplierId: string, params?: PaginationParams & FilterParams): Promise<PaginatedResponse<T>> {
    return this.query<PaginatedResponse<T>>(`supplier/${supplierId}`, params);
  }

  async getByMerchant(merchantId: string, params?: PaginationParams & FilterParams): Promise<PaginatedResponse<T>> {
    return this.query<PaginatedResponse<T>>(`merchant/${merchantId}`, params);
  }
}

// Pre-configured service instances for common resources
export const merchantService = new MerchantService<Merchant>('/merchants');
export const contractService = new ContractService<Contract>('/contracts');
export const transactionService = new TransactionService<Transaction>('/transactions');
export const auditLogService = new ApiService<AuditLog>('/audit-logs');
export const policyService = new ApiService<Policy>('/policies');
export const creditScoreService = new ApiService<CreditScore>('/credit-scores');
export const marketSegmentService = new ApiService<MarketSegment>('/market-segments');
// Unified categories service (for both merchants and suppliers)
export const categoryService = new ApiService<SupplierCategory>('/categories');
// Alias for backward compatibility
export const supplierCategoryService = categoryService;

/**
 * Extended Supplier Service with additional methods
 */
class SupplierService<T> extends ApiService<T> {
  /**
   * Get merchants linked to a supplier through contracts
   * @param supplierId - Supplier ID
   * @param params - Pagination parameters
   * @returns Promise with paginated merchant response
   */
  async getLinkedMerchants<M>(supplierId: string, params?: PaginationParams & FilterParams): Promise<PaginatedResponse<M>> {
    return this.query<PaginatedResponse<M>>(`${supplierId}/linked-merchants`, params);
  }

  /**
   * Block a supplier
   * @param supplierId - Supplier ID
   * @param reason - Reason for blocking
   * @returns Promise with updated supplier
   */
  async blockSupplier(supplierId: string, reason: string): Promise<T> {
    return this.mutate(`${supplierId}/block`, { reason });
  }

  /**
   * Unblock a supplier
   * @param supplierId - Supplier ID
   * @param reason - Reason for unblocking
   * @returns Promise with updated supplier
   */
  async unblockSupplier(supplierId: string, reason: string): Promise<T> {
    return this.mutate(`${supplierId}/unblock`, { reason });
  }

  /**
   * Get payout amounts (net) for multiple suppliers
   * @param supplierProviderIds - Array of supplier provider IDs
   * @returns Promise with map of provider IDs to payout amounts
   */
  async getPayoutAmounts(supplierProviderIds: string[]): Promise<Record<string, { amount: number; amount_usd: number }>> {
    const response = await apiClient.post<Record<string, { amount: number; amount_usd: number }>>(
      `${this.resourcePath}/payout-amounts`,
      { supplierProviderIds }
    );
    return response as Record<string, { amount: number; amount_usd: number }>;
  }
}

export const supplierService = new SupplierService<Supplier>('/suppliers');

// User service instance for use with createResourceHooks factory
import type { User, SettlementRail } from '@types';
export const userService = new ApiService<User>('/users');

// Settlement rail service instance for use with createResourceHooks factory
export const settlementRailService = new ApiService<SettlementRail>('/settlements/rails');
