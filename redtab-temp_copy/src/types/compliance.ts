/**
 * Compliance-related type definitions
 */

export interface ComplianceItem {
  label: string;
  status: string;
  verified: boolean;
}

export interface PolicyChecklist {
  purpose?: boolean;
  owner_id?: boolean;
  reg_val?: boolean;
  vat_pan?: boolean;
  pep_check?: boolean;
  tax_compliance?: boolean;
  central_bank_blacklist?: boolean;
  municipality_license?: boolean;
  [key: string]: boolean | undefined;
}

export interface ComplianceData {
  kycVerified: boolean;
  kycDocuments?: Record<string, string>;
  policyChecklist?: PolicyChecklist;
  verifiedAt?: string;
  panNumber?: string;
}

export interface ComplianceCheckResponse {
  items: ComplianceItem[];
  kycVerified: boolean;
  lastUpdated?: string;
}
