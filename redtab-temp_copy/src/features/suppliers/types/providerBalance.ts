import type { Contract } from '@/types';

export type ProviderBalanceTransactionType = 'CREDIT' | 'DEBIT' | 'ADJUSTMENT' | 'FEE';

export interface ProviderBalance {
  providerId: string;
  availableBalance: number;
  pendingBalance: number;
  totalBalance: number;
  lifetimeCredits: number;
  lifetimeWithdrawals: number;
  currency: string;
  pendingReleaseDate?: string | null;
  isFrozen: boolean;
  frozenReason?: string | null;
  updatedAt?: string;
}

export interface ProviderBalanceTransaction {
  id: string;
  providerId: string;
  amount: number;
  currency: string;
  balanceAfter?: number;
  transactionType: ProviderBalanceTransactionType;
  referenceId?: string;
  referenceType?: string;
  contractId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  status?: 'PENDING' | 'SETTLED' | 'FAILED';
}

export interface ProviderBalanceTransactionFilters {
  page?: number;
  pageSize?: number;
  transactionType?: ProviderBalanceTransactionType | 'ALL';
}

export interface AutoRepayRunResult {
  runId: string;
  startedAt: string;
  completedAt?: string | null;
  providersProcessed: number;
  contractsProcessed: number;
  totalAmountApplied: number;
  results: Array<{
    providerId: string;
    contractId: string;
    amountApplied: number;
    remainingBalance: number;
    contractStatus: Contract['status'];
  }>;
  errors: Array<{
    providerId?: string;
    contractId?: string;
    message: string;
  }>;
  skippedReason?: string | null;
}

export interface ProviderOutstandingContractSummary {
  totalOutstanding: number;
  contractCount: number;
  overdueCount: number;
  activeCount: number;
  currency: string;
}
