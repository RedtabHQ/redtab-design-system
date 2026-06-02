/**
 * Step 2: Financial Capacity form
 */

import { TrendingUp, Banknote, CreditCard, Percent, DollarSign } from 'lucide-react';
import { Controller, FieldErrors, Control } from 'react-hook-form';
import type { OnboardingFormData } from '../onboardingSchema';
import { TextInput } from '../components';

interface Step2Props {
  control: Control<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
  currency?: string;
}

export const Step2FinancialCapacity = ({ control, errors, currency }: Step2Props) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
    <div className="flex items-center gap-4 text-gray-900">
      <TrendingUp size={32} className="text-redtab" />
      <h2 className="text-2xl font-black tracking-tight uppercase">Financial Capacity</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Controller
        name="bankFlows"
        control={control}
        render={({ field }) => (
          <TextInput
            label={`Monthly Bank Inflow (${currency})`}
            type="number"
            value={field.value?.toString() || '0'}
            onChange={(v) => field.onChange(parseFloat(v) || 0)}
            error={errors.bankFlows?.message}
            icon={<Banknote size={16} />}
          />
        )}
      />
      <Controller
        name="posSales"
        control={control}
        render={({ field }) => (
          <TextInput
            label={`Avg Monthly POS Sales (${currency})`}
            type="number"
            value={field.value?.toString() || '0'}
            onChange={(v) => field.onChange(parseFloat(v) || 0)}
            error={errors.posSales?.message}
            icon={<CreditCard size={16} />}
          />
        )}
      />
      <Controller
        name="inventoryTurnover"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Inventory Turnover (Cycles/Year)"
            type="number"
            value={field.value?.toString() || '12'}
            onChange={(v) => field.onChange(parseFloat(v) || 12)}
            error={errors.inventoryTurnover?.message}
          />
        )}
      />
      <Controller
        name="profitMargin"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Average Profit Margin (%)"
            type="number"
            value={field.value?.toString() || '15'}
            onChange={(v) => field.onChange(parseFloat(v) || 15)}
            error={errors.profitMargin?.message}
            icon={<Percent size={16} />}
          />
        )}
      />
      <Controller
        name="liquidAssets"
        control={control}
        render={({ field }) => (
          <TextInput
            label={`Total Receivables / Liquid Assets (${currency})`}
            type="number"
            value={field.value?.toString() || '0'}
            onChange={(v) => field.onChange(parseFloat(v) || 0)}
            error={errors.liquidAssets?.message}
            icon={<DollarSign size={16} />}
          />
        )}
      />
      <Controller
        name="growthTrend"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Year-over-Year Growth (%)"
            type="number"
            value={field.value?.toString() || '5'}
            onChange={(v) => field.onChange(parseFloat(v) || 5)}
            error={errors.growthTrend?.message}
            icon={<TrendingUp size={16} />}
          />
        )}
      />
    </div>
  </div>
);
