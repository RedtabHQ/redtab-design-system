import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  showReasonField?: boolean;
  reasonRequired?: boolean;
  reasonPlaceholder?: string;
  reasonLabel?: string;
  onConfirm: (reason?: string) => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  showReasonField = false,
  reasonRequired = false,
  reasonPlaceholder = 'Enter reason...',
  reasonLabel = 'Reason',
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(reason);
    } finally {
      setIsSubmitting(false);
      setReason('');
    }
  };

  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  const confirmButtonBg = isDangerous
    ? 'bg-redtab hover:bg-red-700'
    : 'bg-blue-600 hover:bg-blue-700';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
        onClick={handleCancel}
      />

      {/* Modal Panel */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {isDangerous && (
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">{message}</p>

            {showReasonField && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {reasonLabel}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={reasonPlaceholder}
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
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || (showReasonField && reasonRequired && !reason.trim())}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${confirmButtonBg}`}
            >
              {isSubmitting || isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
