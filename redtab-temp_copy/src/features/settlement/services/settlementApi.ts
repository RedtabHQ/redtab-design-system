import { apiClient } from '@/lib/api';
import type { SettlementRail, RailTransaction, RailStats } from '@types';
import { PaginatedResponse } from '@/types';

export interface RoutingDecision {
  id: string;
  paymentId: string;
  selectedRailId: string;
  fallbackRailIds?: string[];
  status: 'SELECTED' | 'EXECUTED' | 'FALLBACK_USED' | 'FAILED';
  amount: number;
  currency: string;
  reasonForSelection: string;
  selectionCriteria?: {
    amountRange?: { min: number; max: number };
    priorityScore?: number;
    successRate?: number;
    processingTime?: number;
    fees?: { fixed: number; percentage: number };
  };
  usedFallbackRailId?: string;
  executionTimeMs?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRailData {
  name: string;
  provider: 'NCHL' | 'ESEWA' | 'KHALTI' | 'BANK_TRANSFER' | 'FONEPAY' | 'IME_PAY';
  mode: 'REAL_TIME' | 'BATCHED' | 'DEFERRED';
  feeRate: number;
  maxTransactionLimit: number;
  minTransactionLimit?: number;
  priority: number;
  config: Record<string, unknown>;
}

export interface UpdateRailData {
  name?: string;
  status?: 'UP' | 'DOWN' | 'DEGRADED' | 'MAINTENANCE';
  mode?: 'REAL_TIME' | 'BATCHED' | 'DEFERRED';
  feeRate?: number;
  maxTransactionLimit?: number;
  minTransactionLimit?: number;
  priority?: number;
  isActive?: boolean;
  config?: Record<string, unknown>;
}

export interface SelectBestRailParams {
  amount: number;
  merchantId?: string;
  supplierId?: string;
}

export interface SettlementRailsFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  currency?: string;
  status?: 'UP' | 'DOWN' | 'DEGRADED' | 'MAINTENANCE';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const settlementApi = {
  /**
   * Get all settlement rails
   * Note: Backend returns a paginated response, but this method extracts just the items array
   * for convenience in UI components that expect a simple array
   */
  async getAllRails(): Promise<SettlementRail[]> {
    const response = await apiClient.get<{ items: SettlementRail[] }>('/settlements/rails');
    return response.items;
  },

  /**
   * Get settlement rails with filters
   */
  async getFilteredRails(filters: SettlementRailsFilterParams): Promise<PaginatedResponse<SettlementRail>> {
    return apiClient.get<PaginatedResponse<SettlementRail>>('/settlements/rails', {
      params: filters,
    });
  },

  /**
   * Get active settlement rails
   */
  async getActiveRails(): Promise<SettlementRail[]> {
    const response = await apiClient.get<SettlementRail[]>('/settlements/rails/active');
    return (response as unknown) as SettlementRail[];
  },

  /**
   * Get rail by ID
   */
  async getRailById(railId: string): Promise<SettlementRail> {
    const response = await apiClient.get<SettlementRail>(`/settlements/rails/${railId}`);
    return response as SettlementRail;
  },

  /**
   * Create a new settlement rail
   */
  async createRail(data: CreateRailData): Promise<SettlementRail> {
    const response = await apiClient.post<SettlementRail>('/settlements/rails', data);
    return response as SettlementRail;
  },

  /**
   * Update a settlement rail
   */
  async updateRail(railId: string, data: UpdateRailData): Promise<SettlementRail> {
    const response = await apiClient.put<SettlementRail>(`/settlements/rails/${railId}`, data);
    return response as SettlementRail;
  },

  /**
   * Select the best rail for a transaction
   */
  async selectBestRail(params: SelectBestRailParams): Promise<SettlementRail> {
    const response = await apiClient.get<SettlementRail>('/settlements/rails/select-best', { params });
    return response as SettlementRail;
  },

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId: string): Promise<RailTransaction> {
    const response = await apiClient.get<RailTransaction>(`/settlements/transactions/${transactionId}`);
    return response as RailTransaction;
  },

  /**
   * Get transactions by payment ID
   */
  async getTransactionsByPayment(paymentId: string): Promise<RailTransaction[]> {
    const response = await apiClient.get<RailTransaction[]>(`/settlements/transactions/payment/${paymentId}`);
    return (response as unknown) as RailTransaction[];
  },

  /**
   * Get rail statistics
   */
  async getRailStatistics(railId: string): Promise<RailStats> {
    const response = await apiClient.get<RailStats>(`/settlements/rails/${railId}/statistics`);
    return response as RailStats;
  },

  /**
   * Initialize default settlement rails
   */
  async initializeDefaultRails(): Promise<SettlementRail[]> {
    const response = await apiClient.post<SettlementRail[]>('/settlements/initialize');
    return (response as unknown) as SettlementRail[];
  },

  /**
   * Delete a settlement rail
   */
  async deleteRail(railId: string): Promise<void> {
    await apiClient.delete(`/settlements/rails/${railId}`);
  },

  /**
   * Get transactions for a specific rail
   */
  async getRailTransactions(railId: string): Promise<RailTransaction[]> {
    const response = await apiClient.get<RailTransaction[]>(`/settlements/rails/${railId}/transactions`);
    return (response as unknown) as RailTransaction[];
  },

  /**
   * Get rail statistics (alias for getRailStatistics)
   */
  async getRailStats(railId: string): Promise<RailStats> {
    return this.getRailStatistics(railId);
  },

  /**
   * Health check for a rail
   */
  async healthCheck(railId: string): Promise<{ status: string; latencyMs: number }> {
    const response = await apiClient.post<{ status: string; latencyMs: number }>(
      `/settlements/rails/${railId}/health-check`,
      {}
    );
    return response as { status: string; latencyMs: number };
  },

  /**
   * Get all routing decisions with pagination
   */
  async getRoutingDecisions(page?: number, pageSize?: number): Promise<PaginatedResponse<RoutingDecision>> {
    const response = await apiClient.get<PaginatedResponse<RoutingDecision>>('/settlements/routing-decisions', {
      params: { page, pageSize },
    });
    return response as PaginatedResponse<RoutingDecision>;
  },

  /**
   * Get routing decision for a specific payment
   */
  async getRoutingDecisionByPayment(paymentId: string): Promise<RoutingDecision> {
    const response = await apiClient.get<RoutingDecision>(`/settlements/routing-decisions/${paymentId}`);
    return response as RoutingDecision;
  },
};
