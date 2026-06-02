import { useState, useCallback } from 'react';
import { SpinnerIcon, SearchIcon } from '@/components/icons';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionTable } from '@/components/TransactionTable';
import { Pagination } from '@/components/common/Pagination';
import { TransactionVolumeSummary } from '@/features/payment/components/TransactionVolumeSummary';
import { Transaction, TransactionType } from '@/types';
import { PageHeader } from '@/components/common/PageHeader';

// Helper to convert transaction type filter to UI filter format
const typeToUIFilter = (typeFilter?: TransactionType) => {
  if (typeFilter === TransactionType.DISBURSEMENT) return 'OUTBOUND';
  if (typeFilter === TransactionType.REPAYMENT) return 'INBOUND';
  return 'ALL';
};

// Helper to convert UI filter to transaction type filter
const uiFilterToType = (filter: 'ALL' | 'OUTBOUND' | 'INBOUND') => {
  if (filter === 'OUTBOUND') return TransactionType.DISBURSEMENT;
  if (filter === 'INBOUND') return TransactionType.REPAYMENT;
  return undefined;
};

export default function TransactionListView() {
  // Internal filter state (no URL sync)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | undefined>();

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to page 1 on search
  }, []);

  const handleTypeFilterChange = useCallback((type?: TransactionType) => {
    setTypeFilter(type);
    setCurrentPage(1); // Reset to page 1 on type filter change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to page 1 when page size changes
  }, []);

  // Fetch transactions from API
  const {
    data: transactionResponse,
    isLoading,
    isError,
    error,
  } = useTransactions({
    page: currentPage,
    pageSize,
    type: typeFilter,
    search: searchTerm,
  });

  const transactions = transactionResponse?.items || [];
  const paginationMeta = transactionResponse?.meta;

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error loading transactions: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Transactions" />

      {/* Volume Summary */}
      <TransactionVolumeSummary
        filters={{ type: typeFilter, search: searchTerm }}
        transactionCount={paginationMeta?.total}
      />

      {/* Transaction Table */}
      <TransactionTable
        transactions={transactions.map((tx: Transaction) => ({
          id: tx.id,
          merchantName: tx.merchantName,
          type: tx.type,
          amount: tx.amount,
          currency: tx.currency || '',
          timestamp: tx.timestamp,
          paymentChannel: tx.paymentChannel,
        }))}
        searchTerm={searchTerm}
        txFilter={typeToUIFilter(typeFilter)}
        onSearchChange={handleSearchChange}
        onFilterChange={(filter) => {
          handleTypeFilterChange(uiFilterToType(filter));
        }}
        currencySymbol="₨"
      />

      {/* Pagination Controls */}
      {paginationMeta && paginationMeta.totalPages > 1 && (
        <Pagination
          meta={{
            page: currentPage,
            pageSize,
            total: paginationMeta.total,
            totalPages: paginationMeta.totalPages,
          }}
          onPageChange={handlePageChange}
          onPageSizeChange={(newPageSize) => {
            handlePageSizeChange(newPageSize);
          }}
          showPageSize
          pageSizeOptions={[10, 30, 50, 100]}
          itemsTitle="transactions"
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin">
            <SpinnerIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="text-gray-500 mt-4">Loading transactions...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && transactions.length === 0 && (
        <div className="p-16 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
          <SearchIcon className="mx-auto text-gray-200 mb-4 w-12 h-12" />
          <h3 className="text-lg font-black text-gray-900">No Transactions Found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  );
}
