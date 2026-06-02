/**
 * Step 1: Entity Profile form
 */

import { Building2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import BusinessCategorySelector from '@/components/BusinessCategorySelector';
import MarketSegmentSelector from '@/components/MarketSegmentSelector';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import type { OnboardingFormData } from '../utils/onboardingValidation';
import { OnboardingField } from '../components/OnboardingField';

export const Step1EntityProfile = () => {
  const { register, formState: { errors } } = useFormContext<OnboardingFormData>();
  const { selectedSegment, isGlobalView } = useMarketSegment();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 text-gray-900">
        <Building2 size={32} className="text-red-600" />
        <h2 className="text-2xl font-black tracking-tight uppercase">Entity Profile</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <OnboardingField label="Legal Business Name" field="name" register={register} errors={errors} />
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
        <OnboardingField label="Contact Person" field="contactPerson" register={register} errors={errors} />
        <OnboardingField label="Email Address" type="email" field="email" register={register} errors={errors} />
        <OnboardingField label="Phone Number" type="tel" field="phone" register={register} errors={errors} />
        <OnboardingField label="Business Address" field="address" register={register} errors={errors} />
      </div>
    </div>
  );
};
