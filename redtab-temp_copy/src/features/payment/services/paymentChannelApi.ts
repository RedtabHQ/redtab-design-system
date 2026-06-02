/**
 * Payment Channel API Service
 * Provides a unified interface for accessing payment channel (settlement rail) data from the backend.
 * Replaces the paymentChannelStore for dynamic, server-driven channel management.
 */

import { settlementApi } from '@/features/settlement/services/settlementApi';
import type { SettlementRail } from '@types';

/**
 * Payment Channel is a frontend concept that maps to Settlement Rails on the backend
 */
export type PaymentChannel = SettlementRail;

/**
 * Payment Channel API Service
 * Provides methods to fetch and manage payment channels (settlement rails)
 */
export const paymentChannelApi = {
  /**
   * Get all payment channels (settlement rails)
   */
  async getAllChannels(): Promise<PaymentChannel[]> {
    return settlementApi.getAllRails();
  },

  /**
   * Get active payment channels (settlement rails)
   */
  async getActiveChannels(): Promise<PaymentChannel[]> {
    return settlementApi.getActiveRails();
  },

  /**
   * Get a specific payment channel by ID
   */
  async getChannelById(channelId: string): Promise<PaymentChannel> {
    return settlementApi.getRailById(channelId);
  },

  /**
   * Get payment channels filtered by currency
   */
  async getChannelsByCurrency(currency: string): Promise<PaymentChannel[]> {
    const channels = await this.getAllChannels();
    // Settlement rails are not currency-specific at the moment
    // They serve all currencies in a market segment
    return channels;
  },

  /**
   * Get payment channels filtered by status
   */
  async getChannelsByStatus(status: string): Promise<PaymentChannel[]> {
    const channels = await this.getAllChannels();
    return channels.filter((channel) => channel.status === status);
  },

  /**
   * Select the best payment channel for a transaction
   */
  async selectBestChannel(amount: number, merchantId?: string): Promise<PaymentChannel> {
    return settlementApi.selectBestRail({
      amount,
      merchantId,
    });
  },

  /**
   * Get channel statistics
   */
  async getChannelStats(channelId: string) {
    return settlementApi.getRailStatistics(channelId);
  },

  /**
   * Health check for a payment channel
   */
  async healthCheck(channelId: string) {
    return settlementApi.healthCheck(channelId);
  },
};
