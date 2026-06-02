import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useExchangeRateContext } from '@/contexts/ExchangeRateContext';
import { Table } from './common/Table';
import { EmptyState } from './common/EmptyState';
import type { Supplier } from '@/types';
import { SettlementMode } from '@/types';
import { DEFAULT_CURRENCY_LOCALE, DEFAULT_GLOBAL_CURRENCY_SYMBOL, getCurrencySymbol } from '@/constants/currency';
import { Amount } from './common/Amount';

interface SupplierTableProps {
  suppliers: Supplier[];
  onRowClick?: (supplier: Supplier) => void;
  loading?: boolean;
  containerClassName?: string;
  regions?: { id: string; name: string; currency: string }[];
}

/**
 * Get human-readable settlement term label
 */
const getTermLabel = (supplier: Supplier): string => {
  if (supplier.settlementMode === SettlementMode.REAL_TIME) {
    return 'Real-time';
  }
  if (supplier.paymentTermDays === undefined || supplier.paymentTermDays === null) {
    return supplier.settlementMode?.replace('_', ' ') || 'Standard';
  }
  if (supplier.paymentTermDays === 0) {
    return supplier.settlementMode?.replace('_', ' ') || 'Immediate';
  }
  return `Net ${supplier.paymentTermDays}`;
};

/**
 * Reusable Supplier Table component
 * Displays suppliers in a formatted table with standardized styling
 */
export const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  onRowClick,
  loading = false,
  containerClassName,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (supplier: Supplier) => {
    if (onRowClick) {
      onRowClick(supplier);
    } else {
      navigate(`/suppliers/${supplier.id}`);
    }
  };

  const columns = [
    {
      key: 'name' as const,
      label: 'Supplier Entity',
      width: 'w-1/4',
      render: (_value: unknown, row: Supplier) => (
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded bg-gray-900 text-white flex items-center justify-center font-black text-xs shadow-lg hover:bg-redtab transition-colors">
            {row.name
              .split(' ')
              .map((n) => n[0])
              .join('')
            }
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 hover:text-redtab transition-colors">
              {row.name}
            </p>
            <p className="text-2xs text-gray-400 font-mono mt-0.5">
              {(typeof row.category === 'string' ? row.category : row.category?.name) || 'Uncategorized'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'paymentTermDays' as const,
      label: 'Commercial Terms',
      width: 'w-1/5',
      render: (_value: unknown, row: Supplier) => (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600">{getTermLabel(row)}</span>
          {row.supplierFeeRate > 0 && (
            <span className="text-3xs font-black text-redtab bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-tight">
              {(row.supplierFeeRate * 100).toLocaleString(DEFAULT_CURRENCY_LOCALE, { maximumFractionDigits: 0 })}% Fee
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'currency' as const,
      label: 'Market Context',
      width: 'w-1/5',
      render: (_value: unknown, row: Supplier) => {
        const { marketSegment } = row;
        return (
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-indigo-100 flex items-center justify-center text-[8px] font-black text-indigo-600 uppercase">
              {marketSegment?.currency || 'N/A'}
            </span>
            <span className="text-xs font-bold text-indigo-600">
              {marketSegment?.name || 'N/A'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'id' as const,
      label: 'Payout Amount (Net)',
      width: 'w-1/5',
      render: (_value: unknown, row: Supplier) => {
        const localAmount = row.payoutAmount ?? 0;
        // Use supplier's currency data, fall back to market segment if not available
        const currencyCode = row.marketSegment?.currency || '';
        const localCurrencySymbol = row.marketSegment?.currencySymbol;
        return (
          <div>
            {JSON.stringify(row.currency)}
            <Amount value={localAmount} currency={currencyCode} symbol={localCurrencySymbol} showUSD />
            <p className="text-3xs text-gray-400 uppercase font-black mt-1">
              Total Disbursed
            </p>
          </div>
        );
      },
    },
    {
      key: 'isVerified' as const,
      label: 'Audit',
      width: 'w-auto',
      render: (_value: unknown, row: Supplier) => (
        <button
          className="p-2 text-gray-300 hover:text-redtab hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          aria-label={`View details for ${row.name}`}
          title={`View details for ${row.name}`}
        >
          <Eye size={20} aria-hidden="true" />
        </button>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table<Supplier>
        columns={columns}
        data={suppliers}
        keyExtractor={(supplier) => supplier.id}
        loading={loading}
        emptyMessage={
          <EmptyState
            title="No suppliers found"
            description="Try adjusting your search or filters"
            variant="compact"
          />
        }
        onRowClick={handleRowClick}
        headerClassName="bg-gray-50/50 text-gray-400 text-2xs uppercase tracking-widest font-black border-b border-gray-100"
        rowClassName="divide-y divide-gray-50"
        containerClassName={
          containerClassName ||
          'overflow-x-auto rounded-lg border-0'
        }
      />
    </div>
  );
};
