import React, { useState, useMemo } from 'react';
import { Spinner } from '@/components/common';
import { useTransactions, type TransactionListParams } from '@/hooks/useTransactions';
import { TransactionCardGrid } from '@/components/TransactionCardGrid';
import { TransactionType, Transaction, type TransactionFilterType } from '@/types';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';

export interface TransactionBoxSectionProps {
}

const TransactionBoxSection: React.FC<TransactionBoxSectionProps> = () => {
  const { selectedSegment, isGlobalView } = useMarketSegment();
  const [searchTerm, setSearchTerm] = useState('');
  const [txFilter, setTxFilter] = useState<TransactionFilterType>("ALL");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Map UI filter to transaction type filter
  const getTransactionTypeFilter = (): TransactionType | undefined => {
    if (txFilter === 'OUTBOUND') return TransactionType.DISBURSEMENT;
    if (txFilter === 'INBOUND') return TransactionType.REPAYMENT;
    return undefined;
  };

  // Build transaction params
  const transactionParams: TransactionListParams = useMemo(
    () => ({
      page,
      pageSize,
      search: searchTerm,
      type: getTransactionTypeFilter(),
      marketSegmentId: selectedSegment?.id
    }),
    [searchTerm, selectedSegment?.id, isGlobalView, page, pageSize]
  );

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    error: transactionsError
  } = useTransactions(transactionParams);

  // Extract transactions from API response
  const transactions = useMemo(() => {
    if (!transactionsData?.items) return [];
    return transactionsData.items;
  }, [transactionsData?.items]);

  // Calculate stats from transactions

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value: TransactionFilterType) => {
    setTxFilter(value);
    setPage(1);
  };

  if (isLoadingTransactions) {
    return (
      <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm h-[400px] flex items-center justify-center">
        <Spinner size="md" variant="primary" label="Loading transactions..." />
      </div>
    );
  }

  // Don't show error here - let parent handle it via onError callback
  if (transactionsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
        <p className="text-red-700">Failed to load transactions: {transactionsError?.message}</p>
      </div>
    );
  }

  return (
    <TransactionCardGrid
      transactions={transactions}
      searchTerm={searchTerm}
      txFilter={txFilter}
      onSearchChange={handleSearchChange}
      onFilterChange={handleFilterChange}
      currentPage={page}
      pageSize={pageSize}
      totalCount={transactionsData?.meta?.total || 0}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  );
};

export default TransactionBoxSection;
