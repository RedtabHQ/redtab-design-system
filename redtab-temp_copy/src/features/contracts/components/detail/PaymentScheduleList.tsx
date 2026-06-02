import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner, Table } from '@/components/common';
import type { PaymentScheduleInstallment, ScheduleSummary, InstallmentStatus } from '@/types';
import { formatCurrency } from '@/utils/currencyFormatter';
import { formatDateTime } from '@/utils/dateFormatter';
import { getInstallmentStatusStyles } from '@/features/contracts/utils/installmentStatus';

interface PaymentScheduleListProps {
  schedule?: PaymentScheduleInstallment[];
  summary?: ScheduleSummary | null;
  currency: string;
  isLoading?: boolean;
}

export const PaymentScheduleList: React.FC<PaymentScheduleListProps> = ({
  schedule,
  summary,
  currency,
  isLoading,
}) => {
  const { t } = useTranslation('contracts');

  const sortedSchedule = useMemo(() => {
    if (!schedule?.length) return [];
    return [...schedule].sort((a, b) => {
      if (a.installmentNumber !== undefined && b.installmentNumber !== undefined) {
        return a.installmentNumber - b.installmentNumber;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [schedule]);

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <Spinner size="md" variant="secondary" />
        <p className="text-sm text-gray-500 font-medium">{t('loading', { defaultValue: 'Loading...' })}</p>
      </div>
    );
  }

  if (sortedSchedule.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-dashed border-gray-200 shadow-sm">
        <p className="text-sm text-gray-500">{t('installmentsEmpty')}</p>
      </div>
    );
  }

  const fmt = (v: number | undefined) => formatCurrency(v ?? 0, currency, currency);

  const columns = [
    { key: 'installmentNumber' as const, label: '#', width: 'w-12', align: 'left' as const, render: (val: any) => val ?? '-' },
    { key: 'dueDate' as const, label: t('dueDate'), align: 'left' as const, render: (val: string, row: PaymentScheduleInstallment) => {
      const isOverdue = row.status === 'OVERDUE';
      return <span className={isOverdue ? 'text-red-700 font-semibold' : 'text-gray-900 font-semibold'}>{formatDateTime(val)}</span>;
    }},
    { key: 'principalAmount' as const, label: t('principal', { defaultValue: 'Principal' }), align: 'right' as const, render: (val: number) => fmt(val) },
    { key: 'feeAmount' as const, label: t('fee', { defaultValue: 'Fee' }), align: 'right' as const, render: (val: number) => fmt(val) },
    { key: 'totalAmount' as const, label: t('totalDue', { defaultValue: 'Total Due' }), align: 'right' as const, render: (val: number) => <span className="font-bold text-gray-900">{fmt(val)}</span> },
    { key: 'paidAmount' as const, label: t('paid', { defaultValue: 'Paid' }), align: 'right' as const, render: (val: number) => fmt(val) },
    { key: 'remainingAmount' as const, label: t('remaining', { defaultValue: 'Remaining' }), align: 'right' as const, render: (val: number) => fmt(val) },
    { key: 'penaltyAmount' as const, label: t('penalty', { defaultValue: 'Penalty' }), align: 'right' as const, render: (val: number) => fmt(val) },
    {
      key: 'status' as const,
      label: t('status', { defaultValue: 'Status' }),
      align: 'center' as const,
      render: (val: string) => {
        const status = getInstallmentStatusStyles(val as InstallmentStatus);
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-2xs font-black uppercase tracking-widest ${status.badgeClasses}`}>
            {status.label}
          </span>
        );
      },
    },
  ];

  const rowRenderer = ({ row, defaultRow }: { row: PaymentScheduleInstallment; defaultRow: React.ReactNode }) => {
    const isOverdue = row.status === 'OVERDUE';
    const rowClass = isOverdue ? 'bg-red-50/30' : 'hover:bg-gray-50/50';
    return React.cloneElement(defaultRow as React.ReactElement<React.HTMLAttributes<HTMLTableRowElement>>, { className: `border-b border-gray-50 last:border-0 transition-colors ${rowClass}` });
  };

  return (
    <section className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-2xs font-black uppercase tracking-[0.2em] text-gray-400">
            {t('installmentSchedule')}
          </p>
          {summary ? (
            <p className="text-sm text-gray-500 mt-2">
              {summary.paidInstallments}/{summary.totalInstallments} paid &middot; Remaining: {fmt(summary.remainingBalance)}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              {sortedSchedule.length} installment{sortedSchedule.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {summary && summary.totalInstallments > 0 && (
        <div className="mb-6">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(summary.paidInstallments / summary.totalInstallments) * 100}%` }}
            />
          </div>
        </div>
      )}

      <Table
        columns={columns}
        data={sortedSchedule}
        keyExtractor={(row) => row.id || `${row.installmentNumber}-${row.dueDate}`}
        loading={isLoading}
        emptyMessage={t('installmentsEmpty')}
        containerClassName="overflow-x-auto -mx-2 border-0"
        headerClassName="bg-transparent border-b border-gray-100"
        rowRenderer={rowRenderer}
        responsive={false}
      />
    </section>
  );
};
