import React from 'react';
import { SearchIcon } from '@/components/icons';
import { TransactionType } from '@/types';
import { TransactionCard } from './TransactionCard';
import { FilterControls } from './FilterControls';
import { Pagination, type PaginationMeta } from './common/Pagination';

interface TransactionCardGridProps {
  transactions: Array<{
    id: string;
    merchantName: string;
    type: TransactionType;
    amount: number;
    currency?: string;
    timestamp: string;
    paymentChannel?: string;
  }>;
  searchTerm: string;
  txFilter: 'ALL' | 'OUTBOUND' | 'INBOUND';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: 'ALL' | 'OUTBOUND' | 'INBOUND') => void;
  currentPage?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const TransactionCardGrid: React.FC<TransactionCardGridProps> = ({
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
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasPagination = onPageChange && totalCount > pageSize;

  const paginationMeta: PaginationMeta = {
    page: currentPage,
    pageSize,
    total: totalCount,
    totalPages,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
      <FilterControls
        searchTerm={searchTerm}
        txFilter={txFilter}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
      />

      <div className="flex-1 p-8">
        {transactions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {transactions.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  id={tx.id}
                  merchantName={tx.merchantName}
                  type={tx.type}
                  amount={tx.amount}
                  currency={tx.currency}
                  timestamp={tx.timestamp}
                  paymentChannel={tx.paymentChannel}
                />
              ))}
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
          </>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center">
            <SearchIcon className="mx-auto text-gray-200 mb-4 w-12 h-12" />
            <h4 className="text-lg font-black text-gray-900">Zero Movements Recorded</h4>
            <p className="text-gray-400 font-medium">No transactions found for current filter set.</p>
          </div>
        )}
      </div>
    </div>
  );
};
