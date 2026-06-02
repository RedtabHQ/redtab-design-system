import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { TransactionType } from '@/types';
import { FilterControls } from './FilterControls';
import { Pagination, type PaginationMeta } from './common/Pagination';
import { Table } from '@/components/common';
import { EmptyState } from './common/EmptyState';
import { formatDateTime } from '@/utils/dateFormatter';
import { TransactionActionPanel } from './TransactionActionPanel';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';
import { Amount } from './common/Amount';

interface TransactionTableProps {
  transactions: Array<{
    id: string;
    merchantName: string;
    type: TransactionType;
    amount: number;
    currency?: string;
    timestamp: string;
    paymentChannel?: string;
    status?: 'COMPLETED' | 'PENDING' | 'FAILED';
  }>;
  searchTerm: string;
  txFilter: 'ALL' | 'OUTBOUND' | 'INBOUND';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: 'ALL' | 'OUTBOUND' | 'INBOUND') => void;
  currencySymbol: string;
  currentPage?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  enablePaymentActions?: boolean;
}

const TransactionStatusBadge: React.FC<{ status?: string }> = ({ status = 'COMPLETED' }) => {
  const statusConfig = {
    COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2 },
    PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: AlertCircle },
    FAILED: { bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.COMPLETED;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 ${config.bg} border border-gray-100 rounded-xl shadow-sm`}>
      <Icon size={12} className={config.text} />
      <span className={`text-3xs font-black uppercase ${config.text}`}>{status}</span>
    </div>
  );
};

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  searchTerm,
  txFilter,
  onSearchChange,
  onFilterChange,
  currentPage = 1,
  pageSize = 30,
  totalCount = transactions.length,
  onPageChange,
  onPageSizeChange,
  enablePaymentActions = false,
}) => {
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasPagination = onPageChange && totalCount > pageSize;

  const paginationMeta: PaginationMeta = {
    page: currentPage,
    pageSize,
    total: totalCount,
    totalPages,
  };

  const columns = [
    {
      key: 'id' as const,
      label: 'Operational Trace',
      render: (val: string, row: typeof transactions[0]) => (
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded border ${
            row.type === TransactionType.DISBURSEMENT ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-500 border-green-100'
          }`}>
            {row.type === TransactionType.DISBURSEMENT ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
          </div>
          <div>
            <p className="text-sm font-black text-gray-900">{val}</p>
            <p className="text-3xs text-gray-400 font-mono mt-0.5">{formatDateTime(row.timestamp)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'merchantName' as const,
      label: 'Entity Context',
      render: (val: string, row: typeof transactions[0]) => (
        <div>
          <p className="text-sm font-bold text-gray-700">{val}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xs font-black text-gray-400 uppercase tracking-widest">Rail:</span>
            <span className="text-3xs font-black text-indigo-500 uppercase">{row.paymentChannel || 'System Internal'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'amount' as const,
      label: 'Settlement Value',
      render: (val: number, row: typeof transactions[0]) => (
        <p className={`text-lg font-black tracking-tight ${row.type === TransactionType.DISBURSEMENT ? 'text-gray-900' : 'text-green-600'}`}>
          <Amount value={val} currency={row.currency} showUSD />
        </p>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      align: 'right' as const,
      render: (val: string) => <TransactionStatusBadge status={val || 'COMPLETED'} />,
    },
    ...(enablePaymentActions ? [{
      key: 'id' as const,
      label: 'Actions',
      align: 'right' as const,
      render: (val: string) => (
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setExpandedTx(expandedTx === val ? null : val);
          }}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-2 py-1 cursor-pointer"
        >
          {expandedTx === val ? '✕' : 'Actions'}
        </button>
      ),
    }] : []),
  ];

  const rowRenderer = ({ row, defaultRow }: { row: typeof transactions[0]; defaultRow: React.ReactNode }) => (
    <React.Fragment key={row.id}>
      {defaultRow}
      {enablePaymentActions && expandedTx === row.id && (
        <tr className="bg-gray-50/50 border-t-2 border-indigo-100">
          <td colSpan={enablePaymentActions ? 5 : 4} className="px-10 py-4">
            <TransactionActionPanel transactionId={row.id} status={row.status || 'COMPLETED'} />
          </td>
        </tr>
      )}
    </React.Fragment>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
      <FilterControls
        searchTerm={searchTerm}
        txFilter={txFilter}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
      />

      <div className="flex-1 overflow-x-auto">
        <Table
          columns={columns}
          data={transactions}
          keyExtractor={(row) => row.id}
          emptyMessage={
            <EmptyState
              title="Zero Movements Recorded"
              description="No transactions found for current filter set."
              variant="compact"
              className="py-24"
            />
          }
          containerClassName="border-0 overflow-x-auto"
          headerClassName="bg-gray-50/50 text-gray-400 text-2xs uppercase font-black tracking-widest border-b border-gray-100"
          rowRenderer={rowRenderer}
          responsive={false}
        />
      </div>

      {hasPagination && (
        <Pagination
          meta={paginationMeta}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          showPageSize={true}
          pageSizeOptions={[10, 20, 30, 50, 100]}
          itemsTitle="transactions"
        />
      )}
    </div>
  );
};
