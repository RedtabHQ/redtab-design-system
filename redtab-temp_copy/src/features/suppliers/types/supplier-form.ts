import { SettlementMode } from '@/types';

export interface SupplierFormData {
  name: string;
  businessName: string;
  supplierCategoryId: string;
  contactPerson: string;
  email: string;
  phone: string;
  marketSegmentId: string;
  bankProvider: string;
  bankName: string;
  bankAccount: string;
  preferredRailId: string;
  settlementMode: SettlementMode;
  paymentTermDays: number;
  supplierFeeRate: number;
}
