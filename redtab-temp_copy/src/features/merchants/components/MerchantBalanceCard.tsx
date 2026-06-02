import React, { useMemo } from 'react';
import { Wallet, CalendarClock, ShieldAlert } from 'lucide-react';
import { Spinner, Tooltip } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { DEFAULT_CURRENCY_LOCALE, DEFAULT_GLOBAL_CURRENCY_SYMBOL, DEFAULT_GLOBAL_CURRENCY } from '@/constants/currency';
import { formatCurrency } from '@/utils/currencyFormatter';
import type { Merchant } from '@/types';
import { useCurrencyByCode } from '@/hooks/useCurrency';
import { useMerchantCreditLine, useUpcomingObligations } from '../hooks';
import { Amount } from '@/components/common/Amount';

interface MerchantBalanceCardProps {
  merchant: Merchant;
  merchantId: string;
}

// Predefined time windows to show upcoming obligations

const formatUsdEquivalent = (value?: number | null) => {
  if (value === null || value === undefined) {
    return null;
  }
  return `≈ ${DEFAULT_GLOBAL_CURRENCY_SYMBOL} ${value.toLocaleString(DEFAULT_CURRENCY_LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getWindowLabel = (days: number): string => {
  if (days === 7) return '1 week';
  if (days === 30) return '1 month';
  if (days === 90) return '3 months';
  if (days === 365) return '1 year';
  return `${days} days`;
};

export const MerchantBalanceCard: React.FC<MerchantBalanceCardProps> = ({ merchant, merchantId }) => {
  const { t } = useTranslation('merchants');
  const { data: creditLine, isLoading: isCreditLoading } = useMerchantCreditLine(merchantId, {
    enabled: Boolean(merchantId),
  });

  // Fetch upcoming obligations for 365 days
  const { data: obligations, isLoading: isLoadingObligations } = useUpcomingObligations(
    merchantId,
    365,
  );

  const currencyCode = merchant.currency?.code || creditLine?.currency?.code || merchant.marketSegment?.currency || 'NPR';
  const currencyData = useCurrencyByCode(currencyCode);
  const currencySymbol = currencyData.data?.symbol || currencyCode;
  const exchangeRate = currencyData.data?.exchangeRate;
  const canShowUsdApprox = useMemo(
    () => currencyCode !== DEFAULT_GLOBAL_CURRENCY,
    [currencyCode]
  );
  const toUsd = (value?: number | null) => {
    if (value == null || !exchangeRate || !canShowUsdApprox) return null;
    return value / exchangeRate;
  };

  const availableCredit =
    creditLine?.availableCredit ??
    (creditLine?.maxLimit !== undefined && creditLine?.currentUtilization !== undefined
      ? creditLine.maxLimit - creditLine.currentUtilization
      : null);


  const utilizedCredit = creditLine?.currentUtilization ?? null;

  const totalLimit = creditLine?.maxLimit ?? creditLine?.limitAmount ?? null;

  // Build upcoming buckets from obligations breakdown - memoized to avoid recalculation
  const upcomingBuckets = useMemo(() => {
    return obligations?.breakpoints?.map((bp) => {
      const amount = bp.totalOutstanding ?? 0;
      const amountUsd =
        bp.totalOutstandingUsd ??
        (canShowUsdApprox ? toUsd(amount) : null);

      return {
        days: bp.days || 0,
        amount,
        amountUsd,
        label: getWindowLabel(bp.days || 0),
      };
    }) ?? [];
  }, [obligations?.breakpoints, canShowUsdApprox, toUsd]);

  const isFrozen = Boolean(creditLine?.isFrozen);
  const outstandingLocal = merchant.outstandingLoanAmount ?? utilizedCredit ?? 0;
  const outstandingUsd = toUsd(outstandingLocal);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 lg:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs+ font-black uppercase tracking-[0.35em] text-gray-400 flex items-center gap-2">
            💰 {t('merchantBalance.title', { defaultValue: 'Merchant Credit Balance' })}
          </p>
          <p className="text-xl font-black text-gray-900">{merchant.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-600">
            {currencySymbol} · {currencyCode}
          </div>
          {isFrozen && (
            <Tooltip content={creditLine?.freezeReason || t('merchantBalance.frozenReasonFallback', { defaultValue: 'Credit line is frozen by risk controls' })}>
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-100 rounded-full">
                <ShieldAlert className="h-3.5 w-3.5" />
                {t('merchantBalance.frozenLabel', { defaultValue: 'Frozen' })}
              </span>
            </Tooltip>
          )}
        </div>
      </div>

      {isFrozen && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/70 p-4">
          <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900">
              {t('merchantBalance.frozenAlertTitle', { defaultValue: 'Credit Line Frozen' })}
            </p>
            <p className="text-sm text-red-700 mt-0.5">
              {creditLine?.freezeReason || t('merchantBalance.frozenReasonFallback', { defaultValue: 'Credit line is frozen by risk controls' })}
              {' — '}
              {t('merchantBalance.frozenAlertCopy', { defaultValue: 'New financing requests are blocked until the freeze is lifted.' })}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded border border-gray-100 p-4 bg-gradient-to-br from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
              {t('merchantBalance.available', { defaultValue: 'Available Balance' })}
            </span>
            <span className="text-emerald-500 text-lg">🟢</span>
          </div>
          <Amount value={availableCredit ?? 0} currency={currencyCode}
            mainClassName="mt-3 text-3xl font-black text-gray-900"
            subClassName="text-xs text-gray-400 mt-0.5" showUSD />
          
          <p className="text-xs text-gray-500 mt-1">
            {t('merchantBalance.availableSubcopy', { defaultValue: 'Credit left to draw' })}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 p-4 bg-gradient-to-br from-white via-yellow-50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-1">
              {t('merchantBalance.utilized', { defaultValue: 'Utilized Balance' })}
            </span>
            <span className="text-amber-500 text-lg">🟡</span>
          </div>
          <Amount value={utilizedCredit ?? 0} currency={currencyCode}
            mainClassName="mt-3 text-3xl font-black text-gray-900"
            subClassName="text-xs text-gray-400 mt-0.5" showUSD />
          <p className="text-xs text-gray-500 mt-1">
            {t('merchantBalance.utilizedSubcopy', { defaultValue: 'Currently deployed capital' })}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 p-4 bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
              {t('merchantBalance.totalLimit', { defaultValue: 'Total Limit' })}
            </span>
            <Wallet className="h-4 w-4 text-blue-500" />
          </div>
          <Amount value={totalLimit ?? 0} currency={currencyCode}
            mainClassName="mt-3 text-3xl font-black text-gray-900"
            subClassName="text-xs text-gray-400 mt-0.5" showUSD />
          <p className="text-xs text-gray-500 mt-1">
            {t('merchantBalance.totalSubcopy', { defaultValue: 'Approved credit line' })}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded border border-gray-100 bg-gray-50/70 p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
              {t('merchantBalance.outstandingDebt', { defaultValue: 'Outstanding Debt' })}
            </p>
            <Amount value={outstandingLocal} currency={currencyCode}
              mainClassName="text-2xl font-black text-gray-900"
              subClassName="text-xs text-gray-500 mt-1" showUSD />
          </div>
          {isCreditLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Spinner size="sm" variant="primary" />
              {t('merchantBalance.refreshing', { defaultValue: 'Refreshing credit line' })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-100 p-6 space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xs font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-indigo-500" />
              {t('merchantBalance.upcomingTitle', { defaultValue: 'Upcoming Repayment Readiness' })}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t('merchantBalance.upcomingSubcopy', {
                defaultValue: 'Minimum cash to prepare within the next 365 days',
              })}
            </p>
          </div>
        </div>

        {isLoadingObligations ? (
          <div className="flex items-center gap-2 text-xs text-gray-500 py-8">
            <Spinner size="sm" variant="primary" />
            {t('merchantBalance.loadingUpcoming', { defaultValue: 'Analyzing schedules' })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingBuckets.map((bucket) => (
              <div
                key={bucket.days}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-1 shadow-sm"
              >
                <p className="text-2xs font-black text-gray-400 uppercase tracking-widest">
                  {bucket.label}
                </p>

                <Amount value={bucket.amount} currency={currencyCode} 
                  mainClassName="text-xl font-black text-gray-900"
                  subClassName="text-xs+ text-gray-400" showUSD />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
