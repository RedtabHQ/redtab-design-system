/**
 * Step 4: Operational Behavior form
 */

import { Zap } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../utils/onboardingValidation';
import { OnboardingField } from '../components/OnboardingField';

export const Step4Behavior = () => {
  const { register, formState: { errors } } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 text-gray-900">
        <Zap size={32} className="text-red-600" />
        <h2 className="text-2xl font-black tracking-tight uppercase">Operational Behavior</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <OnboardingField label="Months in Operation" type="number" field="tenureMonths" register={register} errors={errors} />
        <OnboardingField label="Historical Refund Rate (%)" type="number" field="refundRate" register={register} errors={errors} />
        <OnboardingField label="Order Fulfillment Rate (%)" type="number" field="fulfillmentRate" register={register} errors={errors} />
        <OnboardingField label="Social Reputation Score (0-100)" type="number" field="socialReputation" register={register} errors={errors} />
        <OnboardingField label="Communication Responsiveness (0-100)" type="number" field="responsiveness" register={register} errors={errors} />
      </div>
    </div>
  );
};
