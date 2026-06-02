/**
 * Shared enums across the application
 */

export enum MerchantStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum CreditTier {
  T1 = 'T1',
  T2 = 'T2',
  T3 = 'T3',
  NONE = 'NONE',
}

export enum TransactionType {
  DISBURSEMENT = 'DISBURSEMENT',
  REPAYMENT = 'REPAYMENT',
}

export enum RailStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum SettlementMode {
  REAL_TIME = 'REAL_TIME',
  BATCHED = 'BATCHED',
  DEFERRED = 'DEFERRED',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  INR = 'INR',
  NPR = 'NPR',
  GBP = 'GBP',
}

export enum MarketSegmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum SupplierCategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
