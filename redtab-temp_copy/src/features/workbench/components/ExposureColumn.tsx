import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Spinner } from '@/components/common';
import { Merchant, type AuditLog } from '@/types';
import TraceItem from '@/features/contracts/components/TraceItem';
import { formatCurrencyAbbreviated } from '@/utils/currencyFormatter';
import {
  DEFAULT_CURRENCY_LOCALE,
  DEFAULT_GLOBAL_CURRENCY,
  DEFAULT_GLOBAL_CURRENCY_SYMBOL,
} from '@/constants/currency';
import { useCurrencyByCode } from '@/hooks/useCurrency';
import { useExposureInsights } from '../hooks/useExposureInsights';
import { useAuditLogs } from '@/features/audit/hooks/useAuditLogs';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';


interface ExposureColumnProps {
  merchant: Merchant;
}

const formatTraceLabel = (log: AuditLog) => {
  if (log.action && log.resource) {
    return `${log.action} · ${log.resource}`;
  }
  if (log.action) {
    return log.action;
  }
  if (log.category) {
    return `${log.category} EVENT`;
  }
  return 'Audit Event';
};

const formatRelativeTime = (timestamp?: string) => {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '—';
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60_000) return 'Just now';
  if (diffMs < 3_600_000) {
    const minutes = Math.floor(diffMs / 60_000);
    return `${minutes}m ago`;
  }
  if (diffMs < 86_400_000) {
    const hours = Math.floor(diffMs / 3_600_000);
    return `${hours}h ago`;
  }
  const days = Math.floor(diffMs / 86_400_000);
  return `${days}d ago`;
};

const ExposureColumn: React.FC<ExposureColumnProps> = ({ merchant }) => {
  const { selectedSegment } = useMarketSegment();

  const activeMarketSegmentId =
    selectedSegment?.id || merchant.marketSegment?.id || merchant.marketSegmentId || null;

  const {
    data: exposureInsights,
    isLoading: isExposureLoading,
    isError: isExposureError,
    error: exposureError,
  } = useExposureInsights({
    merchantId: merchant.id,
    marketSegmentId: activeMarketSegmentId,
  });

  const currencyCode =
    exposureInsights?.currency ||
    selectedSegment?.currency ||
    merchant.marketSegment?.currency ||
    merchant.currency?.code ||
    DEFAULT_GLOBAL_CURRENCY;

  const { data: currencyDetail } = useCurrencyByCode(currencyCode);
  const resolvedCurrency = currencyCode;
  const resolvedSymbol = currencyDetail?.symbol || DEFAULT_GLOBAL_CURRENCY_SYMBOL;
  const toUsd = (amount: number) => currencyDetail?.exchangeRate && amount / currencyDetail?.exchangeRate;

  const {
    data: auditLogs,
    isLoading: isTraceLoading,
    isError: isTraceError,
  } = useAuditLogs(
    {
      merchantId: merchant.id,
      page: 1,
      pageSize: 3,
      sortBy: 'timestamp',
      sortOrder: 'desc',
    },
    { enabled: Boolean(merchant.id) }
  );

  const traceEntries = auditLogs?.items ?? [];

  const exposurePercentage = exposureInsights?.exposurePercentage ?? 0;
  const exposureDelta = exposureInsights?.exposureDeltaPercentage ?? 0;
  const isHighExposure = exposurePercentage > 80;
  const TrendIcon = exposureDelta >= 0 ? TrendingUp : TrendingDown;
  const approvalImpactText = formatDualCurrency(
    exposureInsights?.approvalImpactAmount,
    toUsd(exposureInsights?.approvalImpactAmount || 0),
    resolvedCurrency,
    resolvedSymbol
  );
  const remainingBudgetText = formatDualCurrency(
    exposureInsights?.remainingBudget,
    toUsd(exposureInsights?.remainingBudget || 0),
    resolvedCurrency,
    resolvedSymbol
  );

  return (
    <div className="flex gap-8">
      {/* Portfolio Exposure */}
      <div className="sm:w-2/3 bg-white p-10 rounded-xl border border-gray-100 shadow-sm space-y-8">
        <h4 className="text-2xs font-black text-gray-400 uppercase tracking-widest">
          PORTFOLIO EXPOSURE CHANGE
        </h4>

        {isExposureLoading ? (
          <div className="space-y-4">
            <div className="animate-pulse h-16 bg-gray-100 rounded-3xl" />
            <div className="animate-pulse h-3 bg-gray-100 rounded-full w-full" />
            <div className="animate-pulse h-3 bg-gray-100 rounded-full w-3/4" />
          </div>
        ) : (
          <>
            <div className="flex items-end gap-3">
              <span className={`text-5xl font-black leading-none ${isHighExposure ? 'text-amber-600' : 'text-gray-900'}`}>
                {exposurePercentage.toLocaleString(DEFAULT_CURRENCY_LOCALE, { maximumFractionDigits: 0 })}%
              </span>
              <div
                className={`text-2xs font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-tighter ${
                  isHighExposure ? 'text-amber-600 bg-amber-50' : 'text-redtab bg-red-50'
                }`}
              >
                {Math.abs(exposureDelta).toLocaleString(DEFAULT_CURRENCY_LOCALE, { maximumFractionDigits: 2 })}% Δ{' '}
                <TrendIcon size={10} />
              </div>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${isHighExposure ? 'bg-amber-500' : 'bg-redtab'}`}
                style={{ width: `${Math.min(Math.max(exposurePercentage, 0), 100)}%` }}
              />
            </div>

            {isExposureError ? (
              <p className="text-xs+ text-amber-700 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                Unable to load exposure impact: {exposureError instanceof Error ? exposureError.message : 'Unknown error'}.
              </p>
            ) : (
              <p className="text-xs+ text-gray-500 font-medium leading-relaxed">
                Approving this merchant will consume{' '}
                <span className="font-semibold text-gray-900">{approvalImpactText}</span> of the remaining{' '}
                <span className="font-semibold text-gray-900">{remainingBudgetText}</span> risk budget aligned to the selected
                market segment and USD parity.
              </p>
            )}
          </>
        )}
      </div>

      {/* Decision Trace */}
      <div className="sm:w-1/3 bg-gray-50 p-8 rounded-xl border border-gray-100 space-y-6">
        <h4 className="text-2xs font-black text-gray-400 uppercase tracking-widest">DECISION TRACE</h4>
        <div className="space-y-4">
          {isTraceLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Spinner size="sm" variant="secondary" />
              Syncing audit events...
            </div>
          )}
          {!isTraceLoading && traceEntries.length === 0 && !isTraceError && (
            <p className="text-xs text-gray-500">No recent underwriting events logged.</p>
          )}
          {isTraceError && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              Unable to load latest trace. Showing cached data if available.
            </p>
          )}
          {traceEntries.map((log) => (
            <TraceItem
              key={log.id}
              label={formatTraceLabel(log)}
              time={formatRelativeTime(log.timestamp)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExposureColumn;

function formatDualCurrency(
  amountLocal?: number | null,
  amountUsd?: number | null,
  currency?: string,
  symbol?: string
) {
  const localCurrency = currency || DEFAULT_GLOBAL_CURRENCY;
  const localSymbol = symbol || DEFAULT_GLOBAL_CURRENCY_SYMBOL;

  const localValue =
    amountLocal !== undefined && amountLocal !== null
      ? formatCurrencyAbbreviated(amountLocal, localCurrency, localSymbol)
      : null;

  const normalizedUsdAmount =
    amountUsd ?? (localCurrency === DEFAULT_GLOBAL_CURRENCY ? amountLocal ?? null : null);

  const usdValue =
    normalizedUsdAmount !== undefined && normalizedUsdAmount !== null
      ? `${formatCurrencyAbbreviated(
          normalizedUsdAmount,
          DEFAULT_GLOBAL_CURRENCY,
          DEFAULT_GLOBAL_CURRENCY_SYMBOL
        )} USD`
      : null;

  if (localValue && usdValue && localCurrency !== DEFAULT_GLOBAL_CURRENCY) {
    return `${localValue} (${usdValue})`;
  }

  return localValue ?? usdValue ?? '—';
}
