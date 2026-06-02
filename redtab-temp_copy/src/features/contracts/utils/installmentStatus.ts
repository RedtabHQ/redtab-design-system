import type { InstallmentStatus } from '@/types';

interface StatusStyles {
  label: string;
  badgeClasses: string;
  textClasses: string;
}

const STATUS_STYLES: Record<InstallmentStatus, StatusStyles> = {
  PAID: {
    label: 'Paid',
    badgeClasses: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    textClasses: 'text-emerald-700',
  },
  PENDING: {
    label: 'Pending',
    badgeClasses: 'bg-gray-50 text-gray-600 border-gray-200',
    textClasses: 'text-gray-600',
  },
  DUE: {
    label: 'Due',
    badgeClasses: 'bg-amber-50 text-amber-800 border-amber-200',
    textClasses: 'text-amber-800',
  },
  PARTIALLY_PAID: {
    label: 'Partially Paid',
    badgeClasses: 'bg-blue-50 text-blue-700 border-blue-100',
    textClasses: 'text-blue-700',
  },
  OVERDUE: {
    label: 'Overdue',
    badgeClasses: 'bg-red-50 text-red-700 border-red-200',
    textClasses: 'text-red-700',
  },
  FAILED: {
    label: 'Failed',
    badgeClasses: 'bg-gray-100 text-gray-700 border-gray-200',
    textClasses: 'text-gray-700',
  },
};

export const getInstallmentStatusStyles = (status?: InstallmentStatus): StatusStyles => {
  if (!status) {
    return {
      label: 'Pending',
      badgeClasses: STATUS_STYLES.PENDING.badgeClasses,
      textClasses: STATUS_STYLES.PENDING.textClasses,
    };
  }

  return STATUS_STYLES[status] ?? STATUS_STYLES.PENDING;
};
