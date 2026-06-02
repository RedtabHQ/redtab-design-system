import React from 'react';
import { Building2 } from 'lucide-react';
import { UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { FormField } from '@/components/common/FormField';
import BusinessCategorySelector from '@/components/BusinessCategorySelector';
import MarketSegmentSelector from '@/components/MarketSegmentSelector';
import MerchantStepNavigationButtons from './MerchantStepNavigationButtons';
import { MerchantFormData } from '../../types/merchant-form';

interface Step1EntityProfileProps {
  register: UseFormRegister<MerchantFormData>;
  control: Control<MerchantFormData>;
  errors: FieldErrors<MerchantFormData>;
  isSubmitting: boolean;
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
  isGlobalView: boolean;
  selectedSegment: { id: string; name: string } | null;
}

const Step1EntityProfile: React.FC<Step1EntityProfileProps> = ({
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
        <Building2 size={32} className="text-red-600" />
        <h2 className="text-2xl font-black tracking-tight uppercase">Entity Profile</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          name="name"
          control={control}
          label="Legal Business Name"
          placeholder="e.g., ABC Trading Company"
        />
        <div className="space-y-2 group">
          <BusinessCategorySelector
            {...register('categoryId', {
              required: 'Business category is required',
            })}
            error={errors.categoryId?.message}
            label="Business Category"
          />
        </div>
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
              Auto-selected based on your current market view
            </p>
          )}
        </div>
        <FormField
          name="contactPerson"
          control={control}
          label="Contact Person"
          placeholder="John Doe"
        />
        <FormField
          name="email"
          control={control}
          label="Email Address"
          type="email"
          placeholder="contact@business.com"
        />
        <FormField
          name="phone"
          control={control}
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
        />
        <FormField
          name="address"
          control={control}
          label="Business Address"
          placeholder="123 Business Street, City, Country"
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

export default Step1EntityProfile;
