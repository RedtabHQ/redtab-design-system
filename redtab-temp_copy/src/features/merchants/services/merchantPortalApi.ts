import { apiClient } from '@/lib/api';
import type { Merchant, Contract } from '@/types';

export interface CreditLineStatus {
  maxLimit: number;
  currentUtilization: number;
  currency: string;
  tier: string;
  isFrozen: boolean;
  frozenReason?: string;
}

export const merchantPortalApi = {
  async getMyProfile(): Promise<Merchant> {
    const response = await apiClient.get<Merchant>('/merchants/me/profile');
    return response as Merchant;
  },

  async getMyCreditLine(): Promise<CreditLineStatus> {
    const response = await apiClient.get<CreditLineStatus>('/lines/me/status');
    return response as CreditLineStatus;
  },

  async getMyContracts(status?: string): Promise<{ items: Contract[] }> {
    const params = status ? { status } : {};
    const response = await apiClient.get<{ items: Contract[] }>('/contracts/me', { params });
    return response as { items: Contract[] };
  },

  async getMyActiveContracts(): Promise<{ items: Contract[] }> {
    const response = await apiClient.get<{ items: Contract[] }>('/contracts/me/active');
    return response as { items: Contract[] };
  },
};
