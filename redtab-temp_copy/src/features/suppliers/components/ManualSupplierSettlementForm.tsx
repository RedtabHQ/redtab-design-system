import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AlertCircle, CheckCircle2, Banknote } from 'lucide-react';
import { useManualSupplierSettlement } from '../hooks/useManualSupplierSettlement';
import { formatCurrency } from '@/utils/currencyFormatter';
import { Card, Button, Input, Spinner } from '@/components/common';
import DateTimePickerField from '@/components/common/DateTimePickerField';

export interface ManualSettlementFormData {
  amount: number;
  reference_note?: string;
  bank_tx_ref?: string;
  value_date?: string;
}

interface ManualSupplierSettlementFormProps {
  supplierId: string;
  supplierName: string;
  availableBalance: number;
  currency: string;
  currencySymbol?: string;
  onSuccess?: () => void;
}

export const ManualSupplierSettlementForm: React.FC<ManualSupplierSettlementFormProps> = ({
  supplierId,
  supplierName,
  availableBalance,
  currency,
  currencySymbol,
  onSuccess,
}) => {
  const [clientError, setClientError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const displaySymbol = currencySymbol ?? currency;
  const recordSettlement = useManualSupplierSettlement(supplierId);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
    watch,
  } = useForm<ManualSettlementFormData>({
    mode: 'onBlur',
    defaultValues: {
      amount: 0,
      reference_note: '',
      bank_tx_ref: '',
      value_date: new Date().toISOString().split('T')[0],
    },
  });

  const watchAmount = watch('amount');

  const onSubmit = async (data: ManualSettlementFormData) => {
    setClientError(null);
    setSuccessMessage(null);

    if (data.amount <= 0) {
      setClientError('Settlement amount must be greater than 0');
      return;
    }

    if (data.amount > availableBalance) {
      setClientError(
        `Settlement amount (${formatCurrency(data.amount, currency, displaySymbol)}) exceeds available balance (${formatCurrency(availableBalance, currency, displaySymbol)})`
      );
      return;
    }

    recordSettlement.mutate(data, {
      onSuccess: (result) => {
        setSuccessMessage(result.message);
        reset();
        setTimeout(() => {
          setSuccessMessage(null);
          onSuccess?.();
        }, 3000);
      },
    });
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
          <Banknote className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">
            Manual Supplier Settlement
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Record supplier payout already made outside the system to reconcile settlement balance.
          </p>
        </div>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          <span className="font-bold">Not merchant repayment.</span> This records money already paid
          outside the system (e.g., manual bank transfer, ops payout).
        </p>
      </div>

      {/* Balance summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
          <p className="text-2xs font-black uppercase tracking-[0.25em] text-gray-400 mb-1">
            Supplier
          </p>
          <p className="text-sm font-bold text-gray-900">{supplierName}</p>
        </div>
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
          <p className="text-2xs font-black uppercase tracking-[0.25em] text-gray-400 mb-1">
            Available Balance
          </p>
          <p className="text-sm font-black text-gray-900">
            {formatCurrency(availableBalance, currency, displaySymbol)}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Settlement Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              max={availableBalance}
              placeholder="0.00"
              className={`input font-mono ${errors.amount ? 'ring-2 ring-red-500 border-red-500' : ''}`}
              {...register('amount', {
                required: 'Amount is required',
                valueAsNumber: true,
                min: { value: 0.01, message: 'Amount must be greater than 0' },
                max: {
                  value: availableBalance,
                  message: `Cannot exceed available balance (${formatCurrency(availableBalance, currency, displaySymbol)})`,
                },
              })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
              {displaySymbol}
            </span>
          </div>
          {errors.amount && (
            <p className="text-red-500 text-xs font-medium mt-1">{errors.amount.message}</p>
          )}
          {watchAmount > 0 && !errors.amount && (
            <p className="text-xs text-gray-500 mt-1">
              Remaining after settlement:{' '}
              <span className="font-bold">
                {formatCurrency(availableBalance - watchAmount, currency, displaySymbol)}
              </span>
            </p>
          )}
        </div>

        {/* Bank Transaction Reference */}
        <Input
          label="Bank Transaction Reference"
          placeholder="e.g., TXN20240115-0001234"
          helperText="Used for idempotency — prevents duplicate settlements with same reference"
          {...register('bank_tx_ref')}
        />

        {/* Value Date */}
        <Controller
          name="value_date"
          control={control}
          render={({ field }) => (
            <DateTimePickerField
              label="Value Date"
              value={field.value}
              onChange={field.onChange}
              variant="compact"
              error={errors.value_date?.message}
            />
          )}
        />

        {/* Reference Note */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reference Note
          </label>
          <textarea
            placeholder="e.g., Manual bank transfer to supplier account..."
            rows={2}
            className="input resize-none"
            {...register('reference_note')}
          />
        </div>

        {/* Error */}
        {clientError && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800">{clientError}</p>
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800">{successMessage}</p>
          </div>
        )}

        {/* Submit */}
        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={recordSettlement.isPending || !isDirty}
          className="w-full"
        >
          {recordSettlement.isPending ? (
            <>
              <Spinner size="sm" variant="white" />
              Recording Settlement...
            </>
          ) : (
            'Record Manual Settlement'
          )}
        </Button>
      </form>
    </Card>
  );
};
