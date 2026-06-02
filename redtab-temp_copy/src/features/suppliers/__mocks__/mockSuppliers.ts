import { CurrencySymbol, SettlementMode, type Supplier } from '@/types';

/**
 * Mock supplier data for testing SupplyHealthPage
 */
export const mockSuppliers: Supplier[] = [
  {
    id: 'SUP001',
    providerId: 'S001',
    name: 'FastTrack Logistics',
    businessName: 'FastTrack Logistics Inc.',
    category: 'Logistics & Fulfillment',
    isVerified: true,
    bankName: 'State Bank',
    bankAccount: '****5432',
    contactPerson: 'John Smith',
    email: 'john@fasttrack.com',
    phone: '+1-800-123-4567',
    onboardingDate: '2023-06-15',
    paymentTermDays: 30,
    supplierFeeRate: 0.035, // 3.5%
    settlementMode: SettlementMode.BATCHED,
    currency: CurrencySymbol.USD,
    status: 'ACTIVE',
  },
  {
    id: 'SUP002',
    providerId: 'S002',
    name: 'Global Distributors Ltd',
    businessName: 'Global Distributors Limited',
    category: 'Distribution & Wholesale',
    isVerified: true,
    bankName: 'International Bank',
    bankAccount: '****7890',
    contactPerson: 'Sarah Chen',
    email: 'sarah@globaldist.com',
    phone: '+1-800-234-5678',
    onboardingDate: '2023-08-20',
    paymentTermDays: 45,
    supplierFeeRate: 0.042, // 4.2%
    settlementMode: SettlementMode.REAL_TIME,
    currency: CurrencySymbol.USD,
    status: 'ACTIVE',
  },
  {
    id: 'SUP003',
    providerId: 'S003',
    name: 'Express Carriers Co',
    businessName: 'Express Carriers Corporation',
    category: 'Transportation',
    isVerified: false,
    bankName: 'Regional Bank',
    bankAccount: '****1234',
    contactPerson: 'Mike Johnson',
    email: 'mike@expresscarriers.com',
    phone: '+1-800-345-6789',
    onboardingDate: '2024-01-10',
    paymentTermDays: 20,
    supplierFeeRate: 0.055, // 5.5%
    settlementMode: SettlementMode.DEFERRED,
    currency: CurrencySymbol.USD,
    status: 'ACTIVE',
  },
  {
    id: 'SUP004',
    providerId: 'S004',
    name: 'Warehouse Solutions',
    businessName: 'Warehouse Solutions Inc.',
    category: 'Storage & Warehousing',
    isVerified: true,
    bankName: 'Commerce Bank',
    bankAccount: '****5678',
    contactPerson: 'Emily Davis',
    email: 'emily@warehousesol.com',
    phone: '+1-800-456-7890',
    onboardingDate: '2023-11-05',
    paymentTermDays: 35,
    supplierFeeRate: 0.028, // 2.8%
    settlementMode: SettlementMode.BATCHED,
    currency: CurrencySymbol.USD,
    status: 'ACTIVE',
  },
];

/**
 * Mock supplier with blocked status
 */
export const blockedSupplier: Supplier = {
  id: 'SUP005',
  providerId: 'S005',
  name: 'Unreliable Traders',
  businessName: 'Unreliable Traders Ltd',
  category: 'General Supply',
  isVerified: false,
  bankName: 'Unknown Bank',
  bankAccount: '****9999',
  contactPerson: 'Unknown',
  email: 'contact@unreliable.com',
  phone: '+1-800-999-9999',
  onboardingDate: '2023-03-01',
  paymentTermDays: 60,
  supplierFeeRate: 0.08, // 8%
  settlementMode: SettlementMode.DEFERRED,
  currency: CurrencySymbol.USD,
  status: 'BLOCKED',
  block_reason: 'Multiple payment defaults and quality issues',
  blockedAt: '2024-01-15',
};

/**
 * Test scenarios for SupplyHealthPage
 */
export const testScenarios = {
  /**
   * Scenario 1: Well-diversified supplier network (low risk)
   */
  lowRisk: mockSuppliers.slice(0, 4),

  /**
   * Scenario 2: High concentration risk (few suppliers)
   */
  highRisk: mockSuppliers.slice(0, 2),

  /**
   * Scenario 3: Critical risk (single supplier)
   */
  criticalRisk: [mockSuppliers[0]],

  /**
   * Scenario 4: Empty network (no suppliers)
   */
  noSuppliers: [],

  /**
   * Scenario 5: Mix with blocked supplier
   */
  withBlocked: [...mockSuppliers.slice(0, 2), blockedSupplier],
};
