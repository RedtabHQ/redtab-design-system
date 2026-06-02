export interface MerchantFormData {
  // Step 1: Entity Profile
  name: string;
  businessName: string;
  email: string;
  phone: string;
  categoryId: string;
  marketSegmentId: string;
  contactPerson: string;
  address?: string;
  registrationNumber?: string;

  // Step 2: Financial Capacity
  bankFlows: number;
  posSales: number;
  inventoryTurnover: number;
  profitMargin: number;
  liquidAssets: number;
  growthTrend: number;

  // Step 3: Obligations
  employeeArrears: number;
  householdDebt: number;
  outsideLoans: number;
  rentLease: number;
  taxDues: number;

  // Step 4: Behavioral Signals
  tenureMonths: number;
  refundRate: number;
  fulfillmentRate: number;
  socialReputation: number;
  responsiveness: number;

  // Step 5: KYC Documents
  panNumber?: string;
}
