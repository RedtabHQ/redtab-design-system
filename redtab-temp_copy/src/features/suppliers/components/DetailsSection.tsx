import React from 'react';
import { SettlementMode, Supplier } from '@/types';
import { SupplierTermsForm, CommercialTermsFormData } from './SupplierTermsForm';
import { BankSettlementForm, BankSettlementFormData } from './BankSettlementForm';

interface DetailsSectionProps {
  supplier: Supplier;
}

export const DetailsSection: React.FC<DetailsSectionProps> = ({ supplier }) => {
  // Initial values for Commercial Terms Form
  const commercialTermsInitialValues: CommercialTermsFormData = {
    settlementMode: supplier.banking?.settlementMode || SettlementMode.REAL_TIME,
    paymentTermDays: supplier.banking?.paymentTermDays || 0,
    supplierFeeRate: supplier.banking?.supplierFeeRate || 0,
    numberOfDisbursementPeriods: supplier.numberOfDisbursementPeriods || 1,
  };

  // Initial values for Bank Settlement Form
  const bankSettlementInitialValues: BankSettlementFormData = {
    walletId: supplier.bankAccount || '',
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Commercial Terms Form - Independent */}
      <SupplierTermsForm
        supplierId={supplier.id}
        initialValues={commercialTermsInitialValues}
      />

      {/* Bank Settlement Form - Independent */}
      <BankSettlementForm
        supplierId={supplier.id}
        supplierName={supplier.name}
        initialValues={bankSettlementInitialValues}
      />
    </div>
  );
};
