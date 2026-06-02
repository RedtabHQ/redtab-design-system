/**
 * Merchant-related type definitions
 */

import { CreditTier, MerchantStatus } from './enums';
import type { PolicyChecklist } from './compliance';

export interface Merchant {
  id: string;
  providerId: string;
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  contactPerson?: string;
  category?: string;
  status: MerchantStatus;
  creditLine?: CreditLine;
  creditScore?: number;
  trustScore?: number;
  capacityScore?: number;
  intentionScore?: number;
  ageMonths?: number;
  kycHealth?: number;
  tier?: string;
  tenure?: number;
  documents?: MerchantDocument[];
  createdAt?: string;
  updatedAt?: string;
  verifiedAt?: string;
  onboardingDate?: string;
  currency?: string;
  kycDocuments?: string[] | Record<string, string>;
  kycVerified?: boolean;
  policyChecklist?: PolicyChecklist;
  panNumber?: string;
}

export interface MerchantDocument {
  id: string;
  merchantId: string;
  documentType: string;
  documentUrl: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
}

export interface CreditLine {
  id: string;
  merchantId: string;
  limit: number;
  available: number;
  utilized: number;
  status: 'ACTIVE' | 'FROZEN' | 'INACTIVE';
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantListResponse {
  items: Merchant[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    pageSize?: number;
  };
}

export interface CapacityIndicators {
  bankCashFlow?: number;
  posConsistency?: number;
  inventoryTurnover?: number;
  operationalTenure?: number;
  profitabilityMargins?: number;
}

export interface IntentionIndicators {
  paymentHistory?: number;
  paymentRatio?: number;
  dpdControls?: number;
  commResponsiveness?: number;
  socialReputation?: number;
}

export interface RiskFactors {
  ageMonths?: number;
  fraudDetected?: boolean;
}

export interface MerchantScoreBreakdown {
  id: string;
  providerId: string;
  trustScore?: number | null;
  capacityScore?: number | null;
  intentionScore?: number | null;
  capacityIndicators?: CapacityIndicators | null;
  intentionIndicators?: IntentionIndicators | null;
  riskFactors?: RiskFactors | null;
  calculationMethod?: string | null;
  calculatedAt: Date | string;
  updatedAt: Date | string;
}
