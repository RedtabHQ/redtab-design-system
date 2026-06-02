import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Control } from 'react-hook-form';
import { FormField } from '@/components/common/FormField';
import MerchantStepNavigationButtons from './MerchantStepNavigationButtons';
import { MerchantFormData } from '../../types/merchant-form';

interface Step2FinancialCapacityProps {
  control: Control<MerchantFormData>;
  isSubmitting: boolean;
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

const Step2FinancialCapacity: React.FC<Step2FinancialCapacityProps> = ({
  control,
  isSubmitting,
  onNext,
  onBack,
  step,
  totalSteps,
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 text-gray-900">
        <TrendingUp size={32} className="text-red-600" />
        <h2 className="text-2xl font-black tracking-tight uppercase">Financial Capacity</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          name="bankFlows"
          control={control}
          label="Monthly Bank Inflow (USD)"
          type="number"
          placeholder="100000"
        />
        <FormField
          name="posSales"
          control={control}
          label="Avg Monthly POS Sales (USD)"
          type="number"
          placeholder="50000"
        />
        <FormField
          name="inventoryTurnover"
          control={control}
          label="Inventory Turnover (Cycles/Year)"
          type="number"
          placeholder="12"
        />
        <FormField
          name="profitMargin"
          control={control}
          label="Average Profit Margin (%)"
          type="number"
          placeholder="15"
        />
        <FormField
          name="liquidAssets"
          control={control}
          label="Liquid Assets (USD)"
          type="number"
          placeholder="200000"
        />
        <FormField
          name="growthTrend"
          control={control}
          label="Year-over-Year Growth (%)"
          type="number"
          placeholder="5"
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

export default Step2FinancialCapacity;
