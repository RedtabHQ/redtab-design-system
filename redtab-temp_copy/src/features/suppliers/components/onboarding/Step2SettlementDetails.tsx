import React from 'react';
import { CreditCard } from 'lucide-react';
import { UseFormRegister, FieldErrors, UseFormSetValue, Control } from 'react-hook-form';
import { FormField } from '@/components/common/FormField';
import BankProviderSelect from '@/components/BankProviderSelect';
import PaymentRailSelector from '@/features/payment/components/PaymentRailSelector';
import RailVerificationCard from '@components/RailVerificationCard';
import StepNavigationButtons from './StepNavigationButtons';
import { SupplierFormData } from '../../types/supplier-form';

interface Step2SettlementDetailsProps {
  register: UseFormRegister<SupplierFormData>;
  control: Control<SupplierFormData>;
  errors: FieldErrors<SupplierFormData>;
  isSubmitting: boolean;
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
  setValue: UseFormSetValue<SupplierFormData>;
  formValues: SupplierFormData;
}

const Step2SettlementDetails: React.FC<Step2SettlementDetailsProps> = ({
  register,
  control,
  errors,
  isSubmitting,
  onNext,
  onBack,
  step,
  totalSteps,
  setValue,
  formValues,
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 text-gray-900">
        <CreditCard size={32} className="text-redtab" />
        <h2 className="text-2xl font-black tracking-tight uppercase">Bank Settlement Details</h2>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BankProviderSelect
            label="Settlement Provider (Bank/Wallet)"
            error={errors.bankProvider?.message}
            {...register('bankProvider', {
              required: 'Bank provider is required',
            })}
          />
          <FormField
            name="bankName"
            control={control}
            label="Bank Name"
            placeholder="e.g. Nepal Bank Limited"
            rules={{
              required: 'Bank name is required',
              minLength: { value: 2, message: 'Bank name must be at least 2 characters' },
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            name="bankAccount"
            control={control}
            label="Account ID / Number"
            placeholder="Verified Acc Number"
            rules={{
              required: 'Account number is required',
              minLength: { value: 3, message: 'Account number must be at least 3 characters' },
            }}
          />
        </div>

        <PaymentRailSelector
          value={formValues.preferredRailId}
          onChange={(value) => setValue('preferredRailId', value)}
        />

        <RailVerificationCard entityName={formValues.name} />
      </div>

      <StepNavigationButtons
        step={step}
        totalSteps={totalSteps}
        isSubmitting={isSubmitting}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
};

export default Step2SettlementDetails;
