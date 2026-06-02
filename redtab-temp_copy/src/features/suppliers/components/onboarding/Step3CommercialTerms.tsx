import React from 'react';
import { Settings, Info, AlertCircle } from 'lucide-react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { UseMutationResult } from '@tanstack/react-query';
import SettlementModeSelector from '@components/SettlementModeSelector';
import StepNavigationButtons from './StepNavigationButtons';
import { SupplierFormData } from '../../types/supplier-form';
import { Supplier } from '@/types';

interface Step3CommercialTermsProps {
  register: UseFormRegister<SupplierFormData>;
  errors: FieldErrors<SupplierFormData>;
  isSubmitting: boolean;
  onBack: () => void;
  step: number;
  totalSteps: number;
  setValue: UseFormSetValue<SupplierFormData>;
  formValues: SupplierFormData;
  createSupplier: UseMutationResult<Supplier, Error, any, unknown>;
}

const Step3CommercialTerms: React.FC<Step3CommercialTermsProps> = ({
  register,
  errors,
  isSubmitting,
  onBack,
  step,
  totalSteps,
  setValue,
  formValues,
  createSupplier,
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 text-gray-900">
        <Settings size={32} className="text-redtab" />
        <h2 className="text-2xl font-black tracking-tight uppercase">Commercial Agreement</h2>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <SettlementModeSelector
          value={formValues.settlementMode}
          onChange={(mode) => setValue('settlementMode', mode)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-2xs font-black text-gray-400 uppercase tracking-widest">Payment Term (Days)</label>
              <span className="text-xs font-black text-gray-900">{formValues.paymentTermDays === 0 ? 'Immediate' : `${formValues.paymentTermDays ?? 0} Days`}</span>
            </div>
            <input
              type="range" min="0" max="90" step="15"
              {...register('paymentTermDays', { valueAsNumber: true })}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-redtab"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-2xs font-black text-gray-400 uppercase tracking-widest">Supplier Service Fee (%)</label>
              <span className="text-xs font-black text-gray-900">{formValues.supplierFeeRate}%</span>
            </div>
            <input
              type="number" step="0.1"
              {...register('supplierFeeRate', {
                valueAsNumber: true,
                min: { value: 0, message: 'Fee rate cannot be negative' },
                max: { value: 100, message: 'Fee rate cannot exceed 100%' },
              })}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded text-sm font-bold outline-none focus:ring-2 focus:ring-redtab"
            />
            {errors.supplierFeeRate && <p className="mt-1 text-xs text-red-600">{errors.supplierFeeRate.message}</p>}
          </div>
        </div>

        <div className="p-8 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
          <Info size={24} className="text-amber-600 shrink-0" />
          <p className="text-xs+ text-amber-800 font-medium leading-relaxed italic">
            These terms will be applied to all future Purchase Financing contracts involving this partner. Changes require administrative override.
          </p>
        </div>

        {createSupplier.isError && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-bold text-red-800">Failed to create supplier</p>
              <p className="text-xs text-red-600">
                {createSupplier.error instanceof Error
                  ? createSupplier.error.message
                  : 'Please try again or contact support'}
              </p>
            </div>
          </div>
        )}
      </div>

      <StepNavigationButtons
        step={step}
        totalSteps={totalSteps}
        isSubmitting={isSubmitting}
        onBack={onBack}
        isLastStep={true}
      />
    </div>
  );
};

export default Step3CommercialTerms;
