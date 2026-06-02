import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import type { Contract } from '@/types';
import { ConfirmationModal } from '@/components/common';

interface ManualRepaymentSectionProps {
  contract: Contract;
  repaymentAmount: string;
  onAmountChange: (amount: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

/**
 * Allows manual entry and reconciliation of contract repayments
 */
export const ManualRepaymentSection: React.FC<ManualRepaymentSectionProps> = ({
  contract,
  repaymentAmount,
  onAmountChange,
  onSubmit,
  isLoading = false,
}) => {
  const isDisabled = !repaymentAmount || contract.status === 'PAID' || isLoading;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleReconcileClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    onSubmit();
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
      <h3 className="text-2xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <DollarSign size={14} /> Manual Post Repayment
      </h3>

      <div className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">
            {contract.currency?.code}
          </span>
          <input
            type="number"
            placeholder="0.00"
            className="w-full pl-16 pr-4 py-4 bg-gray-50 border border-gray-100 rounded text-sm font-bold outline-none focus:ring-2 focus:ring-red-600 shadow-inner transition-all"
            value={repaymentAmount}
            onChange={(e) => onAmountChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleReconcileClick}
          disabled={isDisabled}
          className="w-full py-4 bg-gray-900 text-white rounded font-bold hover:bg-black transition-all shadow-lg disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Reconcile Funds'}
        </button>
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title="Confirm Fund Reconciliation"
        message={`Reconcile ${repaymentAmount} ${contract.currency || contract.marketSegment?.currency || 'NPR'}? This action cannot be undone.`}
        confirmText="Reconcile"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};
