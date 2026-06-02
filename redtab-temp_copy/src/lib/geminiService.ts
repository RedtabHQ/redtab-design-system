import { apiClient } from '@/lib/api';
import i18n from 'i18next';

const getCurrentLanguage = (language?: string): string => {
  return language || i18n.language || 'en';
};

export interface AiInsightResult {
  content: string;
  generatedAt: string;
  cached: boolean;
}

export const getRiskExplanation = async (
  merchantData: unknown,
  language?: string,
  forceRefresh?: boolean,
): Promise<AiInsightResult> => {
  try {
    const response = (await apiClient.post<{ explanation: string; generatedAt: string; cached: boolean }>(
      'ai-insights/risk-explanation',
      { merchantData, language: getCurrentLanguage(language), forceRefresh }
    )) as unknown as { explanation: string; generatedAt: string; cached: boolean };
    return { content: response.explanation, generatedAt: response.generatedAt, cached: response.cached };
  } catch (error) {
    console.error('AI Insights API Error:', error);
    return { content: 'Assessment currently unavailable.', generatedAt: '', cached: false };
  }
};

export const getContractAnalysis = async (
  contract: unknown,
  merchant: unknown,
  language?: string,
  forceRefresh?: boolean,
): Promise<AiInsightResult> => {
  try {
    const response = (await apiClient.post<{ analysis: string; generatedAt: string; cached: boolean }>(
      'ai-insights/contract-analysis',
      { contract, merchant, language: getCurrentLanguage(language), forceRefresh }
    )) as unknown as { analysis: string; generatedAt: string; cached: boolean };
    return { content: response.analysis, generatedAt: response.generatedAt, cached: response.cached };
  } catch (error) {
    console.error('AI Insights API Error:', error);
    return { content: 'Contract analysis unavailable.', generatedAt: '', cached: false };
  }
};

export const getCollectionDraft = async (
  merchant: unknown,
  contract: unknown,
  tone: string,
  language?: string
): Promise<string> => {
  try {
    const response = (await apiClient.post<{ draft: string }>(
      'ai-insights/collection-draft',
      { merchant, contract, tone, language: getCurrentLanguage(language) }
    )) as unknown as { draft: string };
    return response.draft;
  } catch (error) {
    console.error('AI Insights API Error:', error);
    return 'Could not draft message.';
  }
};

export const getLiquidityForecast = async (
  txHistory: Array<{ id: string; amount: number; type: string; createdAt: string }>,
  activeContracts: Array<{ id: string; totalAmount: number; dueDate: string }>,
  language?: string,
  forceRefresh?: boolean,
): Promise<AiInsightResult> => {
  try {
    const response = (await apiClient.post<{ forecast: string; generatedAt: string; cached: boolean }>(
      'ai-insights/liquidity-forecast',
      { txHistory, activeContracts, language: getCurrentLanguage(language), forceRefresh }
    )) as unknown as { forecast: string; generatedAt: string; cached: boolean };
    return { content: response.forecast, generatedAt: response.generatedAt, cached: response.cached };
  } catch (error) {
    console.error('AI Insights API Error:', error);
    return { content: 'Liquidity forecast unavailable.', generatedAt: '', cached: false };
  }
};

export const getSupplierRiskAssessment = async (
  supplierData: unknown,
  language?: string,
  forceRefresh?: boolean,
): Promise<AiInsightResult> => {
  try {
    const response = (await apiClient.post<{ assessment: string; generatedAt: string; cached: boolean }>(
      'ai-insights/supplier-risk-assessment',
      { supplierData, language: getCurrentLanguage(language), forceRefresh }
    )) as unknown as { assessment: string; generatedAt: string; cached: boolean };
    return { content: response.assessment, generatedAt: response.generatedAt, cached: response.cached };
  } catch (error) {
    console.error('AI Insights API Error:', error);
    return { content: 'Supplier analysis unavailable.', generatedAt: '', cached: false };
  }
};

export const explainScoringLogic = async (
  weights: unknown,
  language?: string,
  forceRefresh?: boolean,
): Promise<AiInsightResult> => {
  try {
    const response = (await apiClient.post<{ explanation: string; generatedAt: string; cached: boolean }>(
      'ai-insights/explain-scoring-logic',
      { weights, language: getCurrentLanguage(language), forceRefresh }
    )) as unknown as { explanation: string; generatedAt: string; cached: boolean };
    return { content: response.explanation, generatedAt: response.generatedAt, cached: response.cached };
  } catch (error) {
    console.error('AI Insights API Error:', error);
    return { content: 'Could not generate analysis at this time.', generatedAt: '', cached: false };
  }
};

export const analyzePolicyImpact = async (
  config: unknown,
  language?: string,
  forceRefresh?: boolean,
): Promise<AiInsightResult> => {
  try {
    const response = (await apiClient.post<{ analysis: string; generatedAt: string; cached: boolean }>(
      'ai-insights/analyze-policy-impact',
      { config, language: getCurrentLanguage(language), forceRefresh }
    )) as unknown as { analysis: string; generatedAt: string; cached: boolean };
    return { content: response.analysis, generatedAt: response.generatedAt, cached: response.cached };
  } catch (error) {
    console.error('AI Insights API Error:', error);
    return { content: 'Policy analysis service unavailable.', generatedAt: '', cached: false };
  }
};

export const getDecisionSupport = async (
  merchant: unknown,
  scoring: unknown,
  policy: unknown,
  language?: string,
  forceRefresh?: boolean,
): Promise<AiInsightResult> => {
  try {
    const response = (await apiClient.post<{ memo: string; generatedAt: string; cached: boolean }>(
      'ai-insights/decision-support',
      { merchant, scoring, policy, language: getCurrentLanguage(language), forceRefresh }
    )) as unknown as { memo: string; generatedAt: string; cached: boolean };
    return { content: response.memo, generatedAt: response.generatedAt, cached: response.cached };
  } catch (error) {
    console.error('AI Insights API Error:', error);
    return { content: 'Decision support analysis failed.', generatedAt: '', cached: false };
  }
};

export const queryPolicyAssistant = async (query: string, language?: string): Promise<string> => {
  try {
    const response = (await apiClient.post<{ response: string }>(
      'ai-insights/query-policy-assistant',
      { query, language: getCurrentLanguage(language) }
    )) as unknown as { response: string };
    return response.response;
  } catch (error) {
    console.error('AI Insights API Error:', error);
    return 'Policy assistant unavailable.';
  }
};
