/**
 * Step 3: Risk Obligations form
 */

import { Scale } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../utils/onboardingValidation';
import { OnboardingField } from '../components/OnboardingField';

export const Step3Obligations = () => {
  const { register, formState: { errors } } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 text-gray-900">
        <Scale size={32} className="text-red-600" />
        <h2 className="text-2xl font-black tracking-tight uppercase">Risk Obligations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <OnboardingField label="Employee & Supplier Arrears (USD)" type="number" field="employeeArrears" register={register} errors={errors} />
        <OnboardingField label="Household / Personal Debt (USD)" type="number" field="householdDebt" register={register} errors={errors} />
        <OnboardingField label="Other Active Business Loans (USD)" type="number" field="outsideLoans" register={register} errors={errors} />
        <OnboardingField label="Monthly Rent & Lease Overhead (USD)" type="number" field="rentLease" register={register} errors={errors} />
        <OnboardingField label="Unpaid Government Tax Dues (USD)" type="number" field="taxDues" register={register} errors={errors} />
      </div>
    </div>
  );
};
