/**
 * Step 4: Operational Behavior form
 */

import { Zap, Calendar } from 'lucide-react';
import { Controller, FieldErrors, Control } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingSchema';
import { TextInput } from '../components';

interface Step4Props {
  control: Control<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}

export const Step4Behavior = ({ control, errors }: Step4Props) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
    <div className="flex items-center gap-4 text-gray-900">
      <Zap size={32} className="text-redtab" />
      <h2 className="text-2xl font-black tracking-tight uppercase">Operational Behavior</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Controller
        name="tenureMonths"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Months in Operation"
            type="number"
            value={field.value?.toString() || '1'}
            onChange={(v) => field.onChange(parseFloat(v) || 1)}
            error={errors.tenureMonths?.message}
            icon={<Calendar size={16} />}
          />
        )}
      />
      <Controller
        name="refundRate"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Historical Refund Rate (%)"
            type="number"
            value={field.value?.toString() || '0'}
            onChange={(v) => field.onChange(parseFloat(v) || 0)}
            error={errors.refundRate?.message}
          />
        )}
      />
      <Controller
        name="fulfillmentRate"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Order Fulfillment Rate (%)"
            type="number"
            value={field.value?.toString() || '95'}
            onChange={(v) => field.onChange(parseFloat(v) || 95)}
            error={errors.fulfillmentRate?.message}
          />
        )}
      />
      <Controller
        name="socialReputation"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Social Reputation Score (0-100)"
            type="number"
            value={field.value?.toString() || '80'}
            onChange={(v) => field.onChange(parseFloat(v) || 80)}
            error={errors.socialReputation?.message}
          />
        )}
      />
      <Controller
        name="responsiveness"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Communication Responsiveness (0-100)"
            type="number"
            value={field.value?.toString() || '90'}
            onChange={(v) => field.onChange(parseFloat(v) || 90)}
            error={errors.responsiveness?.message}
          />
        )}
      />
    </div>
  </div>
);
