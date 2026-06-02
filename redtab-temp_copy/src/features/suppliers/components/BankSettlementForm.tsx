import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Hash, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { ResetIcon, CheckIcon } from '@/components/icons';
import { usePatchSupplier } from '../hooks/useSuppliers';
import { useToastContext } from '@/components/common/ToastContainer';
import { InlineSpinner } from '@/components/common';

export interface BankSettlementFormData {
  walletId: string;
}

interface BankSettlementFormProps {
  supplierId: string;
  supplierName: string;
  initialValues: BankSettlementFormData;
}

export const BankSettlementForm: React.FC<BankSettlementFormProps> = ({
  supplierId,
  supplierName,
  initialValues,
}) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const patchSupplier = usePatchSupplier();
  const { show } = useToastContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BankSettlementFormData>({
    mode: 'onBlur',
    defaultValues: initialValues,
  });

  // Reset form when initialValues change
  useEffect(() => {
    reset(initialValues);
    setServerError(null);
  }, [initialValues, reset]);

  const onSubmit = async (data: BankSettlementFormData) => {
    try {
      setServerError(null);

      const updatePayload = {
        bankAccount: data.walletId,
      };

      console.log('🔍 Form data:', data);
      console.log('📤 Sending to backend:', updatePayload);

      await patchSupplier.mutateAsync({
        id: supplierId,
        data: updatePayload,
      });

      // Show success toast notification
      show({
        type: 'SUCCESS',
        title: 'Saved successfully',
        message: 'Bank settlement information has been updated.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to save bank settlement details. Please try again.';
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/10">
            <h3 className="font-bold flex items-center gap-2 text-gray-900 uppercase text-xs tracking-widest">
              <CreditCard size={18} className="text-redtab" /> Wallet Settlement Information
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

          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <label className="text-2xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Hash size={14} className="text-redtab" /> Wallet ID (Moru)
              </label>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter Moru wallet ID"
                  className={`w-full px-4 py-3 bg-white border rounded-xl font-bold text-sm focus:ring-1 focus:ring-redtab outline-none transition-all shadow-sm ${
                    errors.walletId ? 'border-red-500' : 'border-gray-200'
                  }`}
                  {...register('walletId', {
                    required: 'Wallet ID is required',
                    minLength: { value: 4, message: 'Wallet ID must be at least 4 characters' },
                  })}
                />
                {errors.walletId && (
                  <p className="text-xs text-red-600">{errors.walletId.message}</p>
                )}
              </div>

              <p className="text-2xs text-gray-400 italic leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                Provide the Moru settlement wallet ID shared by the supplier. This is all Operations needs to queue payouts.
              </p>
            </div>

            {/* Summary Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50 pt-8">
              <div className="space-y-1">
                <label className="text-2xs font-black text-gray-400 uppercase">Authorized Beneficiary Identity</label>
                <p className="text-sm font-bold text-gray-900 uppercase">{supplierName}</p>
              </div>
              <div className="space-y-1 text-right">
                <label className="text-2xs font-black text-gray-400 uppercase">Settlement Confidence</label>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-bold text-green-600">Manual Verification Active</span>
                  <CheckCircle2 size={14} className="text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
