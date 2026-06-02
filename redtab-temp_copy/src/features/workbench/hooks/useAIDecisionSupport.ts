import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getDecisionSupport, AiInsightResult } from '@/lib/geminiService';

interface DecisionSupportPayload {
  merchant: Record<string, unknown>;
  scoring: Record<string, unknown>;
  policy: Record<string, unknown>;
  language?: string;
  forceRefresh?: boolean;
}

export function useAIDecisionSupport(
  options?: Omit<UseMutationOptions<AiInsightResult, Error, DecisionSupportPayload>, 'mutationFn'>
) {
  const { i18n } = useTranslation();

  return useMutation<AiInsightResult, Error, DecisionSupportPayload>({
    mutationFn: async (payload: DecisionSupportPayload) => {
      return getDecisionSupport(
        payload.merchant,
        payload.scoring,
        payload.policy,
        payload.language || i18n.language || 'en',
        payload.forceRefresh,
      );
    },
    ...options,
  });
}
