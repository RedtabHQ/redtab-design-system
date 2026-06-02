import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/common';
import { useOutletContext } from 'react-router-dom';
import { SearchInput } from '@/components/SearchInput';
import ScoringMetric from '@/features/contracts/components/ScoringMetric';
import { trustSignalsService } from '@/features/workbench/services/trustSignalsApi';
import type { Merchant, ScoringMetricData, TrustSignalsResponse } from '@/types';

const ComplianceScoreRadar = lazy(() =>
  import('@/features/contracts/components/ComplianceScoreRadar').then(m => ({ default: m.ComplianceScoreRadar }))
);

interface OutletContext {
  merchant: Merchant;
}

// Helper function to format category names
const formatCategoryName = (key: string): string => {
  return key.replace(/_/g, ' ');
};

// Helper function to format sub-score names
const formatSubScoreName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, ' ');
};

// Weight mapping based on scoring configuration defaults
const CATEGORY_WEIGHTS: Record<string, number> = {
  PURCHASE_HISTORY: 30,
  POS_DATA: 20,
  CASH_FLOW: 25,
  SOCIAL_MEDIA: 10,
  BUSINESS_INFO: 15,
};

export const TrustSignalsPage: React.FC = () => {
  const { merchant } = useOutletContext<OutletContext>();
  const [internalSearch, setInternalSearch] = useState('');
  const providerId = merchant?.id;

  const {
    data: trustSignalsData,
    isLoading,
    error,
  } = useQuery<TrustSignalsResponse>({
    queryKey: ['trustSignals', providerId],
    queryFn: () => trustSignalsService.getTrustSignals(providerId as string),
    enabled: !!providerId,
  });

  const errorMessage = !providerId
    ? 'No provider ID available'
    : error
      ? error instanceof Error
        ? error.message
        : 'Failed to load trust signals'
      : null;

  const handleSearchChange = (value: string) => {
    setInternalSearch(value);
  };

  // Convert API response to ScoringMetricData format
  const trustSignalsMetrics = useMemo((): ScoringMetricData[] => {
    if (!trustSignalsData?.providerScore?.breakdown) {
      return [];
    }

    const breakdown = trustSignalsData.providerScore.breakdown;
    const metrics: ScoringMetricData[] = [];

    Object.entries(breakdown).forEach(([categoryKey, categoryData]) => {
      if (categoryData && categoryData.score !== undefined) {
        const weight = CATEGORY_WEIGHTS[categoryKey] || 0;
        const subScoreNames = categoryData.subScores
          ? Object.keys(categoryData.subScores).map(formatSubScoreName)
          : [];

        metrics.push({
          label: formatCategoryName(categoryKey),
          weight: `${weight}%`,
          score: Math.round(categoryData.score),
          subs: subScoreNames,
        });
      }
    });

    return metrics;
  }, [trustSignalsData]);

  const filteredTrustSignals = useMemo(() => {
    if (!internalSearch.trim()) return trustSignalsMetrics;
    const searchLower = internalSearch.toLowerCase();
    return trustSignalsMetrics.filter((metric: ScoringMetricData) =>
      metric.label.toLowerCase().includes(searchLower) ||
      metric.subs.some((sub: string) => sub.toLowerCase().includes(searchLower))
    );
  }, [internalSearch, trustSignalsMetrics]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="flex flex-col items-center justify-center py-24">
          <Spinner size="lg" variant="primary" className="mb-4" />
          <p className="text-sm font-medium text-gray-400">Loading trust signals...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (errorMessage) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="flex flex-col items-center justify-center py-24">
          <AlertCircle className="h-8 w-8 text-yellow-500 mb-4" />
          <p className="text-sm font-medium text-gray-300 mb-2">Failed to load trust signals</p>
          <p className="text-xs text-gray-400">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!trustSignalsData?.hasData) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="flex flex-col items-center justify-center py-24">
          <AlertCircle className="h-8 w-8 text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-300 mb-2">No trust signals available</p>
          <p className="text-xs text-gray-400">Trust signals have not been calculated for this merchant yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="mb-8">
        <SearchInput
          value={internalSearch}
          onChange={handleSearchChange}
          placeholder="Filter trust signals and metrics..."
          className="max-w-md"
        />
      </div>

      <h4 className="text-2xs font-black text-gray-400 uppercase tracking-widest">TRUST SCORE COMPOSITION MATRIX</h4>
      {filteredTrustSignals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {filteredTrustSignals.map((metric: ScoringMetricData, idx: number) => (
              <ScoringMetric key={idx} label={metric.label} weight={metric.weight} score={metric.score} subs={metric.subs} />
            ))}
          </div>
          <Suspense fallback={
            <div className="bg-gray-900 p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-8 h-96">
              <div className="flex flex-col items-center gap-3">
                <Spinner size="md" variant="primary" />
                <p className="text-xs font-medium text-gray-400">Loading radar...</p>
              </div>
            </div>
          }>
            <ComplianceScoreRadar />
          </Suspense>
        </div>
      ) : (
        <div className="py-16 text-center">
          <Search size={32} className="mx-auto mb-4 text-gray-300" />
          <p className="text-sm text-gray-400">No trust signals match "{internalSearch || ''}"</p>
        </div>
      )}
    </div>
  );
};

export default TrustSignalsPage;
