import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '@/components/common/ToastContainer';
import { apiClient } from '@/lib/api';

export interface ManualSettlementPayload {
  amount: number;
  reference_note?: string;
  bank_tx_ref?: string;
  value_date?: string;
}

export interface ManualSettlementResponse {
  transactionId: string;
  providerId: string;
  amount: number;
  currency: string;
  balanceAfter: number;
  reference_note?: string;
  bank_tx_ref?: string;
  value_date?: string;
  createdAt: Date;
  message: string;
}

/**
 * Hook to record manual supplier settlement
 *
 * This records money that was already paid to supplier outside the system
 * to reconcile settlement balance with actual bank transfers.
 */
export const useManualSupplierSettlement = (supplierId: string) => {
  const queryClient = useQueryClient();
  const { show } = useToastContext();

  return useMutation({
    mutationFn: async (payload: ManualSettlementPayload): Promise<ManualSettlementResponse> => {
      return apiClient.post<ManualSettlementResponse>(
        `/provider-balances/${supplierId}/manual-settlement`,
        payload
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['supplier-balance', supplierId],
      });
      queryClient.invalidateQueries({
        queryKey: ['supplier-transactions', supplierId],
      });

      show({
        type: 'SUCCESS',
        title: 'Settlement Recorded',
        message: `Manual settlement of ${data.amount} ${data.currency} recorded successfully`,
      });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to record settlement';
      show({
        type: 'DANGER',
        title: 'Error',
        message: errorMessage,
      });
    },
  });
};
