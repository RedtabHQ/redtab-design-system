import React, { useState } from 'react';
import { useMerchantTransactions } from '@/hooks/useTransactions';
import { Transaction } from '@/types';
import { Table } from '@/components/common/Table';
import { Pagination } from '@/components/common/Pagination';
import { formatDateTime } from '@/utils';
import { Amount } from '@/components/common/Amount';

interface MerchantTransactionsTabProps {
  merchantId: string;
}

const DEFAULT_PAGE_SIZE = 10;

function getStatusBadgeClass(status?: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-50 text-green-600';
    case 'PENDING':
      return 'bg-amber-50 text-amber-600';
    case 'FAILED':
      return 'bg-red-50 text-red-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
}

const getTransactionColumns = () => [
  {
    key: 'id' as keyof Transaction,
    label: 'Transaction ID',
    render: (_: unknown, row: Transaction) => (
      <span className="text-sm font-black text-gray-900">{row.id}</span>
    ),
  },
  {
    key: 'type' as keyof Transaction,
    label: 'Type',
    sortable: true,
    render: (_: unknown, row: Transaction) => (
      <span className="text-sm font-bold text-gray-600">{row.type || '-'}</span>
    ),
  },
  {
    key: 'amount' as keyof Transaction,
    label: 'Amount',
    sortable: true,
    align: 'right' as const,
    render: (_: unknown, row: Transaction) => (
      <Amount value={row.amount} currency={row.currency} showUSD />
    ),
  },
  {
    key: 'status' as keyof Transaction,
    label: 'Status',
    sortable: true,
    render: (_: unknown, row: Transaction) => (
      <span className={`px-3 py-1 rounded-lg text-2xs font-black uppercase ${getStatusBadgeClass(row.status)}`}>
        {row.status}
      </span>
    ),
  },
  {
    key: 'timestamp' as keyof Transaction,
    label: 'Date',
    sortable: true,
    render: (_: unknown, row: Transaction) => (
      <span className="text-sm text-gray-500">{
        formatDateTime(row.timestamp)
      }</span>
    ),
  },
];

export const MerchantTransactionsTab: React.FC<MerchantTransactionsTabProps> = ({ merchantId }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data: transactionsData, isLoading, error } = useMerchantTransactions(
    merchantId,
    { page, pageSize },
  );

  const transactions = transactionsData?.items || [];
  const paginationMeta = transactionsData?.meta;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="bg-red-50 p-8 rounded-xl border border-red-100">
          <p className="text-red-600 font-semibold">Failed to load transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">All Transactions</h3>
            {paginationMeta && (
              <span className="text-xs font-bold text-gray-500">
                Total: {paginationMeta.total} transactions
              </span>
            )}
          </div>
        </div>

        <Table<Transaction>
          columns={getTransactionColumns()}
          data={transactions}
          keyExtractor={(row) => row.id}
          loading={isLoading}
          emptyMessage="No transactions found"
          containerClassName="border-0 rounded-none"
          headerClassName="bg-gray-50/50 text-gray-400 text-3xs uppercase font-black border-b border-gray-100"
        />

        {paginationMeta && paginationMeta.totalPages > 1 && (
          <Pagination
            meta={paginationMeta}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            itemsTitle="transactions"
          />
        )}
      </div>
    </div>
  );
};
