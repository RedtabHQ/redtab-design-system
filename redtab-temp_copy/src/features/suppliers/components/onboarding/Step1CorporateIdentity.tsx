import React from 'react';
import { Building2 } from 'lucide-react';
import { UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { FormField } from '@/components/common/FormField';
import SupplierCategorySelect from '@/components/SupplierCategorySelect';
import MarketSegmentSelector from '@/components/MarketSegmentSelector';
import StepNavigationButtons from './StepNavigationButtons';
import { SupplierFormData } from '../../types/supplier-form';

interface Step1CorporateIdentityProps {
  register: UseFormRegister<SupplierFormData>;
  control: Control<SupplierFormData>;
  errors: FieldErrors<SupplierFormData>;
  isSubmitting: boolean;
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
  isGlobalView: boolean;
  selectedSegment: { id: string; name: string } | null;
}

const Step1CorporateIdentity: React.FC<Step1CorporateIdentityProps> = ({
  register,
  control,
  errors,
  isSubmitting,
  onNext,
  onBack,
  step,
  totalSteps,
  isGlobalView,
  selectedSegment,
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 text-gray-900">
        <Building2 size={32} className="text-redtab" />
        <h2 className="text-2xl font-black tracking-tight uppercase">Corporate Identity</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          name="name"
          control={control}
          label="Legal Partner Name"
          placeholder="e.g. Nimto Wholesale"
          rules={{
            required: 'Partner name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 100, message: 'Name must not exceed 100 characters' },
          }}
        />
        <FormField
          name="businessName"
          control={control}
          label="Business Legal Name"
          placeholder="e.g. Nimto Trading Pvt. Ltd."
          rules={{
            required: 'Business legal name is required',
            minLength: { value: 2, message: 'Business name must be at least 2 characters' },
            maxLength: { value: 255, message: 'Business name must not exceed 255 characters' },
          }}
        />
        <div className="space-y-2">
          <MarketSegmentSelector
            {...register('marketSegmentId', {
              required: 'Operational market is required',
            })}
            label="Operational Market"
            error={errors.marketSegmentId?.message}
            showCurrency={true}
            disabled={!isGlobalView && !!selectedSegment}
          />
          {!isGlobalView && selectedSegment && (
            <p className="text-2xs text-blue-600 italic px-1">
              Auto-selected from header market segment: {selectedSegment.name}
            </p>
          )}
        </div>
        <SupplierCategorySelect
          {...register('supplierCategoryId', {
            required: 'Category is required',
          })}
          label="Business Category"
          error={errors.supplierCategoryId?.message}
        />
        <FormField
          name="contactPerson"
          control={control}
          label="Primary Contact Person"
          placeholder="Account Manager"
          rules={{
            required: 'Contact person is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          }}
        />
        <FormField
          name="email"
          control={control}
          label="Corporate Email"
          type="email"
          placeholder="settlements@company.com"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
        />
        <FormField
          name="phone"
          control={control}
          label="Direct Phone"
          type="tel"
          placeholder="+977-98..."
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^[\d\s\-+()]{8,20}$/,
              message: 'Invalid phone number format',
            },
          }}
        />
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

export default Step1CorporateIdentity;
