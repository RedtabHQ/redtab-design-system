import React, { useMemo, useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency } from '@/utils/currencyFormatter';
import { Table } from '@/components/common';
import { RailsViewModeToggle } from './RailsViewModeToggle';
import type { SettlementRail, Transaction } from '@/types';

export interface RailTransactionsTableProps {
  selectedChannel: SettlementRail | null;
  activeSegmentCurrency?: string;
  isGlobalView: boolean;
  selectedSegmentCurrency?: string;
  currencySymbol: string;
  currency: string;
}

/**
 * Table component displaying transactions for a selected settlement rail
 * Filters transactions by selected channel and market segment
 *
 * Performance optimizations:
 * - Server-side pagination (fetch 100 max per page)
 * - Client-side virtual rendering limit (display 50 rows max)
 * - Memoized filtering to prevent unnecessary recalculations
 */
export const RailTransactionsTable: React.FC<RailTransactionsTableProps> = ({
  selectedChannel,
  activeSegmentCurrency,
  isGlobalView,
  selectedSegmentCurrency,
  currencySymbol,
  currency,
}) => {
  const [viewMode, setViewMode] = useState<'ledger' | 'routing'>('ledger');

  // Pagination state
  const [displayPage, setDisplayPage] = useState(1);
  const DISPLAY_LIMIT = 10; // Only render 50 rows at a time

  // Fetch transactions filtered by selected channel via API
  const { data: transactionsResponse } = useTransactions({
    page: 1,
    pageSize: 100,
    paymentChannel: selectedChannel?.railName,
  });
  const transactions = transactionsResponse?.items || [];

  // Filter transactions by segment (currency)
  const railTransactions = useMemo(() => {
    if (!selectedChannel) return [];
    return transactions.filter(
      (t: Transaction) =>
        isGlobalView || t.currency === selectedSegmentCurrency
    );
  }, [selectedChannel, transactions, isGlobalView, selectedSegmentCurrency]);

  // Paginate displayed transactions to prevent rendering too many DOM nodes
  const displayedTransactions = useMemo(() => {
    const start = (displayPage - 1) * DISPLAY_LIMIT;
    const end = start + DISPLAY_LIMIT;
    return railTransactions.slice(start, end);
  }, [railTransactions, displayPage]);

  const totalPages = Math.ceil(railTransactions.length / DISPLAY_LIMIT);

  const columns = [
    {
      key: 'id' as const,
      label: 'Trace',
      render: (val: string, row: Transaction) => (
        <div>
          <p className="text-sm font-black text-gray-900">{val}</p>
          <p className="text-3xs text-gray-400">{row.timestamp}</p>
        </div>
      ),
    },
    {
      key: 'merchantName' as const,
      label: 'Account Context',
      render: (val: string) => <span className="font-bold text-xs text-gray-500">{val}</span>,
    },
    {
      key: 'amount' as const,
      label: 'Value',
      render: (val: number, row: Transaction) => (
        <span className="font-black text-sm text-gray-900">
          {formatCurrency(val, row.currency, currencySymbol)}
        </span>
      ),
    },
    {
      key: 'id' as const,
      label: 'Settlement',
      align: 'right' as const,
      render: () => (
        <span className="px-2 py-0.5 rounded bg-green-50 text-green-600 text-[8px] font-black uppercase">
          RECONCILED
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <RailsViewModeToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeSegmentCurrency={activeSegmentCurrency || 'HQ Consolidated'}
      />

      <Table
        columns={columns}
        data={displayedTransactions}
        keyExtractor={(row) => row.id}
        containerClassName="border-0 overflow-x-auto"
        headerClassName="bg-gray-50/50 text-gray-400 text-3xs uppercase font-black border-b border-gray-100"
        responsive={false}
      />

      {railTransactions.length > DISPLAY_LIMIT && (
        <div className="flex items-center justify-between px-8 py-4 bg-gray-50/50 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Showing {(displayPage - 1) * DISPLAY_LIMIT + 1} to {Math.min(displayPage * DISPLAY_LIMIT, railTransactions.length)} of {railTransactions.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setDisplayPage(Math.max(1, displayPage - 1))}
              disabled={displayPage === 1}
              className="px-3 py-1 text-xs font-semibold rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-xs font-semibold text-gray-600">
              {displayPage} / {totalPages}
            </span>
            <button
              onClick={() => setDisplayPage(Math.min(totalPages, displayPage + 1))}
              disabled={displayPage === totalPages}
              className="px-3 py-1 text-xs font-semibold rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
