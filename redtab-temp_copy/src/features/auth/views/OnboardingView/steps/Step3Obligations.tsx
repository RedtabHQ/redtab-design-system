/**
 * Step 3: Risk Obligations form
 */

import { Scale, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { Controller, FieldErrors, Control } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingSchema';
import { TextInput } from '../components';

interface Step3Props {
  control: Control<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
  currency?: string;
}

export const Step3Obligations = ({ control, errors, currency }: Step3Props) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
    <div className="flex items-center gap-4 text-gray-900">
      <Scale size={32} className="text-redtab" />
      <h2 className="text-2xl font-black tracking-tight uppercase">Risk Obligations</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Controller
        name="employeeArrears"
        control={control}
        render={({ field }) => (
          <TextInput
            label={`Employee & Supplier Arrears (${currency})`}
            type="number"
            value={field.value?.toString() || '0'}
            onChange={(v) => field.onChange(parseFloat(v) || 0)}
            error={errors.employeeArrears?.message}
            icon={<Users size={16} />}
          />
        )}
      />
      <Controller
        name="householdDebt"
        control={control}
        render={({ field }) => (
          <TextInput
            label={`Household / Personal Debt (${currency})`}
            type="number"
            value={field.value?.toString() || '0'}
            onChange={(v) => field.onChange(parseFloat(v) || 0)}
            error={errors.householdDebt?.message}
            icon={<AlertTriangle size={16} />}
          />
        )}
      />
      <Controller
        name="outsideLoans"
        control={control}
        render={({ field }) => (
          <TextInput
            label={`Other Active Business Loans (${currency})`}
            type="number"
            value={field.value?.toString() || '0'}
            onChange={(v) => field.onChange(parseFloat(v) || 0)}
            error={errors.outsideLoans?.message}
            icon={<DollarSign size={16} />}
          />
        )}
      />
      <Controller
        name="rentLease"
        control={control}
        render={({ field }) => (
          <TextInput
            label={`Monthly Rent & Lease Overhead (${currency})`}
            type="number"
            value={field.value?.toString() || '0'}
            onChange={(v) => field.onChange(parseFloat(v) || 0)}
            error={errors.rentLease?.message}
          />
        )}
      />
      <Controller
        name="taxDues"
        control={control}
        render={({ field }) => (
          <TextInput
            label={`Unpaid Government Tax Dues (${currency})`}
            type="number"
            value={field.value?.toString() || '0'}
            onChange={(v) => field.onChange(parseFloat(v) || 0)}
            error={errors.taxDues?.message}
            icon={<AlertTriangle size={16} />}
          />
        )}
      />
    </div>
  </div>
);
