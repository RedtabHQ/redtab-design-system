import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeType = 'merchant' | 'webhook' | 'credit' | 'tier' | 'contract';

export interface StatusBadgeProps {
  type: BadgeType;
  status: string;
  size?: 'sm' | 'md';
  className?: string;
  /** Only used when type="webhook". Label shown when status="active". Defaults to "Active". */
  activeLabel?: string;
  /** Only used when type="webhook". Label shown when status="inactive". Defaults to "Inactive". */
  inactiveLabel?: string;
}

// Default fallback styles per type
const DEFAULT_STYLE: Record<BadgeType, string> = {
  merchant: 'bg-gray-100 text-gray-500 border-gray-200',
  webhook: 'bg-gray-100 text-gray-800',
  credit: 'bg-gray-500',
  tier: 'bg-gray-100 text-gray-500 border-gray-200',
  contract: 'bg-blue-50 text-blue-700',
};

// Exact color mappings copied from source badge components
const colorConfigs: Record<BadgeType, Record<string, string>> = {
  // From frontend/src/components/StatusBadge.tsx (MerchantStatus enum values)
  merchant: {
    VERIFIED: 'bg-green-50 text-green-700 border-green-100',
    ACTIVE: 'bg-green-50 text-green-700 border-green-100',
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    REJECTED: 'bg-red-50 text-red-700 border-red-100',
    SUSPENDED: 'bg-gray-100 text-gray-500 border-gray-200',
    INACTIVE: 'bg-gray-100 text-gray-500 border-gray-200',
  },
  // From frontend/src/components/WebhookStatusBadge.tsx (isActive boolean → active/inactive string)
  webhook: {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  },
  // From frontend/src/components/CreditRatingBadge.tsx (Rating: 'A'|'B'|'C'|'D')
  credit: {
    A: 'bg-green-500',
    B: 'bg-blue-500',
    C: 'bg-amber-500',
    D: 'bg-red-500',
  },
  // From frontend/src/components/TierBadge.tsx (CreditTier enum values)
  tier: {
    T1: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    T2: 'bg-blue-50 text-blue-700 border-blue-100',
    T3: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    NONE: 'bg-red-50 text-red-700 border-red-100',
  },
  // From frontend/src/components/RegionalPurchaseLedgerTable.tsx (Contract.status)
  contract: {
    PAID: 'bg-green-50 text-green-700',
    OVERDUE: 'bg-red-50 text-red-700',
    DEFAULTED: 'bg-red-50 text-red-700',
    DELINQUENT: 'bg-orange-50 text-orange-700',
    WRITTEN_OFF: 'bg-gray-50 text-gray-700',
    ACTIVE: 'bg-blue-50 text-blue-700',
  },
};

// Base structural classes per type (layout, shape, font)
function getBaseClasses(type: BadgeType, size: 'sm' | 'md'): string {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-3xs' : 'px-3 py-1 text-3xs';

  switch (type) {
    case 'merchant':
      return cn(
        'inline-flex items-center gap-1.5 rounded-xl font-black border uppercase tracking-widest',
        sizeClasses,
      );
    case 'webhook':
      return cn('rounded-full text-xs', sizeClasses);
    case 'credit':
      // Credit rating badge is a fixed-size circle — size prop maps to circle dimensions
      return size === 'sm'
        ? 'w-5 h-5 rounded-full flex items-center justify-center text-3xs font-black text-white shadow-sm'
        : 'w-6 h-6 rounded-full flex items-center justify-center text-2xs font-black text-white shadow-sm';
    case 'tier':
      return cn('rounded-xl font-black border tracking-widest', sizeClasses);
    case 'contract':
      return cn('rounded-lg font-black uppercase', sizeClasses);
  }
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  status,
  size = 'md',
  className,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
}) => {
  const colorClass = colorConfigs[type][status] ?? DEFAULT_STYLE[type];
  const baseClass = getBaseClasses(type, size);

  // For webhook, resolve the display label from the status string
  const label =
    type === 'webhook' ? (status === 'active' ? activeLabel : inactiveLabel) : status;

  return (
    <span className={cn(baseClass, colorClass, className)}>
      {label}
    </span>
  );
};
