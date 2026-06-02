import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock4, ArrowRight } from 'lucide-react';
import { Skeleton, Pagination, Table } from '@/components/common';
import type { UpcomingInstallment, UpcomingInstallmentsResponse, PaginationMeta, InstallmentStatus } from '@/types';
import { formatCurrency } from '@/utils/currencyFormatter';
import { formatDateTime } from '@/utils/dateFormatter';
import { getInstallmentStatusStyles } from '@/features/contracts/utils/installmentStatus';
import { Amount } from '@/components/common/Amount';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useUpcomingInstallmentsSummary, useUpcomingInstallmentsList } from '../hooks/useDashboard';

interface UpcomingRepaymentsWidgetProps {
  onSelectContract?: (contractId: string) => void;
}

export const UpcomingRepaymentsWidget: React.FC<UpcomingRepaymentsWidgetProps> = ({
  onSelectContract,
}) => {
  const { selectedSegment } = useMarketSegment();
  const marketSegmentId = selectedSegment?.id;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch summary (statistics) - fetch once
  const { data: summary, isLoading: summaryLoading } = useUpcomingInstallmentsSummary(marketSegmentId);

  // Fetch paginated list
  const { data: listData, isLoading: listLoading } = useUpcomingInstallmentsList({
    limit: 5,
    page: currentPage,
    marketSegmentId,
  });

  const isLoading = summaryLoading || listLoading;
  const installments = listData?.items ?? [];
  const paginationMeta = listData?.meta;

  const { t } = useTranslation('dashboard');
  const totalAmount = summary?.totalAmountDue ?? 0;
  const totalAmountCurrency = summary?.totalAmountDueCurrency ?? 'USD';
  const totalAmountCurrencySymbol = summary?.currencySymbol ?? '$';
  const nextDueLabel = summary?.nextDueDate ? formatDateTime(summary.nextDueDate) : '—';

  return (
    <section className="bg-white py-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
      <div className="px-8 flex items-center justify-between gap-6">
        <div>
          <p className="text-2xs font-black uppercase tracking-[0.2em] text-gray-400">
            {t('upcomingRepayments.title')}
          </p>
          <p className="text-3xl font-black text-gray-900 mt-2">
            {formatCurrency(totalAmount, totalAmountCurrency, totalAmountCurrencySymbol)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{t('upcomingRepayments.totalLabel')}</p>
        </div>
        <div className="text-right">
          <p className="text-2xs font-black uppercase tracking-[0.2em] text-gray-400">
            {t('upcomingRepayments.earliestLabel')}
          </p>
          <p className="text-base font-black text-gray-900">{nextDueLabel}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3" aria-live="polite">
          {[1, 2, 3].map((skeleton) => (
            <Skeleton key={skeleton} variant="rectangular" className="h-16 border border-gray-100" />
          ))}
        </div>
      ) : (
        <Table
          columns={[
            {
              key: 'merchantName' as const,
              label: 'Merchant',
              render: (val: string, row: UpcomingInstallment) => (
                <div>
                  <p className="font-semibold text-gray-900">{val}</p>
                  <p className="text-xs text-gray-500">{row.marketSegment?.name}</p>
                </div>
              ),
            },
            {
              key: 'dueDate' as const,
              label: 'Due Date',
              render: (val: string) => <span className="text-gray-500 whitespace-nowrap">{formatDateTime(val)}</span>,
            },
            {
              key: 'amountDue' as const,
              label: 'Amount',
              align: 'right' as const,
              render: (val: number | undefined, row: UpcomingInstallment) => {
                const isOverdue = row.status === 'OVERDUE';
                return (
                  <span className={`font-bold whitespace-nowrap ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    <Amount value={val ?? 0} currency={row.marketSegment?.currency} symbol={row.marketSegment?.currencySymbol} showUSD />
                  </span>
                );
              },
            },
            {
              key: 'status' as const,
              label: 'Status',
              render: (val: string) => {
                const statusStyles = getInstallmentStatusStyles(val as InstallmentStatus);
                return (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-2xs font-bold uppercase tracking-widest ${statusStyles.badgeClasses}`}>
                    {statusStyles.label}
                  </span>
                );
              },
            },
            ...(onSelectContract ? [{
              key: 'contractId' as const,
              label: '',
              align: 'right' as const,
              render: (val: string) => (
                <button
                  type="button"
                  onClick={() => onSelectContract(val)}
                  className="cursor-pointer p-2 text-gray-400 hover:text-redtab transition-colors"
                  aria-label={`${t('upcomingRepayments.title')} ${val}`}
                >
                  <ArrowRight size={18} />
                </button>
              ),
            }] : []),
          ]}
          data={installments}
          keyExtractor={(row) => `${row.contractId}-${row.dueDate}`}
          emptyMessage={t('upcomingRepayments.empty')}
          containerClassName="border-0"
          headerClassName="bg-gray-50 sticky top-0 z-10 text-left text-xs uppercase tracking-wider text-gray-500"
          rowRenderer={({ row, index, defaultRow }: { row: UpcomingInstallment; index: number; defaultRow: React.ReactNode }) => {
            const isOverdue = row.status === 'OVERDUE';
            const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40';
            const finalBgClass = isOverdue ? 'bg-red-50/60' : bgClass;
            return React.cloneElement(defaultRow as React.ReactElement<React.HTMLAttributes<HTMLTableRowElement>>, { className: `hover:bg-gray-50 transition-colors ${finalBgClass} border-b border-gray-100` });
          }}
          responsive={false}
        />
      )}

      {/* Footer */}
      <div className="px-8 flex items-center gap-2 text-xs text-gray-500 pb-2">
        <Clock4 size={14} />
        <span>{t('upcomingRepayments.drilldownHint')}</span>
      </div>

      {/* Pagination */}
      {paginationMeta && (
        <Pagination
          meta={paginationMeta as PaginationMeta}
          onPageChange={setCurrentPage}
          showPageSize={false}
          itemsTitle="upcoming installments"
        />
      )}
    </section>
  );
};
