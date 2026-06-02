/**
 * Payment-related type definitions
 */

import { TransactionType, SettlementMode, Currency } from './enums';

export interface Payment {
  id: string;
  contractId: string;
  merchantId: string;
  supplierId?: string;
  amount: number;
  currency: Currency;
  transactionType: TransactionType;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  scheduledDate?: string;
  completedDate?: string;
  railId?: string;
  railTransactionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStats {
  totalAmount: number;
  completedAmount: number;
  pendingAmount: number;
  failedAmount: number;
  transactionCount: number;
  completionRate: number;
  averageProcessingTime: number;
}

export interface PaymentListResponse {
  items: Payment[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    pageSize?: number;
  };
}

export interface CreatePaymentInput {
  contractId: string;
  merchantId: string;
  amount: number;
  currency: Currency;
  transactionType: TransactionType;
  scheduledDate?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentFilterParams {
  merchantId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
