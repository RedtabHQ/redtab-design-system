import { apiClient } from '@/lib/api';
import type { CreditLine, Contract, CreditDecision, CreditScore, EligibilityResult, Repayment } from '@types';

export interface DrawdownData {
  amount: number;
  supplierId?: string;
  purpose?: string;
  tenureDays?: number;
}

export interface PostRepaymentData {
  contractId: string;
  amount: number;
  paymentMethod?: string;
  transactionRef?: string;
}

export interface EligibilityParams {
  merchantId: string;
  requestedAmount?: number;
  supplierId?: string;
}

export const creditApi = {
  /**
   * Get credit line status for a merchant
   */
  async getCreditLineStatus(merchantId: string): Promise<CreditLine> {
    const response = await apiClient.get<CreditLine>(`/lines/${merchantId}/status`);
    return response as CreditLine;
  },

  /**
   * Get credit decision for a merchant
   */
  async getCreditDecision(merchantId: string): Promise<CreditDecision> {
    const response = await apiClient.get<CreditDecision>(`/credit-decisions/${merchantId}`);
    return response as CreditDecision;
  },

  /**
   * Create a new loan contract (drawdown)
   */
  async drawdown(data: DrawdownData & { merchantId: string }): Promise<Contract> {
    const response = await apiClient.post<Contract>('/contracts/drawdown', data);
    return response as Contract;
  },

  /**
   * Post a repayment
   */
  async postRepayment(data: PostRepaymentData): Promise<Repayment> {
    const response = await apiClient.post<Repayment>('/repayments/post', data);
    return response as Repayment;
  },

  /**
   * Get repayment history for a merchant
   */
  async getRepayments(merchantId: string): Promise<Repayment[]> {
    const response = await apiClient.get<Repayment[]>(`/repayments/${merchantId}`);
    return response as Repayment[];
  },

  /**
   * Get scoring history for a merchant
   */
  async getScoringHistory(merchantId: string): Promise<CreditScore[]> {
    const response = await apiClient.get<CreditScore[]>(`/credit-scores/${merchantId}/history`);
    return response as CreditScore[];
  },

  /**
   * Evaluate merchant eligibility
   */
  async evaluateEligibility(params: EligibilityParams): Promise<EligibilityResult> {
    const response = await apiClient.post<EligibilityResult>('/decisions/eligibility', params);
    return response as EligibilityResult;
  },

  /**
   * Backwards-compatible alias for eligibility checks
   */
  async checkEligibility(params: EligibilityParams): Promise<EligibilityResult> {
    return this.evaluateEligibility(params);
  },

  async getCreditTiers(): Promise<{ id: string; name: string }[]> {
    return [
      {
        id: 'T1',
        name: 'T1',
      },
      {
        id: 'T2',
        name: 'T2',
      },
      {
        id: 'T3',
        name: 'T3',
      },
    ];
  }
};
