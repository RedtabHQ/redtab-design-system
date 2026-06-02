import type { ComplianceCheckResponse, ComplianceItem, Merchant } from '@/types';

/**
 * Compliance API Service
 * Handles extracting and formatting compliance data from merchant information
 */
export class ComplianceService {
  /**
   * Get compliance radar items from merchant data
   * @param merchant - The merchant object containing compliance data
   * @returns Formatted compliance check response
   */
  getComplianceChecks(merchant: Merchant): ComplianceCheckResponse {
    const items: ComplianceItem[] = [];
    const policyChecklist = merchant.policyChecklist || {};

    // Tax Compliance Check
    items.push({
      label: 'Tax Compliance FY80/81',
      status: policyChecklist.tax_compliance ? 'Current' : 'Pending',
      verified: policyChecklist.tax_compliance || false,
    });

    // Central Bank Blacklist Check
    items.push({
      label: 'Central Bank Blacklist',
      status: policyChecklist.central_bank_blacklist ? 'Clear' : 'Pending',
      verified: policyChecklist.central_bank_blacklist || false,
    });

    // Municipality License Check
    items.push({
      label: 'Local Municipality License',
      status: policyChecklist.municipality_license ? 'Valid' : 'Pending',
      verified: policyChecklist.municipality_license || false,
    });

    // PEP/Sanctions Check
    items.push({
      label: 'PEP/Sanctions Check',
      status: policyChecklist.pep_check ? 'Clear' : 'Pending',
      verified: policyChecklist.pep_check || false,
    });

    // VAT/PAN Verification
    if (policyChecklist.vat_pan !== undefined) {
      items.push({
        label: 'VAT/PAN Verification',
        status: policyChecklist.vat_pan ? 'Verified' : 'Pending',
        verified: policyChecklist.vat_pan || false,
      });
    }

    // Business Registration Check
    if (policyChecklist.reg_val !== undefined) {
      items.push({
        label: 'Business Registration',
        status: policyChecklist.reg_val ? 'Valid' : 'Pending',
        verified: policyChecklist.reg_val || false,
      });
    }

    // Owner ID Verification
    if (policyChecklist.owner_id !== undefined) {
      items.push({
        label: 'Owner ID Verification',
        status: policyChecklist.owner_id ? 'Verified' : 'Pending',
        verified: policyChecklist.owner_id || false,
      });
    }

    // Business Purpose Check
    if (policyChecklist.purpose !== undefined) {
      items.push({
        label: 'Business Purpose',
        status: policyChecklist.purpose ? 'Verified' : 'Pending',
        verified: policyChecklist.purpose || false,
      });
    }

    return {
      items,
      kycVerified: merchant.kycVerified || false,
      lastUpdated: merchant.verifiedAt || merchant.updatedAt,
    };
  }

  /**
   * Get default compliance items when no data is available
   * @returns Default compliance items with pending status
   */
  getDefaultComplianceChecks(): ComplianceCheckResponse {
    return {
      items: [
        { label: 'Tax Compliance FY80/81', status: 'Pending', verified: false },
        { label: 'Central Bank Blacklist', status: 'Pending', verified: false },
        { label: 'Local Municipality License', status: 'Pending', verified: false },
        { label: 'PEP/Sanctions Check', status: 'Pending', verified: false },
      ],
      kycVerified: false,
    };
  }
}

/**
 * Pre-configured instance for compliance service
 */
export const complianceService = new ComplianceService();
