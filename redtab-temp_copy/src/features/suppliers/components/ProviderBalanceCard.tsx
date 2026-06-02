import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Wallet, AlertCircle, Info, ShieldAlert, Clock4 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, BalanceStatCard, Spinner, Button, Card } from '@/components/common';
import { useToastContext } from '@/components/common/ToastContainer';
import { DEFAULT_CURRENCY_LOCALE, DEFAULT_GLOBAL_CURRENCY } from '@/constants/currency';
import { formatCurrency } from '@/utils/currencyFormatter';
import { formatDateTime } from '@/utils/dateFormatter';
import type { Supplier, ProviderOutstandingContractSummary } from '../types';
import {
  useAutoRepay,
  useProviderBalanceWithFallback,
  useProviderOutstandingContracts,
} from '../hooks';
import { formatUsdApprox } from '../utils/currency';
import { useExchangeRateContext } from '@/contexts/ExchangeRateContext';
import { ProviderTransactionsDrawer } from './ProviderTransactionsDrawer';
import { useCurrencyByCode } from '@/hooks/useCurrency';
import { Amount } from '@/components/common/Amount';

interface ProviderBalanceCardProps {
  providerId?: string;
  supplierName: string;
  fallbackBalance?: Supplier['supplierBalance'];
  marketCurrency?: string | null;
  marketCurrencySymbol?: string | null;
  marketExchangeRate?: number | null;
}

export const ProviderBalanceCard: React.FC<ProviderBalanceCardProps> = ({
  providerId,
  supplierName,
  fallbackBalance,
}) => {
  const { t } = useTranslation('suppliers');
  const { show } = useToastContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (!cooldownEndsAt) {
      setCooldownSeconds(0);
      return;
    }

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, cooldownEndsAt - Date.now());
      const seconds = remaining > 0 ? Math.ceil(remaining / 1000) : 0;
      setCooldownSeconds(seconds);

      if (seconds === 0) {
        setCooldownEndsAt(null);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [cooldownEndsAt]);

  const balanceQuery = useProviderBalanceWithFallback(providerId, fallbackBalance, {
    enabled: Boolean(providerId),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const providerBalance = balanceQuery.providerBalance;



  const displayCurrency =
    providerBalance?.currency;
  const currencyData = useCurrencyByCode(displayCurrency);
  const displayCurrencySymbol = currencyData.data?.symbol || displayCurrency;

  const currencyChipLabel =
    displayCurrencySymbol && displayCurrencySymbol !== displayCurrency
      ? `${displayCurrencySymbol} · ${displayCurrency}`
      : displayCurrency;

  const outstandingQuery = useProviderOutstandingContracts(
    providerId,
    undefined,
    {
      enabled: Boolean(providerId),
      select: (response): ProviderOutstandingContractSummary => {
        const summary = response.items.reduce(
          (acc, contract) => {
            const contractOutstanding =
              contract.totalDue ??
              contract.principalDue ??
              contract.feesDue ??
              contract.penaltiesDue ??
              Math.max((contract.drawdownAmount ?? 0) - (contract.principalPaid ?? 0), 0);

            return {
              totalOutstanding: acc.totalOutstanding + (contractOutstanding ?? 0),
              contractCount: acc.contractCount + 1,
              overdueCount: acc.overdueCount + (contract.status === 'OVERDUE' ? 1 : 0),
              activeCount: acc.activeCount + (contract.status === 'ACTIVE' ? 1 : 0),
              currency: displayCurrency ?? 'NPR',
            };
          },
          {
            totalOutstanding: 0,
            contractCount: 0,
            overdueCount: 0,
            activeCount: 0,
            currency: displayCurrency ?? 'NPR',
          } as ProviderOutstandingContractSummary
        );

        return summary;
      },
    }
  );

  const autoRepayMutation = useAutoRepay({
    onSuccess: (result) => {
      if (result.skippedReason) {
        show({
          type: 'WARNING',
          title: t('providerBalanceCard.autoRepaySkippedTitle', { defaultValue: 'Auto-Repay In Progress' }),
          message: result.skippedReason || t('providerBalanceCard.autoRepaySkipped', { defaultValue: 'Another auto-repay run is already active. Please wait a moment.' }),
        });
      } else {
        show({
          type: 'SUCCESS',
          title: t('providerBalanceCard.autoRepaySuccessTitle', { defaultValue: 'Auto-Repay Completed' }),
          message: t('providerBalanceCard.autoRepaySuccess', {
            defaultValue: '{{amount}} applied across {{contracts}} contract(s)',
            amount: formatCurrency(result.totalAmountApplied, displayCurrency, displayCurrencySymbol),
            contracts: result.contractsProcessed,
          }),
        });
      }
      balanceQuery.refetch();
      outstandingQuery.refetch();
    },
    onError: (error) => {
      show({
        type: 'DANGER',
        title: t('providerBalanceCard.autoRepayErrorTitle', { defaultValue: 'Auto-Repay Failed' }),
        message: error instanceof Error ? error.message : t('providerBalanceCard.autoRepayError', { defaultValue: 'Unable to trigger auto-repay right now.' }),
      });
    },
  });


  const handleAutoRepay = useCallback(() => {
    if (!providerId || !providerBalance) {
      return;
    }
    setCooldownEndsAt(Date.now() + 10_000);
    autoRepayMutation.mutate({ providerId });
  }, [providerId, providerBalance, autoRepayMutation]);

  const availableIndicator = useMemo(() => <span className="text-emerald-500 text-lg">🟢</span>, []);
  const pendingIndicator = useMemo(() => <span className="text-amber-500 text-lg">🟡</span>, []);

  const hasDebt = (outstandingQuery.data?.totalOutstanding ?? 0) > 0;
  const hasAvailable = (providerBalance?.availableBalance ?? 0) > 0;
  const isFrozen = Boolean(providerBalance?.isFrozen);
  const autoRepayDisabled = autoRepayMutation.isPending || isFrozen || !hasAvailable || !hasDebt || cooldownSeconds > 0;

  const autoRepayLabel = autoRepayMutation.isPending
    ? t('providerBalanceCard.autoRepayProcessing', { defaultValue: 'Processing...' })
    : cooldownSeconds > 0
      ? t('providerBalanceCard.autoRepayRetryIn', { defaultValue: 'Retry in {{seconds}}s', seconds: cooldownSeconds })
      : hasAvailable
        ? t('providerBalanceCard.autoRepayNow', { defaultValue: 'Auto-Repay Now' })
        : t('providerBalanceCard.noBalance', { defaultValue: 'No Balance Available' });

  if (!providerId) {
    return (
      <div className="bg-white border border-amber-200 rounded-3xl p-6 flex items-center gap-4 text-amber-800">
        <AlertCircle className="h-6 w-6 flex-shrink-0" />
        <div>
          <p className="font-semibold">{t('providerBalanceCard.missingProviderTitle', { defaultValue: 'Provider ID missing' })}</p>
          <p className="text-sm">
            {t('providerBalanceCard.missingProviderCopy', { defaultValue: 'Link this supplier to a provider ID to track balances and auto-repay activity.' })}
          </p>
        </div>
      </div>
    );
  }

  if (balanceQuery.error) {
    return (
      <div className="bg-white border border-red-100 rounded-3xl p-6 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-6 w-6 text-red-600" />
          <div>
            <p className="font-semibold text-red-900">
              {t('providerBalanceCard.balanceErrorTitle', { defaultValue: 'Failed to load provider balance' })}
            </p>
            <p className="text-sm text-red-700">
              {balanceQuery.error instanceof Error
                ? balanceQuery.error.message
                : t('providerBalanceCard.balanceErrorCopy', { defaultValue: 'Please refresh or try again later.' })}
            </p>
          </div>
        </div>
        <button
          onClick={() => balanceQuery.refetch()}
          className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold"
        >
          {t('providerBalanceCard.retry', { defaultValue: 'Retry' })}
        </button>
      </div>
    );
  }

  if (!providerBalance && balanceQuery.isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-6 animate-pulse">
        <div className="h-4 w-1/4 bg-gray-200 rounded-full" />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-20 bg-gray-100 rounded" />
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs+ font-black uppercase tracking-[0.35em] text-gray-400 flex items-center gap-2">
              💰 {t('providerBalanceCard.title', { defaultValue: 'Provider Balance' })}
              <Tooltip content={t('providerBalanceCard.globalRunTooltip', { defaultValue: 'Auto-repay executes for all providers. This action queues a global run.' })}>
                <Info className="h-3.5 w-3.5 text-gray-400" />
              </Tooltip>
            </p>
            <p className="text-xl font-black text-gray-900">{supplierName}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-600">
              {currencyChipLabel}
            </div>
            {isFrozen && (
              <Tooltip content={providerBalance?.frozenReason || t('providerBalanceCard.frozenReasonFallback', { defaultValue: 'Balance is frozen by risk controls' })}>
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-100 rounded-full">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {t('providerBalanceCard.frozenLabel', { defaultValue: 'Frozen' })}
                </span>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <BalanceStatCard
            className="bg-gradient-to-br from-gray-50 to-white"
            title={t('availableBalance')}
            indicator={availableIndicator}
            value={providerBalance?.availableBalance || 0}
            currencyCode={displayCurrency}
            description={t('providerBalanceCard.availableSubcopy', {
              defaultValue: 'Ready to withdraw or auto-repay',
            })}
          />
          <BalanceStatCard
            className="bg-gradient-to-br from-white via-yellow-50 to-white"
            title={
              <span className="flex items-center gap-1">
                {t('pendingBalance')}
                <Tooltip
                  content={t('providerBalanceCard.pendingTooltip', {
                    defaultValue: 'Currently clearing settlements. Will unlock automatically.',
                  })}
                >
                  <Info className="h-3.5 w-3.5 text-amber-500" />
                </Tooltip>
              </span>
            }
            indicator={pendingIndicator}
            value={(providerBalance?.pendingBalance) ?? 0}
            currencyCode={displayCurrency}
            description={
              providerBalance?.pendingReleaseDate
                ? t('providerBalanceCard.nextRelease', {
                  defaultValue: 'Next release {{date}}',
                  date: formatDateTime(providerBalance.pendingReleaseDate),
                })
                : undefined
            }
          />
          <BalanceStatCard
            className="bg-gradient-to-br from-white to-gray-50"
            title={t('providerBalanceCard.totalBalance', { defaultValue: 'Total Balance' })}
            indicator={<Wallet className="h-4 w-4 text-blue-500" />}
            value={(providerBalance?.totalBalance || 0)}
            currencyCode={displayCurrency}
            description={t('providerBalanceCard.totalSubcopy', { defaultValue: 'Available + Pending' })}
          />
        </div>

        <div className="mt-6 rounded border border-gray-100 bg-gray-50/70 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                {t('providerBalanceCard.outstandingDebt', { defaultValue: 'Outstanding Debt' })}
              </p>
              <Amount value={outstandingQuery.data?.totalOutstanding ?? 0} currency={displayCurrency}
                mainClassName="text-2xl font-black text-gray-900"
                subClassName="text-xs text-gray-500 mt-1" showUSD />

              <p className="text-xs text-gray-500 mt-1">
                {hasDebt
                  ? t('providerBalanceCard.contractSummary', {
                    defaultValue: '{{count}} contract(s): {{overdue}} overdue, {{active}} active',
                    count: outstandingQuery.data?.contractCount ?? 0,
                    overdue: outstandingQuery.data?.overdueCount ?? 0,
                    active: outstandingQuery.data?.activeCount ?? 0,
                  })
                  : t('providerBalanceCard.noContracts', { defaultValue: 'No outstanding contracts' })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {hasDebt && (
                <>
                  {hasAvailable ? (
                    <Button
                      variant="primary"
                      size="sm"
                      type="button"
                      onClick={handleAutoRepay}
                      disabled={autoRepayDisabled}
                    >
                      {autoRepayMutation.isPending && <Spinner size="sm" variant="white" />}
                      {autoRepayLabel}
                    </Button>
                  ) : (
                    <Tooltip content={t('providerBalanceCard.noBalanceTooltip', { defaultValue: 'Top up balance or wait for pending funds' })}>
                      <span>
                        <Button
                          variant="secondary"
                          size="sm"
                          type="button"
                          onClick={handleAutoRepay}
                          disabled={autoRepayDisabled}
                        >
                          {autoRepayLabel}
                        </Button>

                      </span>
                    </Tooltip>
                  )}
                </>
              )}

              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setIsDrawerOpen(true)}
              >
                {t('providerBalanceCard.viewTransactions', { defaultValue: 'View Transactions' })}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-3 rounded border border-blue-100 bg-blue-50/50 p-4">
            <Info className="h-4 w-4 text-blue-500 mt-0.5" />
            <p className="text-gray-700">
              {t('providerBalanceCard.autoRepayInfo', { defaultValue: 'Auto-repay deducts from the available balance starting with OVERDUE contracts, then ACTIVE contracts ordered by due date.' })}
            </p>
          </div>
          <div className="flex items-start gap-3 rounded border border-indigo-100 bg-indigo-50/40 p-4">
            <Clock4 className="h-4 w-4 text-indigo-500 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">{t('providerBalanceCard.scheduleTitle', { defaultValue: 'Daily automation' })}</p>
              <p className="text-gray-600 text-sm">
                {t('providerBalanceCard.scheduleCopy', { defaultValue: 'System triggers auto-repay every day at 6:00 AM. Manual runs queue immediately.' })}
              </p>
            </div>
          </div>
        </div>

        {(balanceQuery.isFetching || outstandingQuery.isFetching) && (
          <div className="absolute top-6 right-6 inline-flex items-center gap-2 text-xs text-gray-500 bg-white/80 border border-gray-100 rounded-full px-3 py-1 shadow-sm">
            <Spinner size="sm" variant="secondary" className="h-3.5 w-3.5" />
            {t('providerBalanceCard.refreshing', { defaultValue: 'Refreshing' })}
          </div>
        )}
      </Card>

      <ProviderTransactionsDrawer
        providerId={providerId}
        currency={displayCurrency}
        currencySymbol={displayCurrencySymbol}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
