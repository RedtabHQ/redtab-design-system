import { apiClient } from '@/lib/api';
import { ApiService } from '@/lib/apiService';
import type { Payment, PaymentStats, PaginatedResponse } from '@types';

export interface CreatePaymentData {
  contractId: string;
  amount: number;
  type: 'DISBURSEMENT' | 'REPAYMENT' | 'FEE_COLLECTION';
  supplierId?: string;
}

export interface ProcessPaymentData {
  railId?: string;
}

export const paymentApi = {
  /**
   * Create a new payment
   */
  async create(data: CreatePaymentData): Promise<Payment> {
    const response = await apiClient.post<Payment>('/payments', data);
    return response as Payment;
  },

  /**
   * Get payment by ID
   */
  async getById(paymentId: string): Promise<Payment> {
    const response = await apiClient.get<Payment>(`/payments/${paymentId}`);
    return response as Payment;
  },

  /**
   * Get all payments with optional filters
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }): Promise<{ data: Payment[]; total: number }> {
    const response = await apiClient.get<{ data: Payment[]; total: number }>('/payments', { params });
    return response as { data: Payment[]; total: number };
  },

  /**
   * Get payments by contract ID
   */
  async getByContract(contractId: string): Promise<Payment[]> {
    const response = await apiClient.get<Payment[]>(`/payments/contract/${contractId}`);
    return response as Payment[];
  },

  /**
   * Get payments by merchant ID
   */
  async getByMerchant(merchantId: string): Promise<Payment[]> {
    const response = await apiClient.get<Payment[]>(`/payments/merchant/${merchantId}`);
    return response as Payment[];
  },

  /**
   * Get payments by supplier ID with optional filters
   */
  async getBySupplier(supplierId: string, params?: {
    page?: number;
    pageSize?: number;
    paymentType?: 'SUPPLIER_SETTLEMENT' | 'MERCHANT_REPAYMENT' | 'REFUND';
    status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<Payment>> {
    const response = params
      ? await apiClient.get<PaginatedResponse<Payment>>(`/payments/supplier/${supplierId}`, { params })
      : await apiClient.get<PaginatedResponse<Payment>>(`/payments/supplier/${supplierId}`);
    return response as PaginatedResponse<Payment>;
  },

  /**
   * Get supplier payment statistics (total volume, count)
   */
  async getSupplierStats(supplierId: string, params?: {
    paymentType?: 'SUPPLIER_SETTLEMENT' | 'MERCHANT_REPAYMENT' | 'REFUND';
    status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  }): Promise<{ totalVolume: number; count: number }> {
    const response = params
      ? await apiClient.get<{ totalVolume: number; count: number }>(`/payments/supplier/${supplierId}/stats`, { params })
      : await apiClient.get<{ totalVolume: number; count: number }>(`/payments/supplier/${supplierId}/stats`);
    return response as { totalVolume: number; count: number };
  },

  /**
   * Process a payment
   */
  async process(paymentId: string, data?: ProcessPaymentData): Promise<Payment> {
    const response = await apiClient.post<Payment>(`/payments/${paymentId}/process`, data);
    return response as Payment;
  },

  /**
   * Retry a failed payment
   */
  async retry(paymentId: string): Promise<Payment> {
    const response = await apiClient.post<Payment>(`/payments/${paymentId}/retry`);
    return response as Payment;
  },

  /**
   * Cancel a payment
   */
  async cancel(paymentId: string): Promise<Payment> {
    const response = await apiClient.post<Payment>(`/payments/${paymentId}/cancel`);
    return response as Payment;
  },

  /**
   * Get payment statistics
   */
  async getStatistics(): Promise<PaymentStats> {
    const response = await apiClient.get<PaymentStats>('/payments/statistics/overview');
    return response as PaymentStats;
  },
};

/**
 * Payment service instance compatible with createResourceHooks factory.
 * Provides standard CRUD operations (getAll, getById, create) via ApiService base class.
 */
export const paymentService = new ApiService<Payment>('/payments');
