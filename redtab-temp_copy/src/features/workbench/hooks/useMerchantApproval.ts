import { useCallback } from 'react';
import { CreditTier, Merchant } from '@/types';
import { useVerifyMerchant } from '@/features/merchants/hooks';
import { useToastContext } from '@/components/common/ToastContainer';
import { PolicyConfig } from '@/features/merchants/hooks/usePolicyConfig';

interface UseMerchantApprovalProps {
  merchantId: string | undefined;
  selectedMerchant: Merchant | undefined;
  policyConfig: PolicyConfig | null | undefined;
}

export const useMerchantApproval = ({
  merchantId,
  selectedMerchant,
  policyConfig
}: UseMerchantApprovalProps) => {
  const { show: showToast } = useToastContext();
  const verifyMerchantMutation = useVerifyMerchant();

  const approveMerchant = useCallback(
    (tier: CreditTier, forceReason?: string) => {
      if (!merchantId || !selectedMerchant || !policyConfig) return;

      const creditScore = selectedMerchant.creditScore || 75;
      const trustScore = selectedMerchant.trustScore || 70;
      const approvedLimit = policyConfig.TIERS[tier]?.maxLimit || 0;
      const isForced = !!forceReason;

      verifyMerchantMutation.mutate(
        {
          id: merchantId,
          tier,
          creditScore,
          trustScore,
          approvedLimit,
          ...(isForced && { force: true, forceReason }),
        },
        {
          onSuccess: () => {
            showToast({
              type: 'SUCCESS',
              title: isForced ? 'Merchant Force-Approved' : 'Merchant Approved',
              message: `${selectedMerchant.name} has been approved for ${tier} tier.`
            });
          },
          onError: (error) => {
            showToast({
              type: 'DANGER',
              title: 'Approval Failed',
              message: error.message || 'Failed to approve merchant. Please try again.'
            });
          }
        }
      );
    },
    [merchantId, selectedMerchant, policyConfig, verifyMerchantMutation, showToast]
  );

  return {
    approveMerchant,
    isApproving: verifyMerchantMutation.isPending
  };
};
