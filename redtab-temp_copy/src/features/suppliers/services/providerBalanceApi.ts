import { apiClient } from '@/lib/api';
import type { PaginatedResponse, Contract } from '@/types';
import type {
  ProviderBalance,
  ProviderBalanceTransaction,
  ProviderBalanceTransactionFilters,
  AutoRepayRunResult,
} from '../types';

export interface ProviderOutstandingContractParams {
  status?: string;
  page?: number;
  pageSize?: number;
  merchantId?: string;
}

const DEFAULT_STATUS_FILTER = 'ACTIVE,OVERDUE';
const DEFAULT_PAGE_SIZE = 10;

const sanitizeParams = (params?: Record<string, unknown>) => {
  if (!params) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
};

export const providerBalanceApi = {
  async getBalance(providerId: string): Promise<ProviderBalance> {
    return apiClient.get<ProviderBalance>(`/provider-balances/${providerId}`);
  },

  async getTransactions(
    providerId: string,
    params?: ProviderBalanceTransactionFilters
  ): Promise<PaginatedResponse<ProviderBalanceTransaction>> {
    const normalized: Record<string, unknown> = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? DEFAULT_PAGE_SIZE,
    };

    if (params?.transactionType && params.transactionType !== 'ALL') {
      normalized.transactionType = params.transactionType;
    }

    return apiClient.get<PaginatedResponse<ProviderBalanceTransaction>>(
      `/provider-balances/${providerId}/transactions`,
      {
        params: sanitizeParams(normalized),
      }
    );
  },

  async triggerAutoRepay(): Promise<AutoRepayRunResult> {
    return apiClient.post<AutoRepayRunResult>('/repayments/auto-repay');
  },

  async getOutstandingContracts(
    providerId: string,
    params?: ProviderOutstandingContractParams
  ): Promise<PaginatedResponse<Contract>> {
    const normalized: Record<string, unknown> = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 50,
      status: params?.status ?? DEFAULT_STATUS_FILTER,
      merchantId: params?.merchantId ?? providerId,
    };

    return apiClient.get<PaginatedResponse<Contract>>('/loan-contracts', {
      params: sanitizeParams(normalized),
    });
  },
};
