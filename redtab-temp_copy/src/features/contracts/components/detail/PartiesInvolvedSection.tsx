import React from 'react';
import { Building2, Truck, ExternalLink } from 'lucide-react';
import type { Contract, Merchant, Supplier } from '@/types';

interface PartiesInvolvedSectionProps {
  contract: Contract;
  merchant: Merchant | null;
  supplier: Supplier | null;
  onMerchantClick: (merchantId: string) => void;
  onSupplierClick: (supplierId: string) => void;
}

/**
 * Displays merchant borrower and supplier beneficiary information
 */
export const PartiesInvolvedSection: React.FC<PartiesInvolvedSectionProps> = ({
  merchant,
  supplier,
  onMerchantClick,
  onSupplierClick,
}) => {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
      <h3 className="text-2xs font-black text-gray-400 uppercase tracking-widest">Parties Involved</h3>

      <div className="space-y-4">
        {merchant && (
          <div
            className="p-4 bg-indigo-50/50 rounded border border-indigo-100 hover:bg-indigo-50 transition-all cursor-pointer group"
            onClick={() => onMerchantClick(merchant.id)}
          >
            <div className="flex items-center gap-3 mb-2">
              <Building2 size={16} className="text-indigo-600" />
              <span className="text-2xs font-black text-indigo-400 uppercase">Merchant Borrower</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-black text-gray-900 group-hover:text-red-600 transition-colors">{merchant.name}</p>
              <ExternalLink size={14} className="text-gray-300" />
            </div>
          </div>
        )}

        {supplier && (
          <div
            className="p-4 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-all cursor-pointer group"
            onClick={() => onSupplierClick(supplier.id)}
          >
            <div className="flex items-center gap-3 mb-2">
              <Truck size={16} className="text-gray-600" />
              <span className="text-2xs font-black text-gray-400 uppercase">Supplier Beneficiary</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-black text-gray-900 group-hover:text-red-600 transition-colors">{supplier.name}</p>
              <ExternalLink size={14} className="text-gray-300" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
