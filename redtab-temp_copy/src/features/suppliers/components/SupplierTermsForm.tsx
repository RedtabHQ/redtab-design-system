import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Settings, Zap, Calendar, DollarSign, AlertTriangle, AlertCircle } from 'lucide-react';
import { ResetIcon, CheckIcon } from '@/components/icons';
import { InlineSpinner } from '@/components/common';
import { SettlementMode } from '@/types';
import { validationSchemas } from '@/utils/validators';
import { usePatchSupplier } from '../hooks/useSuppliers';
import { useToastContext } from '@/components/common';

export interface CommercialTermsFormData {
  settlementMode: SettlementMode;
  paymentTermDays: number;
  supplierFeeRate: number;
  numberOfDisbursementPeriods: number;
}

interface SupplierTermsFormProps {
  supplierId: string;
  initialValues: CommercialTermsFormData;
}

const RiskWarning: React.FC = () => (
  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
    <AlertTriangle size={16} className="text-amber-600 mt-0.5" />
    <div className="space-y-1">
      <p className="text-2xs font-black text-amber-900 uppercase">Risk Consideration</p>
      <p className="text-2xs text-amber-700 leading-relaxed">
        Deferred payments (Net 30+) reduce Redtab's working capital cost but increase reconciliation complexity.
      </p>
    </div>
  </div>
);

export const SupplierTermsForm: React.FC<SupplierTermsFormProps> = ({
  supplierId,
  initialValues,
}) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const patchSupplier = usePatchSupplier();
  const toast = useToastContext();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CommercialTermsFormData>({
    mode: 'onBlur',
    defaultValues: initialValues,
  });

  const paymentTermDays = watch('paymentTermDays');
  const supplierFeeRate = watch('supplierFeeRate');
  const numberOfDisbursementPeriods = watch('numberOfDisbursementPeriods');
  const disbursementPeriodValue = numberOfDisbursementPeriods ?? 1;

  // Reset form when initialValues change
  useEffect(() => {
    reset(initialValues);
    setServerError(null);
  }, [initialValues, reset]);

  const onSubmit = async (data: CommercialTermsFormData) => {
    try {
      setServerError(null);

      await patchSupplier.mutateAsync({
        id: supplierId,
        data: {
          settlementMode: data.settlementMode,
          paymentTermDays: data.paymentTermDays,
          supplierFeeRate: data.supplierFeeRate,
          numberOfDisbursementPeriods: data.numberOfDisbursementPeriods,
        },
      });

      toast.show({
        type: 'SUCCESS',
        title: 'Saved successfully',
        message: 'Commercial terms have been updated.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to save commercial terms. Please try again.';
      setServerError(errorMessage);
    }
  };

  const handleReset = () => {
    reset(initialValues);
    setServerError(null);
  };

  return (
    <div className="space-y-4">
      {/* Server Error Message */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in duration-300">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">Failed to save</p>
            <p className="text-sm text-red-700 mt-1">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Commercial Terms Configuration */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <h3 className="font-bold flex items-center gap-2 text-gray-900 uppercase text-xs tracking-widest">
              <Settings size={18} className="text-redtab" /> Commercial & Payment Terms
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={!isDirty || isSubmitting}
                className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Reset to original values"
              >
                <ResetIcon className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <InlineSpinner size="sm" variant="white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-3 h-3" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Settlement Mode */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                <span>Settlement Mode</span>
                <Zap size={14} className="text-amber-500" />
              </div>
              <Controller
                name="settlementMode"
                control={control}
                rules={validationSchemas.supplierProfile.settlementMode}
                render={({ field }) => (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {Object.values(SettlementMode).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => field.onChange(mode)}
                          className={`px-3 py-2 rounded-xl text-2xs font-black uppercase transition-all border ${
                            field.value === mode
                              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                              : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          {mode.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                    {errors.settlementMode && (
                      <p className="text-xs text-red-600">{errors.settlementMode.message}</p>
                    )}
                  </div>
                )}
              />
              <p className="text-2xs text-gray-400 italic leading-relaxed">
                Determines if payouts are triggered per-transaction, daily in batches, or held until a fixed date.
              </p>
            </div>

            {/* Payment Term Days */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                <span>Payment Term (Days)</span>
                <Calendar size={14} className="text-indigo-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="90"
                    step="1"
                    className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-redtab"
                    {...register('paymentTermDays', {
                      ...validationSchemas.supplierProfile.paymentTermDays,
                      valueAsNumber: true,
                    })}
                  />
                  <span className="text-sm font-black text-gray-900 min-w-[60px] text-right">
                    {paymentTermDays === 0 ? 'Immediate' : `${paymentTermDays ?? 0} Days`}
                  </span>
                </div>
                {errors.paymentTermDays && (
                  <p className="text-xs text-red-600">{errors.paymentTermDays.message}</p>
                )}
              </div>
            </div>

            {/* Number of Disbursement Periods */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                <span>Disbursement Periods</span>
                <span className="text-2xs font-black text-gray-300">1-12</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    className={`w-24 px-4 py-2 bg-gray-50 border rounded-xl text-sm font-bold focus:ring-1 focus:ring-redtab outline-none ${
                      errors.numberOfDisbursementPeriods ? 'border-red-500' : 'border-gray-100'
                    }`}
                    {...register('numberOfDisbursementPeriods', {
                      ...validationSchemas.supplierProfile.numberOfDisbursementPeriods,
                      valueAsNumber: true,
                    })}
                  />
                  <span className="text-xs font-semibold text-gray-500">
                    {disbursementPeriodValue > 1
                      ? `Split into ${disbursementPeriodValue} releases`
                      : 'Single release'}
                  </span>
                </div>
                <p className="text-2xs text-gray-400 leading-relaxed">
                  Define how many releases the payout should be split into after amounts move to pending.
                </p>
                {errors.numberOfDisbursementPeriods && (
                  <p className="text-xs text-red-600">{errors.numberOfDisbursementPeriods.message}</p>
                )}
              </div>
            </div>

            {/* Supplier Fee Rate */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                <span>Supplier Service Fee (%)</span>
                <DollarSign size={14} className="text-green-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    className={`w-24 px-4 py-2 bg-gray-50 border rounded-xl text-sm font-bold focus:ring-1 focus:ring-redtab outline-none ${
                      errors.supplierFeeRate ? 'border-red-500' : 'border-gray-100'
                    }`}
                    value={Math.round((supplierFeeRate || 0) * 10000) / 100}
                    onChange={(e) => {
                      const percentValue = parseFloat(e.target.value) || 0;
                      const decimalValue = Math.round(percentValue * 100) / 10000;
                      setValue('supplierFeeRate', decimalValue, { shouldDirty: true, shouldValidate: true });
                    }}
                  />
                  <span className="text-xs font-bold text-gray-400">% of Gross Amount</span>
                </div>
                {errors.supplierFeeRate && (
                  <p className="text-xs text-red-600">{errors.supplierFeeRate.message}</p>
                )}
              </div>
            </div>

            {/* Risk Warning */}
            <RiskWarning />
          </div>
        </div>
      </form>
    </div>
  );
};
