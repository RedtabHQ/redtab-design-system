import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, RotateCw, XCircle } from 'lucide-react';
import { Spinner } from '@/components/common';
import { useProcessPayment, useRetryPayment, useCancelPayment } from '@/features/payment/hooks/usePayments';

const SETTLEMENT_RAILS = [
  { value: 'nchl', label: 'NCHL' },
  { value: 'esewa', label: 'eSewa' },
  { value: 'khalti', label: 'Khalti' },
  { value: 'bank', label: 'Bank Transfer' },
] as const;

interface TransactionActionPanelProps {
  transactionId: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export const TransactionActionPanel: React.FC<TransactionActionPanelProps> = ({
  transactionId,
  status,
}) => {
  const [selectedRail, setSelectedRail] = useState<string | undefined>();
  const [activeAction, setActiveAction] = useState<'process' | 'retry' | 'cancel' | null>(null);

  const processPaymentMutation = useProcessPayment();
  const retryPaymentMutation = useRetryPayment();
  const cancelPaymentMutation = useCancelPayment();

  // Only one mutation should be active at a time
  const activeMutation = activeAction === 'process'
    ? processPaymentMutation
    : activeAction === 'retry'
      ? retryPaymentMutation
      : cancelPaymentMutation;

  const isLoading = activeMutation?.isPending ?? false;

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (activeMutation?.isSuccess) {
      const timer = setTimeout(() => {
        setActiveAction(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeMutation?.isSuccess]);

  const handleProcess = async () => {
    setActiveAction('process');
    await processPaymentMutation.mutateAsync({
      paymentId: transactionId,
      data: selectedRail ? { railId: selectedRail } : undefined,
    });
  };

  const handleRetry = async () => {
    setActiveAction('retry');
    await retryPaymentMutation.mutateAsync(transactionId);
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this payment?')) {
      return;
    }
    setActiveAction('cancel');
    await cancelPaymentMutation.mutateAsync(transactionId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">Payment Actions</h4>
          <p className="text-sm text-gray-500">Manage payment processing for transaction {transactionId}</p>
        </div>
      </div>

      {status === 'PENDING' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
          <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-700">
            This payment is pending processing. Select a settlement rail and click Process to continue.
          </div>
        </div>
      )}

      {status === 'FAILED' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
          <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            This payment failed. You can retry with the same or a different settlement rail.
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {status === 'PENDING' && (
          <>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Settlement Rail</label>
              <select
                value={selectedRail || ''}
                onChange={(e) => setSelectedRail(e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Auto-select best rail</option>
                {SETTLEMENT_RAILS.map((rail) => (
                  <option key={rail.value} value={rail.value}>
                    {rail.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleProcess}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" variant="white" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  Process Payment
                </>
              )}
            </button>
          </>
        )}

        {status === 'FAILED' && (
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" variant="white" />
                Retrying...
              </>
            ) : (
              <>
                <RotateCw size={14} />
                Retry Payment
              </>
            )}
          </button>
        )}

        {status !== 'COMPLETED' && (
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" variant="white" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle size={14} />
                Cancel Payment
              </>
            )}
          </button>
        )}
      </div>

      {activeMutation?.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
          <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            {activeMutation.error?.message || 'An error occurred while processing this payment.'}
          </div>
        </div>
      )}

      {activeMutation?.isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-700">Payment action completed successfully!</div>
        </div>
      )}
    </div>
  );
};

export default TransactionActionPanel;
