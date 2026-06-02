/**
 * Contract-related type definitions
 */

import { Currency } from './enums';

export type InstallmentStatus = 'PENDING' | 'PAID' | 'DUE' | 'OVERDUE' | 'PARTIALLY_PAID' | 'FAILED';

export interface PaymentScheduleInstallment {
  id: string;
  installmentNumber: number;
  dueDate: string;
  principalAmount: number;
  feeAmount: number;
  totalAmount: number;
  paidAmount?: number;
  remainingAmount?: number;
  penaltyAmount?: number;
  status: InstallmentStatus;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NextInstallmentSummary {
  installmentNumber: number;
  dueDate: string;
  totalDue: number;
  remainingBalance: number;
  status: InstallmentStatus;
  principalAmount?: number;
  feeAmount?: number;
  penaltyAmount?: number;
}

export interface ScheduleSummary {
  totalInstallments: number;
  paidInstallments: number;
  remainingBalance: number;
  totalPaid: number;
  totalDue: number;
}

export interface Contract {
  id: string;
  contractId: string;
  supplierId?: string | null;
  merchantId: string;
  status: 'ACTIVE' | 'OVERDUE' | 'PAID' | 'WRITTEN_OFF' | 'DRAFT' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED' | 'DEFAULTED' | 'DELINQUENT';
  drawdownAmount: number;
  currency: string;
  originalTenure: number;
  tenureDays?: number;
  numberOfInstallments?: number;
  installmentFrequencyDays?: number | null;
  dueDate: string;
  totalFeeRate: number;
  principalPaid: number;
  currentPenalty: number;
  daysOverdue: number;
  policyVersion: string;
  marketSegmentId?: string | null;
  // Computed financial fields
  principalDue?: number;
  feesDue?: number;
  penaltiesDue?: number;
  totalDue?: number;
  // Legacy fields for backwards compatibility
  disbursedAt?: string;
  endDate?: string;
  amount?: number;
  type?: 'SUPPLY' | 'SERVICE' | 'LEASE' | 'OTHER';
  paymentTerms?: string;
  deliveryTerms?: string;
  description?: string;
  documents?: ContractDocument[];
  kpis?: ContractKPI;
  createdAt?: string;
  updatedAt?: string;
  lifecycleEvents?: Array<{
    title: string;
    subtitle: string;
    date: string;
    icon?: string;
    active?: boolean;
  }>;
  paymentSchedules?: PaymentScheduleInstallment[];
  nextInstallment?: NextInstallmentSummary | null;
}

export interface LifecycleEvent {
  id: string;
  contractId: string;
  title: string;
  subtitle: string;
  eventDate: string;
  icon?: string;
  active?: boolean;
  createdAt: string;
}

export interface ContractDocument {
  id: string;
  contractId: string;
  documentType: string;
  documentUrl: string;
  uploadedAt: string;
}

export interface ContractKPI {
  id: string;
  contractId: string;
  fulfillmentRate: number;
  paymentRate: number;
  qualityScore: number;
  deliveryOnTime: number;
  updatedAt: string;
}

export interface ContractKPIAggregation {
  totalDisbursed: number;
  totalOutstanding: number;
  totalRecovered: number;
  recoveryProgress: number;
}

export interface ContractStatistics {
  [key: string]: number;
}

export interface ContractListResponse {
  items: Contract[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    pageSize?: number;
  };
}

export interface CreateContractInput {
  supplierId: string;
  merchantId: string;
  contractNumber: string;
  type: string;
  amount: number;
  currency: Currency;
  startDate: string;
  endDate: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  description?: string;
}

export interface ContractFilterParams {
  status?: string;
  type?: string;
  supplierId?: string;
  merchantId?: string;
  page?: number;
  pageSize?: number;
}
