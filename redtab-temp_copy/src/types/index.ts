import type {
  InstallmentStatus,
  NextInstallmentSummary,
  PaymentScheduleInstallment,
} from './contract';

// Enums
export enum MerchantStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum CreditTier {
  T1 = 'T1',
  T2 = 'T2',
  T3 = 'T3',
  NONE = 'NONE'
}

export enum TransactionType {
  DISBURSEMENT = 'DISBURSEMENT',
  REPAYMENT = 'REPAYMENT'
}

export type TransactionFilterType = 'ALL' | 'OUTBOUND' | 'INBOUND';

export enum RailStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum SettlementMode {
  REAL_TIME = 'REAL_TIME',
  BATCHED = 'BATCHED',
  DEFERRED = 'DEFERRED'
}

export enum CurrencySymbol {
  USD = 'USD',
  EUR = 'EUR',
  INR = 'INR',
  NPR = 'NPR',
  GBP = 'GBP'
}

export enum MarketSegmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type { InstallmentStatus, PaymentScheduleInstallment, NextInstallmentSummary, ScheduleSummary } from './contract';

// Currency
export interface Currency {
  code: string;
  symbol: string;
  exchangeRate: number;
  decimalPlaces: number;
  isActive: boolean;
  lastSyncAt?: string;
}

// Market Segment
export interface MarketSegment {
  id: string;
  code: string;
  name: string;
  currency: string;
  currencySymbol?: string;
  region?: string;
  country?: string;
  defaultCurrencyCode?: string;
  defaultCurrency?: Currency;
  status: MarketSegmentStatus;
  settings?: Record<string, any>;
  description?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Auth & User
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'RISK_OFFICER' | 'CREDIT_ANALYST' | 'MERCHANT' | 'FINANCE';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  preferredLanguage?: 'en' | 'vi' | 'ne';
  createdAt: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// KYC Document Types
export enum KycDocumentType {
  NATIONAL_ID = 'NATIONAL_ID',
  PASSPORT = 'PASSPORT',
  BUSINESS_LICENSE = 'BUSINESS_LICENSE',
  TAX_REGISTRATION = 'TAX_REGISTRATION',
  BANK_STATEMENT = 'BANK_STATEMENT',
  FINANCIAL_STATEMENT = 'FINANCIAL_STATEMENT',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  COMPANY_REGISTRATION = 'COMPANY_REGISTRATION',
  DIRECTOR_ID = 'DIRECTOR_ID',
  SHAREHOLDER_AGREEMENT = 'SHAREHOLDER_AGREEMENT',
  CUSTOM = 'CUSTOM',
}

export enum KycDocumentStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export interface KycDocument {
  type: KycDocumentType;
  customLabel?: string;
  status: KycDocumentStatus;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  notes?: string;
  expiresAt?: string;
}

export interface KycDocumentConfig {
  type: KycDocumentType;
  label: string;
  description?: string;
  required: boolean;
  acceptedTypes: string[];
  maxSizeMB: number;
}

export interface KycStatusResponse {
  verified: boolean;
  verifiedCount: number;
  requiredCount: number;
  progressPercentage: number;
  documents: KycDocument[];
  verifiedAt?: string;
  verificationNotes?: string;
}

// Merchant KYC (decomposed from Merchant)
export interface MerchantKyc {
  id?: string;
  providerId: string;
  panNumber?: string;
  documents?: KycDocument[];
  documentConfig?: KycDocumentConfig[];
  kycDocuments?: Record<string, string>;
  policyChecklist?: Record<string, boolean>;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Merchant Workflow (decomposed from Merchant)
export interface MerchantWorkflow {
  id?: string;
  providerId: string;
  rejectionReason?: string;
  suspensionReason?: string;
  blockReason?: string;
  blockedAt?: string;
  scoringBreakdown?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

// Merchant
export interface Merchant {
  id: string;
  providerId: string;
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  category?: string | SupplierCategory;
  status: MerchantStatus;
  rejectionReason?: string;
  suspensionReason?: string;
  creditLine?: CreditLine;
  outstandingLoanAmount?: number;
  creditScore?: number;
  trustScore?: number;
  capacityScore?: number;
  intentionScore?: number;
  ageMonths?: number;
  kycHealth?: number;
  tier?: string;
  rating?: 'A' | 'B' | 'C' | 'D';
  tenureDays?: number;
  onboardingDate?: string;
  kycDocuments?: string[] | Record<string, string>;
  kycVerified?: boolean;
  policyChecklist?: Record<string, boolean>;
  panNumber?: string;
  contactPerson?: string;
  currency?: Currency;
  marketSegmentId?: string;
  verifiedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  marketSegment?: MarketSegment;
  fraudDetected?: boolean;
  maxDPD?: number;
  utilizationRate?: number;
  guarantorDefault?: boolean;
  ownerCreditBoost?: number;
  documents?: MerchantDocument[];
  // Decomposed entities (optional, loaded on detail views)
  kyc?: MerchantKyc;
  workflow?: MerchantWorkflow;
}

export interface MerchantDocument {
  id: string;
  type: 'BUSINESS_LICENSE' | 'TAX_ID' | 'BANK_STATEMENT' | 'FINANCIAL_STATEMENT';
  url: string;
  verifiedAt?: string;
}

// Credit Line
export interface CreditLine {
  id?: string;
  merchantId: string;
  limitAmount?: number;
  maxLimit?: number;
  utilizedAmount?: number;
  currentUtilization?: number;
  availableCredit?: number;
  tier?: 'T1' | 'T2' | 'T3';
  isFrozen?: boolean;
  status?: 'ACTIVE' | 'FROZEN';
  currency?: Currency;
  freezeReason?: string;
  lastLimitIncrease?: string;
}

// Contract
export interface Contract {
  id: string;
  contractId?: string;
  merchantId?: string;
  supplierId?: string;
  drawdownAmount: number;
  principalPaid?: number;
  currency?: Currency;
  dueDate: string;
  disbursedAt?: string;
  originalTenure?: number;
  tenureDays?: number;
  status: 'ACTIVE' | 'OVERDUE' | 'PAID' | 'DEFAULTED' | 'DELINQUENT' | 'WRITTEN_OFF';
  currentPenalty?: number;
  daysOverdue?: number;
  totalFeeRate?: number;
  createdAt?: string;
  paymentSchedules?: PaymentScheduleInstallment[];
  nextRepaymentSummary?: {
    principalFeeDue: number;
    penaltyDue: number;
    overdueCarryForward: number;
    totalDue: number;
    currency: string | null;
    status: InstallmentStatus;
    dueDate: string;
  };

  marketSegment?: MarketSegment;


  // Computed financial fields
  principalDue: number;
  feesDue: number;
  penaltiesDue: number;
  totalDue: number;
}

// Risk & Scoring
export interface CreditScore {
  merchantId: string;
  overallScore: number;
  industryScore: number;
  paymentHistoryScore: number;
  financialScore: number;
  factors: ScoringFactor[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedAction: string;
}

export interface ScoringFactor {
  name: string;
  weight: number;
  contribution: number;
  status: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface PortfolioMetrics {
  totalContracts: number;
  activeContracts: number;
  overdueContracts: number;
  totalPortfolioValue: number;
  averageLoanSize: number;
  delinquencyRate: number;
  defaultRate: number;
  averageLoanTerm: number;
}

// Policy
export interface Policy {
  id: string;
  name: string;
  description: string;
  rules: PolicyRule[];
  isActive: boolean;
  createdAt: string;
}

export interface PolicyRule {
  id: string;
  condition: string;
  action: string;
  priority: number;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId?: string;
  actorId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  merchantId?: string;
  category?: 'RISK' | 'FINANCIAL' | 'KYC' | 'SYSTEM';
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  timestamp: string;
  status?: 'SUCCESS' | 'FAILURE';
  traits?: string;
}

// Notification
export interface Notification {
  id: string;
  userId?: string;
  marketSegmentId?: string;
  marketSegment?: MarketSegment;
  type: 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export type RPLNotification = Notification;

// Supplier Category
export interface SupplierCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Supplier Banking (decomposed from Supplier)
export interface SupplierBanking {
  id?: string;
  providerId: string;
  bankAccount?: string;
  bankName?: string;
  paymentTermDays?: number;
  supplierFeeRate?: number;
  settlementMode?: SettlementMode;
  preferredRailId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Supplier Workflow (decomposed from Supplier)
export interface SupplierWorkflow {
  id?: string;
  providerId: string;
  rejectionReason?: string;
  suspensionReason?: string;
  blockReason?: string;
  blockedAt?: string;
  scoringBreakdown?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierDisbursementPeriod {
  periodNumber: number;
  amount: number;
  releaseDate: string;
  status: 'PENDING' | 'RELEASED' | 'HELD' | 'READY';
  releasedAt?: string;
}

// Supplier
export interface Supplier {
  id: string;
  providerId?: string;
  name: string;
  businessName?: string;
  description?: string;
  category?: string | SupplierCategory;
  supplierCategoryId?: string;
  marketSegmentId?: string;
  marketSegment?: MarketSegment;
  isVerified: boolean;
  bankName: string;
  bankAccount: string;
  contactPerson: string;
  email: string;
  phone: string;
  onboardingDate: string;
  paymentTermDays: number;
  supplierFeeRate: number;
  settlementMode: SettlementMode;
  currency?: CurrencySymbol;
  preferredRailId?: string;
  status?: 'ACTIVE' | 'BLOCKED';
  block_reason?: string;
  blockedAt?: string;
  // Decomposed entities (optional, loaded on detail views)
  banking?: SupplierBanking;
  workflow?: SupplierWorkflow;
  numberOfDisbursementPeriods?: number;
  disbursementSchedule?: SupplierDisbursementPeriod[];

  payoutAmount?: number;

  supplierBalance?: {
    availableBalance: number;
    pendingBalance: number;
    totalBalance: number;
    currency: string;
    isFrozen: boolean;
    frozenReason?: string;
    pendingReleaseDate?: string;
    releaseSchedule?: Array<{
      periodNumber?: number;
      releaseDate: string;
      amount: number;
      status: 'PENDING' | 'RELEASED' | 'HELD' | 'READY';
    }>;
  };
}

// Payment Channel / Rail
export interface PaymentChannel {
  id: string;
  name: string;
  provider: 'NCHL' | 'ESEWA' | 'KHALTI' | 'BANK_TRANSFER' | 'STRIPE' | 'SEPA';
  status: RailStatus;
  latencyMs: number;
  lastChecked: string;
  feeRate: number;
  maxTransactionLimit: number;
  settlementEndpoint: string;
  priority: number;
  supportedCurrencies?: Currency[];
}

// Transaction
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency?: string;
  merchantId: string;
  merchantName: string;
  contractId: string;
  timestamp: string;
  recipientOrSource: string;
  supplierId?: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  externalRef?: string;
  reconciled: boolean;
  paymentChannel?: string;
  marketSegment?: MarketSegment;
}

// Communication
export interface CommunicationLog {
  id: string;
  contractId: string;
  timestamp: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS';
  message: string;
  tone: 'SUPPORTIVE' | 'FORMAL' | 'URGENT';
}

export interface Communication {
  id: string;
  recipientId: string;
  recipientType: 'MERCHANT' | 'SUPPLIER' | 'USER';
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  type: 'PAYMENT_REMINDER' | 'COLLECTION_NOTICE' | 'APPROVAL_NOTIFICATION' | 'GENERAL';
  subject?: string;
  message: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  sentAt?: string;
  deliveredAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CommunicationStats {
  totalSent: number;
  delivered: number;
  failed: number;
  pending: number;
  byChannel: Record<string, number>;
  byType: Record<string, number>;
}

// Payment
export interface Payment {
  id: string;
  paymentId: string;
  contractId: string;
  merchantId: string;
  supplierId?: string;
  amount: number;
  contract?: Contract;
  currency: string;
  type: 'DISBURSEMENT' | 'REPAYMENT' | 'FEE_COLLECTION';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  railId?: string;
  railName?: string;
  transactionRef?: string;
  failureReason?: string;
  retryCount?: number;
  scheduledAt?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  completed: number;
  failed: number;
  pending: number;
  completionRate?: number;
  byType: Record<string, number>;
  byRail: Record<string, number>;
}

// Settlement Rail
export interface SettlementRail {
  id: string;
  railId: string;
  railType: 'NCHL' | 'ESEWA' | 'KHALTI' | 'BANK_TRANSFER' | 'FONEPAY' | 'IME_PAY';
  railName: string;
  status: 'ACTIVE' | 'DISABLED' | 'MAINTENANCE';
  priority: number;
  configuration: {
    apiEndpoint?: string;
    apiKey?: string;
    merchantCode?: string;
    timeout?: number;
    retryAttempts?: number;
  };
  limits: {
    minAmount: number;
    maxAmount: number;
    dailyLimit: number;
    monthlyLimit: number;
  };
  fees: {
    fixedFee: number;
    percentageFee: number;
    maxFee: number;
  };
  successRate: number;
  avgProcessingTimeMs: number;
  supportedBanks?: string[] | null;
  supportsInstantSettlement: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RailTransaction {
  id: string;
  paymentId: string;
  railId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  externalRef?: string;
  metadata?: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface RailStats {
  railId: string;
  railName: string;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalAmount: number;
  averageLatency: number;
  successRate: number;
  uptime: number;
}

export interface RoutingDecision {
  id: string;
  paymentId: string;
  selectedRailId: string;
  fallbackRailIds?: string[];
  status: 'SELECTED' | 'EXECUTED' | 'FALLBACK_USED' | 'FAILED';
  amount: number;
  currency: string;
  reasonForSelection: string;
  selectionCriteria?: {
    amountRange?: { min: number; max: number };
    priorityScore?: number;
    successRate?: number;
    processingTime?: number;
    fees?: { fixed: number; percentage: number };
  };
  usedFallbackRailId?: string;
  executionTimeMs?: number;
  createdAt: string;
  updatedAt: string;
}

// Credit Decision
export interface CreditDecision {
  id: string;
  merchantId: string;
  type: 'INITIAL' | 'INCREASE' | 'DECREASE' | 'REVIEW';
  requestedAmount?: number;
  approvedAmount?: number;
  decision: 'VERIFIED' | 'REJECTED' | 'PENDING' | 'REQUIRES_REVIEW';
  reason?: string;
  score?: number;
  tier?: CreditTier;
  factors?: Array<{
    name: string;
    value: number;
    impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  }>;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
  recommendedAmount?: number;
  tier?: CreditTier;
  score?: number;
}

// Repayment
export interface Repayment {
  id: string;
  contractId: string;
  merchantId: string;
  amount: number;
  principalAmount: number;
  feeAmount: number;
  penaltyAmount: number;
  paymentDate: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod?: string;
  transactionRef?: string;
  createdAt: string;
}

// Role & Permissions
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  resource: string;
  action: 'READ' | 'WRITE' | 'DELETE' | 'CREATE' | 'APPROVE';
}

// API Key
export interface ApiKey {
  id: string;
  key?: string;
  name: string;
  merchantId?: string;
  scopes: string[];
  isActive: boolean;
  rateLimitPerHour?: number;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// System Config
export interface SystemConfig {
  killSwitchEnabled: boolean;
  maintenanceMode: boolean;
  featureFlags: Record<string, boolean>;
  settings: Record<string, string | number | boolean>;
}

export interface SystemStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  uptime: number;
  version: string;
  timestamp: string;
}

// Dashboard
export interface DashboardMetrics {
  totalMerchants: number;
  activeMerchants: number;
  totalContracts: number;
  activeContracts: number;
  totalDisbursed: number;
  totalRepaid: number;
  outstandingAmount: number;
  portfolioAtRisk: number;
  delinquencyRate: number;
  defaultRate: number;
  upcomingInstallmentsTotal?: number;
  earliestUpcomingInstallmentDate?: string | null;
}

export interface TierDistribution {
  tier: CreditTier;
  count: number;
  totalLimit: number;
  utilization: number;
}

export interface TrendData {
  date: string;
  disbursements: number;
  repayments: number;
  newMerchants: number;
  activeContracts: number;
}

export interface UpcomingInstallment {
  contractId: string;
  contractNumber?: string;
  merchantId?: string;
  merchantName: string;
  supplierName?: string;
  amountDue: number;
  principalAmount?: number;
  feeAmount?: number;
  dueDate: string;
  status: InstallmentStatus;
  marketSegmentId?: string;
  marketSegment?: MarketSegment;
}

export interface UpcomingInstallmentsResponse {
  totalAmountDue: number;
  totalAmountDueCurrency: string;
  currencySymbol: string;
  nextDueDate: string | null;
  installmentCount: number;
  installments: UpcomingInstallment[];
  // Pagination metadata
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User Settings
export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    currency: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Standard pagination metadata for all paginated responses
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  totalVolume?: number; // Sum of amounts across all matching records
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// Re-export domain-specific types for convenience
// These are also available from their domain modules:
// - from './enums' for shared enums
// - from './merchant' for merchant types
// - from './payment' for payment types
// - from './contract' for contract types
// - from './api' for API types
// - from './table' for table types
// - from './trustSignals' for trust signals types
// - from './compliance' for compliance types
export type { TableColumnDef, TableConfig } from './table';
export { renderColumnCell, getNestedValue } from './table';
export type {
  TrustSignalSubScore,
  TrustSignalCategory,
  TrustSignalBreakdown,
  ProviderScore,
  TrustSignalsResponse,
  ScoringMetricData
} from './trustSignals';
export type { MerchantScoreBreakdown } from './merchant';
export type {
  ComplianceItem,
  PolicyChecklist,
  ComplianceData,
  ComplianceCheckResponse
} from './compliance';
