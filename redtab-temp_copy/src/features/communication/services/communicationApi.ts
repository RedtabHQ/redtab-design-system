import { apiClient } from '@/lib/api';
import { ApiService } from '@/lib/apiService';
import type { Communication, CommunicationStats } from '@types';

export interface SendCommunicationData {
  recipientId: string;
  recipientType: 'MERCHANT' | 'SUPPLIER' | 'USER';
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  type: 'PAYMENT_REMINDER' | 'COLLECTION_NOTICE' | 'APPROVAL_NOTIFICATION' | 'GENERAL';
  subject?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export const communicationApi = {
  /**
   * Send a communication
   */
  async send(data: SendCommunicationData): Promise<Communication> {
    const response = await apiClient.post<Communication>('/communications', data);
    return response as Communication;
  },

  /**
   * Send payment reminder to merchant
   */
  async sendPaymentReminder(merchantId: string): Promise<Communication> {
    const response = await apiClient.post<Communication>(`/communications/payment-reminder/${merchantId}`);
    return response as Communication;
  },

  /**
   * Send collection notice to merchant
   */
  async sendCollectionNotice(merchantId: string): Promise<Communication> {
    const response = await apiClient.post<Communication>(`/communications/collection-notice/${merchantId}`);
    return response as Communication;
  },

  /**
   * Send approval notification to merchant
   */
  async sendApprovalNotification(merchantId: string): Promise<Communication> {
    const response = await apiClient.post<Communication>(`/communications/approval-notification/${merchantId}`);
    return response as Communication;
  },

  /**
   * Get communication by ID
   */
  async getById(communicationId: string): Promise<Communication> {
    const response = await apiClient.get<Communication>(`/communications/${communicationId}`);
    return response as Communication;
  },

  /**
   * Get communications by recipient ID
   */
  async getByRecipient(recipientId: string): Promise<Communication[]> {
    const response = await apiClient.get<Communication[]>(`/communications/recipient/${recipientId}`);
    return response as Communication[];
  },

  /**
   * Get communications by contract ID
   */
  async getByContract(contractId: string): Promise<Communication[]> {
    const response = await apiClient.get<Communication[]>(`/communications/contract/${contractId}`);
    return response as Communication[];
  },

  /**
   * Get all communications with optional filters
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    channel?: string;
    type?: string;
    status?: string;
  }): Promise<{ data: Communication[]; total: number }> {
    const response = await apiClient.get<{ data: Communication[]; total: number }>('/communications', { params });
    return response as { data: Communication[]; total: number };
  },

  /**
   * Get communication statistics
   */
  async getStatistics(): Promise<CommunicationStats> {
    const response = await apiClient.get<CommunicationStats>('/communications/statistics/overview');
    return response as CommunicationStats;
  },

  /**
   * Backwards-compatible stats alias
   */
  async getStats(): Promise<CommunicationStats> {
    return this.getStatistics();
  },
};

/**
 * ApiService-compatible service for communications.
 * Wraps communicationApi so createResourceHooks factory can be used
 * for standard list and create operations.
 */
class CommunicationService extends ApiService<Communication> {
  constructor() {
    super('/communications');
  }

  /**
   * Override create to delegate to communicationApi.send
   */
  override async create(data: Partial<Communication>): Promise<Communication> {
    return communicationApi.send(data as SendCommunicationData);
  }
}

export const communicationService = new CommunicationService();
