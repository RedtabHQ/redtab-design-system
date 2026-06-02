import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface KillSwitchConfirmModalProps {
  isOpen: boolean;
  isLoading: boolean;
  willEnable: boolean;
  onConfirm: (reason?: string) => Promise<void>;
  onCancel: () => void;
}

/**
 * Confirmation modal for Kill Switch activation/deactivation
 * Shows warning with reason input when enabling kill switch
 */
export const KillSwitchConfirmModal: React.FC<KillSwitchConfirmModalProps> = ({
  isOpen,
  isLoading,
  willEnable,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (willEnable && !reason.trim()) {
      setError('Reason is required when activating kill switch');
      return;
    }

    try {
      await onConfirm(reason || undefined);
      setReason('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCancel = () => {
    setReason('');
    setError(null);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div
          className={`px-8 py-6 border-b ${
            willEnable
              ? 'bg-red-50 border-red-100'
              : 'bg-green-50 border-green-100'
          }`}
        >
          <div className="flex items-center gap-3">
            {willEnable ? (
              <AlertTriangle className="text-red-600" size={24} />
            ) : (
              <ShieldAlert className="text-green-600" size={24} />
            )}
            <div>
              <h2 className="text-lg font-black text-gray-900">
                {willEnable ? 'Activate Kill Switch?' : 'Deactivate Kill Switch?'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {willEnable
                  ? 'System will be frozen - no operations allowed'
                  : 'System operations will resume'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-4">
          <p className="text-sm text-gray-600">
            {willEnable
              ? 'This will immediately freeze all system operations (contracts, drawdowns, repayments). This action cannot be undone without manual intervention.'
              : 'All system operations will resume normal functionality.'}
          </p>

          {willEnable && (
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-widest">
                Reason for Activation *
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError(null);
                }}
                placeholder="Explain why the kill switch is being activated..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
              />
              {error && (
                <p className="text-xs text-red-600 font-semibold">{error}</p>
              )}
            </div>
          )}

          {!willEnable && error && (
            <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2 text-sm font-black text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-6 py-2 text-sm font-black text-white rounded-lg transition-all disabled:opacity-50 ${
              willEnable
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading
              ? 'Processing...'
              : willEnable
                ? 'Activate Kill Switch'
                : 'Deactivate Kill Switch'}
          </button>
        </div>
      </div>
    </div>
  );
};
