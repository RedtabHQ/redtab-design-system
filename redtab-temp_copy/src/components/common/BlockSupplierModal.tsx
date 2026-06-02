import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface BlockSupplierModalProps {
  isOpen: boolean;
  supplierName: string;
  isBlocking: boolean; // true = block, false = unblock
  isLoading?: boolean;
  onConfirm: (reason: string) => void | Promise<void>;
  onCancel: () => void;
}

const BLOCK_REASONS = [
  'Fraudulent activity detected',
  'Non-compliance with terms',
  'Payment default',
  'Quality issues',
  'Customer complaints',
  'Other',
];

export const BlockSupplierModal: React.FC<BlockSupplierModalProps> = ({
  isOpen,
  supplierName,
  isBlocking,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    const finalReason = reason === 'Other' ? customReason : reason;
    if (!finalReason.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirm(finalReason);
    } finally {
      setIsSubmitting(false);
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const resetForm = () => {
    setReason('');
    setCustomReason('');
  };

  const finalReason = reason === 'Other' ? customReason : reason;
  const isFormValid = finalReason.trim().length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
        onClick={handleCancel}
      />

      {/* Modal Panel */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-red-50 flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {isBlocking ? 'Block Supplier' : 'Unblock Supplier'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{supplierName}</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              {isBlocking
                ? 'Please provide a reason for blocking this supplier. This action will prevent them from processing transactions.'
                : 'Please provide a reason for unblocking this supplier.'}
            </p>

            {isBlocking && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Reason for Blocking
                </label>
                <div className="space-y-2">
                  {BLOCK_REASONS.map((r) => (
                    <label
                      key={r}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reason === r}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={isSubmitting}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{r}</span>
                    </label>
                  ))}
                </div>

                {reason === 'Other' && (
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Please specify the reason..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    disabled={isSubmitting}
                  />
                )}
              </div>
            )}

            {!isBlocking && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Reason for Unblocking
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please provide a reason..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>

          {/* Footer / Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/20 flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || isLoading || !isFormValid}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                isBlocking
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSubmitting || isLoading
                ? 'Processing...'
                : isBlocking
                  ? 'Block Supplier'
                  : 'Unblock Supplier'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockSupplierModal;
