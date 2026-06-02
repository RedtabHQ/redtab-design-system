import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useToastContext } from '@/components/common/ToastContainer';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { POLICY_CONFIG_QUERY_KEY } from '@/features/merchants/hooks/usePolicyConfig';

interface ResetButtonProps {
  onReset?: () => void;
  className?: string;
}

export const ResetButton: React.FC<ResetButtonProps> = ({
  onReset,
  className = "cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded text-sm font-bold hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { show } = useToastContext();
  const queryClient = useQueryClient();

  const handleResetClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmReset = async () => {
    try {
      setIsLoading(true);
      await apiClient.post('/policies/reset');
      queryClient.invalidateQueries({ queryKey: POLICY_CONFIG_QUERY_KEY });
      onReset?.();

      show({
        type: 'SUCCESS',
        title: 'Success',
        message: 'Policies have been reset to default configuration',
      });

      setShowConfirmModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset policies';
      show({
        type: 'DANGER',
        title: 'Error',
        message: errorMessage,
      });
      console.error('Failed to reset policies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <button
        onClick={handleResetClick}
        disabled={isLoading}
        className={className}
        title="Reset policies to default configuration"
      >
        <RotateCcw size={18} className={isLoading ? 'animate-spin' : ''} />
        {isLoading ? 'Resetting...' : 'Reset'}
      </button>

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Reset Policies"
        message="Are you sure you want to reset all policies to default configuration? This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isLoading}
        onConfirm={handleConfirmReset}
        onCancel={handleCancel}
      />
    </>
  );
};
