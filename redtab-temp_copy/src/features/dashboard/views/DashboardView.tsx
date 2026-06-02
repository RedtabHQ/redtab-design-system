
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts';
import { TrendingUp, Users, AlertCircle, CreditCard, ChevronDown, Filter, FileText, Globe, Activity, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useTimezone } from '@/hooks/useTimezone';
import { formatCurrency, formatCurrencyWhole } from '@/utils/currencyFormatter';
import { formatLocalized } from '@/utils/dateFormatter';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';
import { PageHeader } from '@/components/common/PageHeader';
import { KillSwitch } from '@/features/admin/components/GlobalSettings';
import { useOverview, useTrends, useDecisionTime, useUpcomingInstallmentsList } from '@/features/dashboard/hooks/useDashboard';
import { DashboardMetrics, TrendData } from '@/types';
import { UpcomingRepaymentsWidget } from '@/features/dashboard/components/UpcomingRepaymentsWidget';

// DashboardView now integrates with the Dashboard API using React Query
// - Uses useQuery hooks for data fetching with proper caching
// - Supports market segment filtering via query parameters
// - Handles loading and error states gracefully
// - Follows the same pattern as other components in the codebase

const DashboardView: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { selectedSegment, isGlobalView } = useMarketSegment();
  const { symbol: currencySymbol, currency } = useCurrency();
  const { timezone } = useTimezone();

  const activeSegment = selectedSegment;
  const isGlobal = isGlobalView;

  // Get the market segment ID if not in global view
  const marketSegmentId = isGlobal ? undefined : activeSegment?.id;

  // Fetch overview data using useQuery hook
  const {
    data: dashboardData,
    isLoading: isOverviewLoading,
    error: overviewError
  } = useOverview(marketSegmentId);

  const [trendDays, setTrendDays] = useState(7);

  // Fetch trend data using useQuery hook
  const {
    data: trendData = [],
    isLoading: isTrendsLoading,
    error: trendsError
  } = useTrends({ days: trendDays, marketSegmentId, timezone });

  // Fetch decision time metrics
  const {
    data: decisionTimeData,
    isLoading: isDecisionTimeLoading,
    error: decisionTimeError
  } = useDecisionTime(marketSegmentId);

  const totalExposure = dashboardData?.outstandingAmount || 0;
  const totalLimit = dashboardData?.totalDisbursed || 0;
  const activeContractsCount = dashboardData?.activeContracts || 0;
  const utilizationRate = totalLimit > 0 ? (totalExposure / totalLimit) * 100 : 0;

  const isLoading = isOverviewLoading || isTrendsLoading || isDecisionTimeLoading;
  const error = overviewError || trendsError || decisionTimeError;

  // Trend data is now fetched from the main dashboard endpoint

  const chartData = useMemo(() => {
    if (!trendData || trendData.length === 0) {
      return [];
    }

    return trendData.map((trend: TrendData) => ({
      name: formatLocalized(trend.date, 'EEE'),
      disbursements: trend.disbursements,
      repayments: trend.repayments,
      netFlow: trend.disbursements - trend.repayments,
    }));
  }, [trendData]);
  
  if (isLoading) {
    return (
      <div className="mx-auto space-y-8 animate-in fade-in duration-500">
        <PageHeader
          icon={isGlobal ? <Globe className="text-gray-900" /> : <div className="p-1.5 bg-red-50 text-redtab rounded-lg"><Activity size={24} /></div>}
          title={isGlobal ? t('globalExposureDashboard') : t('marketHealth', { name: activeSegment?.name })}
          subtitle={isGlobal
            ? t('globalDescription')
            : t('marketDescription', { name: activeSegment?.name })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-100 rounded mb-2"></div>
              <div className="h-6 bg-gray-100 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <h3 className="font-semibold text-red-800">{t('errorLoadingDashboard')}</h3>
              <p className="text-red-600 mt-1">{error?.message || t('failedToLoadDashboard')}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                {t('retry')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-8 animate-in fade-in duration-500">
      <PageHeader
        icon={isGlobal ? <Globe className="text-gray-900" /> : <div className="p-1.5 bg-red-50 text-redtab rounded-lg"><Activity size={24} /></div>}
        title={isGlobal ? t('globalExposureDashboard') : t('marketHealth', { name: activeSegment?.name })}
        subtitle={isGlobal
          ? t('globalDescription')
          : t('marketDescription', { name: activeSegment?.name })}
        actions={<KillSwitch />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-cols-5 gap-4">
        <StatCard
          label={isGlobal ? t('globalExposure') : t('regionalExposure')}
          value={formatCurrencyWhole(totalExposure, currency, currencySymbol)}
          subtext={t('fromLastPeriod', { change: '+12.5' })}
          icon={TrendingUp}
          color="text-blue-600"
        />
        <StatCard
          label={t('utilizationRate')}
          value={`${utilizationRate.toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`}
          subtext={t('capacity', { amount: formatCurrencyWhole(totalLimit, currency, currencySymbol) })}
          icon={CreditCard}
          color="text-indigo-600"
        />
        <StatCard
          label={t('activeContracts')}
          value={activeContractsCount.toString()}
          subtext={t('avgTenure', { days: 22 })}
          icon={FileText}
          color="text-green-600"
        />
        <StatCard
          label={t('delinquencyRisk')}
          value={`${(dashboardData?.delinquencyRate || 0).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`}
          subtext={t('targetPolicy', { value: '8,0' })}
          icon={AlertCircle}
          color="text-orange-600"
        />
        <StatCard
          label={t('avgDecisionTime')}
          value={`${decisionTimeData?.averageDecisionTimeMinutes || '0'}m`}
          subtext={t('decisions', { count: decisionTimeData?.totalDecisions || 0 })}
          icon={Clock}
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">{t('capitalFlowVelocity')}</h3>
            <select
              value={trendDays}
              onChange={(e) => setTrendDays(Number(e.target.value))}
              className="bg-gray-50 border-none text-2xs font-black uppercase tracking-widest rounded-xl focus:ring-0 cursor-pointer px-4 py-3"
            >
              <option value={7}>{t('last7Days')}</option>
              <option value={30}>{t('last30Days')}</option>
              <option value={90}>{t('lastQuarter')}</option>
              <option value={365}>{t('lastYear')}</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDisbursements" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E61E2A" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#E61E2A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRepayments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNetFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Area type="monotone" dataKey="disbursements" name={t('disbursements')} stroke="#E61E2A" fillOpacity={1} fill="url(#colorDisbursements)" strokeWidth={3} />
                <Area type="monotone" dataKey="repayments" name={t('repayments')} stroke="#22c55e" fillOpacity={1} fill="url(#colorRepayments)" strokeWidth={3} />
                <Area type="monotone" dataKey="netFlow" name={t('netFlow')} stroke="#8b5cf6" fillOpacity={1} fill="url(#colorNetFlow)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 mb-8">{t('marketSentinelAlerts')}</h3>
          <div className="space-y-4 flex-1 overflow-y-auto">
            <AlertItem
              type="danger"
              title={t('alerts.liquidityConstraint')}
              message={isGlobal ? t('alerts.globalReserveDipping') : t('alerts.railLatency', { name: activeSegment?.name })}
              time={t('timeAgo.hoursAgo', { count: 2 })}
            />
            <AlertItem
              type="warning"
              title={t('alerts.policyDeviation')}
              message={t('alerts.merchantLimitGrowth', { name: 'Everest', percent: 20 })}
              time={t('timeAgo.hoursAgo', { count: 4 })}
            />
            <AlertItem
              type="info"
              title={t('alerts.policyUpdate')}
              message={t('alerts.newFeeSchedule', { tier: 'T3' })}
              time={t('timeAgo.daysAgo', { count: 1 })}
            />
          </div>
          <button onClick={() => navigate('/audit')} className="w-full mt-10 py-4 text-xs cursor-pointer text-redtab font-black uppercase tracking-widest border border-red-100 rounded-lg hover:bg-red-50 transition-all">
            {t('fullAuditStream')}
          </button>
        </div>
      </div>

      <UpcomingRepaymentsWidget
        onSelectContract={(contractId) => navigate(`/contracts/${contractId}`)}
      />
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: React.ComponentType<{ size: number }>;
  color: string;
}

const StatCard = ({ label, value, subtext, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm group hover:border-red-100 transition-all">
    <div className="flex items-center justify-between mb-6">
      <div className={`p-3 rounded bg-gray-50 ${color} group-hover:bg-redtab group-hover:text-white transition-all`}>
        <Icon size={24} />
      </div>
    </div>
    <h4 className="text-gray-400 text-2xs font-black uppercase tracking-widest">{label}</h4>
    <div className="flex items-baseline gap-2 mt-2">
      <span className="text-3xl font-black tracking-tight text-gray-900">{value}</span>
    </div>
    <p className="text-xs text-gray-400 font-medium mt-1">{subtext}</p>
  </div>
);

interface AlertItemProps {
  type: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
}

const AlertItem = ({ type, title, message, time }: AlertItemProps) => {
  const colors = {
    danger: 'bg-red-50 text-red-700 border-red-100',
    warning: 'bg-orange-50 text-orange-700 border-orange-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100',
  };
  return (
    <div className={`p-5 rounded-lg border ${colors[type]} animate-in slide-in-from-right-4 duration-500`}>
      <div className="flex justify-between items-start mb-1">
        <h5 className="font-black text-xs uppercase tracking-tight">{title}</h5>
        <span className="text-3xs opacity-70 uppercase font-black">{time}</span>
      </div>
      <p className="text-xs leading-relaxed font-medium opacity-90">{message}</p>
    </div>
  );
};

export default DashboardView;
