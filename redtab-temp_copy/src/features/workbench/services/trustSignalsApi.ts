import { apiClient } from '@/lib/api';
import type { TrustSignalsResponse, ProviderScore } from '@/types/trustSignals';

/**
 * Trust Signals API Service
 * Handles fetching trust signal data and scoring history for merchants
 */
export class TrustSignalsService {
  private baseUrl = '/scoring';

  /**
   * Get trust signals for a merchant by provider ID
   * @param providerId - The merchant's provider ID (e.g., M001, M002)
   * @returns Promise with trust signals data including breakdown
   */
  async getTrustSignals(providerId: string): Promise<TrustSignalsResponse> {
    try {
      // Get scoring history for the merchant
      const history = await apiClient.get<ProviderScore[]>(
        `${this.baseUrl}/history/${providerId}`
      );

      // Get the most recent score (first item in the array)
      const latestScore = Array.isArray(history) && history.length > 0
        ? history[0]
        : null;

      return {
        providerScore: latestScore,
        trustScore: latestScore?.totalScore || 0,
        hasData: latestScore !== null
      };
    } catch (error) {
      console.error(`Failed to fetch trust signals for ${providerId}:`, error);
      // Return empty state if no data found
      return {
        providerScore: null,
        trustScore: 0,
        hasData: false
      };
    }
  }

  /**
   * Get full scoring history for a merchant
   * @param providerId - The merchant's provider ID
   * @returns Promise with array of historical scores
   */
  async getScoringHistory(providerId: string): Promise<ProviderScore[]> {
    try {
      const history = await apiClient.get<ProviderScore[]>(
        `${this.baseUrl}/history/${providerId}`
      );
      return Array.isArray(history) ? history : [];
    } catch (error) {
      console.error(`Failed to fetch scoring history for ${providerId}:`, error);
      return [];
    }
  }

  /**
   * Calculate/recalculate trust signals for a merchant
   * @param merchantId - The merchant's UUID
   * @returns Promise with calculated score
   */
  async calculateScore(merchantId: string): Promise<ProviderScore> {
    const response = await apiClient.post<ProviderScore>(
      `${this.baseUrl}/calculate/${merchantId}`
    );
    return response;
  }
}

/**
 * Pre-configured instance for trust signals API
 */
export const trustSignalsService = new TrustSignalsService();
