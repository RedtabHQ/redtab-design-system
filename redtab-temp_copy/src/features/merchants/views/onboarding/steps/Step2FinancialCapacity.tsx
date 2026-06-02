/**
 * Step 2: Financial Capacity form
 */

import { TrendingUp } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../utils/onboardingValidation';
import { OnboardingField } from '../components/OnboardingField';

export const Step2FinancialCapacity = () => {
  const { register, formState: { errors } } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 text-gray-900">
        <TrendingUp size={32} className="text-red-600" />
        <h2 className="text-2xl font-black tracking-tight uppercase">Financial Capacity</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <OnboardingField label="Monthly Bank Inflow (USD)" type="number" field="bankFlows" register={register} errors={errors} />
        <OnboardingField label="Avg Monthly POS Sales (USD)" type="number" field="posSales" register={register} errors={errors} />
        <OnboardingField label="Inventory Turnover (Cycles/Year)" type="number" field="inventoryTurnover" register={register} errors={errors} />
        <OnboardingField label="Average Profit Margin (%)" type="number" field="profitMargin" register={register} errors={errors} />
        <OnboardingField label="Liquid Assets (USD)" type="number" field="liquidAssets" register={register} errors={errors} />
        <OnboardingField label="Year-over-Year Growth (%)" type="number" field="growthTrend" register={register} errors={errors} />
      </div>
    </div>
  );
};
