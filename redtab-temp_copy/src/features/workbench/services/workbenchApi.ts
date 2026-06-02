import { apiClient } from '@/lib/api';

export interface GetExposureInsightsParams {
  merchantId: string;
  marketSegmentId?: string | null;
}

export interface ExposureInsightsResponse {
  marketSegmentId?: string | null;
  currency: string;
  currencySymbol: string;
  exchangeRate?: number | null;
  exposurePercentage: number;
  exposureDeltaPercentage: number;
  currentExposure: number;
  remainingBudget: number;
  portfolioLimit: number;
  projectedExposure?: number;
  approvalImpactAmount: number;
}

export const workbenchApi = {
  async getExposureInsights(params: GetExposureInsightsParams): Promise<ExposureInsightsResponse> {
    if (!params?.merchantId) {
      throw new Error('merchantId is required to fetch exposure insights');
    }

    const query = {
      merchantId: params.merchantId,
      ...(params.marketSegmentId ? { marketSegmentId: params.marketSegmentId } : {}),
    };

    return apiClient.get<ExposureInsightsResponse>('/workbench/exposure-insights', {
      params: query,
    });
  },
};
