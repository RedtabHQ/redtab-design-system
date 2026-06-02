import React, { useMemo, lazy, Suspense } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  Activity,
  Target,
  Building2,
  BrainCircuit,
  AlertCircle } from 'lucide-react';
import { Spinner, Skeleton } from '@/components/common';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { PageHeader } from '@/components/common/PageHeader';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrencyAbbreviated } from '@/utils/currencyFormatter';
import { usePortfolioSummary } from '@/features/dashboard/hooks/useDashboard';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';

const CapitalExposureChart = lazy(() =>
  import('@/features/contracts/components/CapitalExposureChart').then(m => ({ default: m.CapitalExposureChart }))
);

const PortfolioRiskView: React.FC = () => {
  const { selectedSegment, isGlobalView } = useMarketSegment();
  const { symbol: currencySymbol, currency } = useCurrency();

  const currentMarketSegmentId = selectedSegment?.id;
  const currentMarketSegment = selectedSegment?.name;
  const isGlobal = isGlobalView;

  // Fetch consolidated portfolio summary (optimized: 1 call instead of 2)
  const {
    data: summary,
    isLoading,
    error,
  } = usePortfolioSummary(isGlobal ? undefined : currentMarketSegmentId);

  const riskMetrics = summary?.riskMetrics;
  const tierDistribution = summary?.tierDistribution;

  const tierData = useMemo(() => {
    if (!tierDistribution) return [];

    return [
      { name: 'Tier A (Elite)', value: tierDistribution.T1?.count || 0, color: '#000000' },
      { name: 'Tier B (Standard)', value: tierDistribution.T2?.count || 0, color: '#E61E2A' },
      { name: 'Tier C (Emerging)', value: tierDistribution.T3?.count || 0, color: '#4F46E5' },
    ];
  }, [tierDistribution]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Target className="text-redtab" /> Loading Portfolio Data...
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-24 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 pb-20">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-500" size={20} />
            <p className="font-semibold text-red-800">Error loading portfolio data</p>
          </div>
          <p className="text-sm text-red-600">{error?.message || 'Failed to fetch portfolio data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <PageHeader
        icon={<Target className="text-redtab" size={28} />}
        title={isGlobal ? 'Global Risk Analytics' : `${currentMarketSegment} Portfolio Analysis`}
        subtitle={`Strategic health monitoring for ${isGlobal ? 'all operating markets' : 'the local segment'}.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPIBox label="Total Exposure" value={formatCurrencyAbbreviated(riskMetrics?.totalExposure || 0, currency, currencySymbol)} subtext="Credit Exposure" icon={TrendingUp} />
        <KPIBox label="Average Utilization" value={`${(riskMetrics?.averageUtilization || 0).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`} subtext="Portfolio Utilization" icon={Activity} />
        <KPIBox label="High Risk Merchants" value={riskMetrics?.highRiskMerchants.toString() || '0'} subtext="Risk Distribution" icon={Building2} />
        <KPIBox label="Default Rate" value={`${(riskMetrics?.defaultRate || 0).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`} subtext="Portfolio Risk" icon={ShieldAlert} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="md" variant="primary" />
              <p className="text-xs font-medium text-gray-500">Loading chart...</p>
            </div>
          </div>
        }>
          <CapitalExposureChart tierData={tierData} />
        </Suspense>
        <div className="bg-gray-900 p-10 rounded-xl text-white shadow-2xl flex flex-col justify-center">
           <div className="flex items-center gap-3 mb-6">
              <BrainCircuit size={32} className="text-redtab" />
              <h3 className="text-xl font-black tracking-tight">AI Segment Narrative</h3>
           </div>
           <p className="text-lg text-gray-300 leading-relaxed font-medium italic border-l-2 border-redtab pl-6">
             "{isGlobal ? 'Consolidated performance is stable. Portfolio concentration risk at ' + (riskMetrics?.concentrationRisk || 0).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%. Monitor high-risk merchant exposure.' : `In the ${selectedSegment?.name} market, concentration risk stands at ${(riskMetrics?.concentrationRisk || 0).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%. Recommend diversification strategy.`}"
           </p>
        </div>
      </div>
    </div>
  );
};

interface KPIBoxProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ComponentType<{ size: number }>;
}

const KPIBox = ({ label, value, subtext, icon: Icon }: KPIBoxProps) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-black text-gray-900">{value}</span>
    </div>
    <p className="text-2xs text-gray-400 mt-2 flex items-center gap-1 font-bold">
      <Icon size={12} /> {subtext}
    </p>
  </div>
);

export default PortfolioRiskView;
