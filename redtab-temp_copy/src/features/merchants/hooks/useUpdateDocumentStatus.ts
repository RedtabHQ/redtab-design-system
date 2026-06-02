import { useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantService } from '@/lib/apiService';
import type { KycStatusResponse } from '@types';

export interface UpdateDocumentStatusParams {
  merchantId: string;
  documentType: string;
  status: string;
  rejectionReason?: string;
  notes?: string;
}

export function useUpdateDocumentStatus() {
  const queryClient = useQueryClient();

  return useMutation<KycStatusResponse, Error, UpdateDocumentStatusParams>({
    mutationFn: async ({ merchantId, documentType, status, rejectionReason, notes }) => {
      return merchantService.updateDocumentStatus(merchantId, documentType, {
        status,
        rejectionReason,
        notes,
      });
    },
    onSuccess: (_, { merchantId }) => {
      queryClient.invalidateQueries({ queryKey: ['merchant', merchantId, 'kyc-status'] });
    },
  });
}
