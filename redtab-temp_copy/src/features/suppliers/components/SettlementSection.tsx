import React, { useState } from 'react';
import { Lock, CalendarClock, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { ManualSupplierSettlementForm } from './ManualSupplierSettlementForm';
import type { Supplier } from '../types';
import { DEFAULT_CURRENCY_LOCALE, getCurrencySymbol } from '@/constants/currency';
import { formatDateTime } from '@/utils/dateFormatter';
import { Tooltip, Table, Button, Card } from '@/components/common';
import { ProviderBalanceCard } from './ProviderBalanceCard';
import { providerBalanceKeys, useProviderBalanceWithFallback } from '../hooks';

interface SettlementSectionProps {
  supplier: Supplier;
  onSettlementRecorded?: () => void;
}

interface ReleaseStatusMeta {
  label: string;
  classes: string;
}

interface ReleaseScheduleItem {
  periodNumber?: number | null;
  releaseDate?: string;
  amount?: number;
  status?: string;
}

const getReleaseStatusMeta = (status: string | undefined, translate: (key: string) => string): ReleaseStatusMeta => {
  switch (status) {
    case 'RELEASED':
      return { label: translate('releaseCompleted'), classes: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    case 'HELD':
      return { label: translate('releasePending'), classes: 'bg-gray-50 text-gray-700 border-gray-200' };
    case 'READY':
      return { label: translate('releaseReady'), classes: 'bg-blue-50 text-blue-700 border-blue-100' };
    default:
      return { label: translate('releasePending'), classes: 'bg-amber-50 text-amber-800 border-amber-200' };
  }
};

export const SettlementSection: React.FC<SettlementSectionProps> = ({
  supplier,
  onSettlementRecorded,
}) => {
  const [showManualSettlementForm, setShowManualSettlementForm] = useState(false);
  const { t } = useTranslation('suppliers');
  const queryClient = useQueryClient();

  const providerId = supplier.providerId || supplier.id;
  const supplierBalanceSnapshot: Supplier['supplierBalance'] =
    supplier.supplierBalance || {
      availableBalance: 0,
      pendingBalance: 0,
      totalBalance: 0,
      currency: 'NPR',
      isFrozen: false,
    };
  const marketCurrency = supplier.marketSegment?.currency ?? null;
  const marketCurrencySymbol = supplier.marketSegment?.currencySymbol ?? marketCurrency ?? null;


  const providerBalanceQuery = useProviderBalanceWithFallback(providerId, supplierBalanceSnapshot, {
    enabled: Boolean(providerId),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
  const providerBalance = providerBalanceQuery.providerBalance;
  const availableBalanceValue =
    providerBalance?.availableBalance ?? supplierBalanceSnapshot.availableBalance ?? 0;
  const displayCurrency =
    providerBalance?.currency ??
    supplierBalanceSnapshot.currency ??
    marketCurrency ??
    'NPR';
  const displayCurrencySymbol = getCurrencySymbol(displayCurrency);
  const currencyLabel =
    displayCurrencySymbol && displayCurrencySymbol !== displayCurrency
      ? `${displayCurrencySymbol} · ${displayCurrency}`
      : displayCurrencySymbol;
  const isFrozen = (providerBalance?.isFrozen ?? supplierBalanceSnapshot.isFrozen) || false;
  const frozenReason = providerBalance?.frozenReason ?? supplierBalanceSnapshot.frozenReason;

  const releaseSchedule = (
    (supplierBalanceSnapshot.releaseSchedule as ReleaseScheduleItem[] | undefined) ??
    (supplier.disbursementSchedule as ReleaseScheduleItem[] | undefined) ??
    []
  );
  const disbursementCount = supplier.numberOfDisbursementPeriods ?? releaseSchedule.length;
  const canWithdraw = availableBalanceValue > 0;
  const disbursementPeriods = supplier.numberOfDisbursementPeriods ?? 1;
  const paymentTermDays = supplier.paymentTermDays ?? supplier.banking?.paymentTermDays ?? 0;
  const releaseDayDisplay = paymentTermDays && paymentTermDays > 0 ? paymentTermDays : '—';

  const handleSettlementSuccess = () => {
    setShowManualSettlementForm(false);
    onSettlementRecorded?.();
    if (providerId) {
      queryClient.invalidateQueries({ queryKey: providerBalanceKeys.detail(providerId) });
      queryClient.invalidateQueries({ queryKey: providerBalanceKeys.transactions(providerId) });
      queryClient.invalidateQueries({ queryKey: providerBalanceKeys.outstanding(providerId) });
    }
  };

  const withdrawButton = (
    <Button
      variant="primary"
      aria-label={`${t('withdraw')} ${currencyLabel}`}
      onClick={() => {
        if (canWithdraw) {
          setShowManualSettlementForm(true);
        }
      }}
      disabled
      // disabled={!canWithdraw}
      size="md"
      className={`inline-flex uppercase transition-colors`}
    >
      <ArrowUpRight size={16} />
      {t('withdraw')}
    </Button>
  );

  const releaseList = releaseSchedule.length ? releaseSchedule : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <ProviderBalanceCard
        providerId={providerId}
        supplierName={supplier.name}
        fallbackBalance={supplierBalanceSnapshot}
        marketCurrency={marketCurrency}
        marketCurrencySymbol={marketCurrencySymbol}
        marketExchangeRate={null}
      />

      {isFrozen && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <Lock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-900">Supplier Balance Frozen</p>
            <p className="text-xs text-red-800 mt-1">{frozenReason}</p>
          </div>
        </div>
      )}

      {disbursementPeriods > 1 && (
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm text-indigo-800">
          {t('disbursementSplitNote', { periods: disbursementPeriods, days: releaseDayDisplay })}
        </div>
      )}

      <div className="flex justify-end">
        {canWithdraw ? (
          withdrawButton
        ) : (
          <Tooltip content="Funds will become available after release date">
            <span>{withdrawButton}</span>
          </Tooltip>
        )}
      </div>


      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xs font-black uppercase tracking-[0.2em] text-gray-400">
              {t('upcomingReleases')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t('periodsConfigured', { count: disbursementCount })}
            </p>
          </div>
          <CalendarClock className="text-gray-400" size={24} />
        </div>

        {releaseList.length === 0 ? (
          <p className="text-sm text-gray-500">{t('upcomingReleasesEmpty')}</p>
        ) : (
          <Table
            columns={[
              {
                key: 'periodNumber' as const,
                label: t('periodLabel'),
                render: (val: number | null | undefined) => <span className="font-semibold text-gray-700">#{val ?? '—'}</span>,
              },
              {
                key: 'amount' as const,
                label: t('releaseAmount'),
                render: (val: number | undefined) => (
                  <span className="font-semibold text-gray-900">
                    {val?.toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}{' '}
                    <span className="text-sm text-gray-500">{currencyLabel}</span>
                  </span>
                ),
              },
              {
                key: 'releaseDate' as const,
                label: t('releaseDateLabel'),
                render: (val: string | undefined) => <span className="text-gray-600">{val ? formatDateTime(val) : '—'}</span>,
              },
              {
                key: 'status' as const,
                label: t('status'),
                align: 'right' as const,
                render: (val: string | undefined) => {
                  const statusMeta = getReleaseStatusMeta(val, (key) => t(key as Parameters<typeof t>[0]));
                  const statusLabel = t(`releaseStatuses.${val ?? 'PENDING'}`, val ?? 'PENDING');
                  return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg border text-2xs font-black uppercase tracking-widest ${statusMeta.classes}`}>
                      {statusLabel}
                    </span>
                  );
                },
              },
            ]}
            data={releaseList}
            keyExtractor={(row) => `${row.periodNumber ?? row.releaseDate}`}
            containerClassName="border-0"
            headerClassName="bg-transparent border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-widest"
            rowRenderer={({ row, defaultRow }: { row: ReleaseScheduleItem; defaultRow: React.ReactNode }) => {
              const isDelayed = row.releaseDate ? new Date(row.releaseDate) < new Date() && row.status !== 'RELEASED' : false;
              return React.cloneElement(defaultRow as React.ReactElement<React.HTMLAttributes<HTMLTableRowElement>>, { className: `border-b border-gray-50 ${isDelayed ? 'bg-red-50/30' : ''}` });
            }}
            responsive={false}
          />
        )}
      </Card>


      <div className="mb-6">
        <ManualSupplierSettlementForm
          supplierId={supplier.providerId || supplier.id}
          supplierName={supplier.name}
          availableBalance={availableBalanceValue}
          currency={displayCurrency}
          currencySymbol={displayCurrencySymbol}
          onSuccess={handleSettlementSuccess}
        />
      </div>
    </div>
  );
};
