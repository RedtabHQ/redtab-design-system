import React from 'react';
import { Scale } from 'lucide-react';
import { Control } from 'react-hook-form';
import { FormField } from '@/components/common/FormField';
import MerchantStepNavigationButtons from './MerchantStepNavigationButtons';
import { MerchantFormData } from '../../types/merchant-form';

interface Step3ObligationsProps {
  control: Control<MerchantFormData>;
  isSubmitting: boolean;
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

const Step3Obligations: React.FC<Step3ObligationsProps> = ({
  control,
  isSubmitting,
  onNext,
  onBack,
  step,
  totalSteps,
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 text-gray-900">
        <Scale size={32} className="text-red-600" />
        <h2 className="text-2xl font-black tracking-tight uppercase">Risk Obligations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          name="employeeArrears"
          control={control}
          label="Employee & Supplier Arrears (USD)"
          type="number"
          placeholder="0"
        />
        <FormField
          name="householdDebt"
          control={control}
          label="Household / Personal Debt (USD)"
          type="number"
          placeholder="0"
        />
        <FormField
          name="outsideLoans"
          control={control}
          label="Other Active Business Loans (USD)"
          type="number"
          placeholder="0"
        />
        <FormField
          name="rentLease"
          control={control}
          label="Monthly Rent & Lease Overhead (USD)"
          type="number"
          placeholder="5000"
        />
        <FormField
          name="taxDues"
          control={control}
          label="Unpaid Government Tax Dues (USD)"
          type="number"
          placeholder="0"
        />
      </div>

      <MerchantStepNavigationButtons
        step={step}
        totalSteps={totalSteps}
        isSubmitting={isSubmitting}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
};

export default Step3Obligations;
