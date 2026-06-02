/**
 * Trust signals type definitions
 */

export interface TrustSignalSubScore {
  score: number;
  weight: number;
  max: number;
}

export interface TrustSignalCategory {
  score: number;
  weight: number;
  subScores: Record<string, number>;
}

export interface TrustSignalBreakdown {
  PURCHASE_HISTORY?: {
    score: number;
    subScores: {
      repaymentConsistency: number;
      utilizationEfficiency: number;
      earlySettlementBonus: number;
    };
  };
  POS_DATA?: {
    score: number;
    subScores: {
      avgTicketSize: number;
      monthlyGrowthVelocity: number;
      chargebackRatio: number;
    };
  };
  CASH_FLOW?: {
    score: number;
    subScores: {
      dailyBalanceStability: number;
      debtServiceCoverage: number;
      operatingMargin: number;
    };
  };
  SOCIAL_MEDIA?: {
    score: number;
    subScores: {
      customerSentimentScore: number;
      followerGrowth: number;
      engagementRate: number;
    };
  };
  BUSINESS_INFO?: {
    score: number;
    subScores: {
      yearsInOperation: number;
      licenseValidity: number;
      taxComplianceStatus: number;
    };
  };
}

export interface ProviderScore {
  id: string;
  providerId: string;
  totalScore: number;
  breakdown: TrustSignalBreakdown;
  configUsed: string;
  calculatedAt: string;
}

export interface TrustSignalsResponse {
  providerScore: ProviderScore | null;
  trustScore: number;
  hasData: boolean;
}

export interface ScoringMetricData {
  label: string;
  weight: string;
  score: number;
  subs: string[];
}
