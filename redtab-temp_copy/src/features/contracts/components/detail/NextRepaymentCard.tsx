import React from 'react';
import { differenceInCalendarDays, isBefore } from 'date-fns';
import { CalendarClock } from 'lucide-react';
import { Spinner } from '@/components/common';
import { useTranslation } from 'react-i18next';
import type { NextInstallmentSummary } from '@/types';
import { formatCurrency } from '@/utils/currencyFormatter';
import { formatDateTime } from '@/utils/dateFormatter';
import { getInstallmentStatusStyles } from '@/features/contracts/utils/installmentStatus';

interface NextRepaymentCardProps {
  installment?: NextInstallmentSummary | null;
  currency: string;
  isLoading?: boolean;
  fallbackMessage?: string;
}

export const NextRepaymentCard: React.FC<NextRepaymentCardProps> = ({
  installment,
  currency,
  isLoading,
  fallbackMessage,
}) => {
  const { t } = useTranslation('contracts');
  const emptyCopy = fallbackMessage ?? t('installmentsEmpty');

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <Spinner size="md" variant="secondary" />
        <p className="text-sm text-gray-500 font-medium">{t('loading', { defaultValue: 'Loading...' })}</p>
      </div>
    );
  }

  if (!installment) {
    return (
      <div className="bg-white p-8 rounded-xl border border-dashed border-gray-200 shadow-sm flex items-center gap-4">
        <div className="p-4 bg-gray-50 rounded-2xl">
          <CalendarClock className="text-gray-400" size={24} aria-hidden="true" />
        </div>
        <div>
          <p className="text-2xs font-black uppercase tracking-[0.2em] text-gray-400">
            {t('nextRepayment')}
          </p>
          <p className="text-sm text-gray-500 font-medium mt-2">{emptyCopy}</p>
        </div>
      </div>
    );
  }

  const dueDate = new Date(installment.dueDate);
  const now = new Date();
  const rawDiff = differenceInCalendarDays(dueDate, now);
  const countdownCopy = rawDiff >= 0
    ? t('dueInDays', { count: rawDiff })
    : t('overdueByDays', { count: Math.abs(rawDiff) });

  const isOverdue = installment.status === 'OVERDUE' || (isBefore(dueDate, now) && installment.status !== 'PAID');
  const status = getInstallmentStatusStyles(installment.status);

  return (
    <section
      className={`bg-white p-8 rounded-xl border shadow-sm flex flex-col gap-6 ${isOverdue ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${isOverdue ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-500'}`}>
            <CalendarClock size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xs font-black uppercase tracking-[0.2em] text-gray-400">
              {t('nextRepayment')} &middot; #{installment.installmentNumber}
            </p>
            <p className="text-xl font-black text-gray-900">
              {formatCurrency(installment.totalDue || 0, currency, currency)}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-xl border text-2xs font-black uppercase tracking-widest ${status.badgeClasses}`}
        >
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            {t('dueDate')}
          </p>
          <p className={`text-lg font-black ${isOverdue ? 'text-red-700' : 'text-gray-900'}`}>
            {formatDateTime(installment.dueDate)}
          </p>
          <p className={`text-xs font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>{countdownCopy}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            {t('remainingBalance', { defaultValue: 'Remaining Balance' })}
          </p>
          <p className="text-lg font-black text-gray-900">
            {formatCurrency(installment.remainingBalance || 0, currency, currency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            {t('paymentStatus')}
          </p>
          <p className={`text-base font-black ${status.textClasses}`}>{status.label}</p>
          <p className="text-xs text-gray-500 mt-1">{countdownCopy}</p>
        </div>
      </div>
    </section>
  );
};
