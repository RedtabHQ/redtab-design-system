import React, { useState, useMemo, useEffect, forwardRef } from 'react';
import { Spinner } from '@/components/common';
import { useTransactions, type TransactionListParams } from '@/hooks/useTransactions';
import { TransactionTable } from '@/components';
import { TransactionType, Transaction } from '@/types';
import { useCurrency } from '@/hooks/useCurrency';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';

type TxFilter = 'ALL' | 'OUTBOUND' | 'INBOUND';

export interface TransactionSectionProps {
}

const TransactionSection: React.FC<TransactionSectionProps> = () => {
  const [txFilter, setTxFilter] = useState<TxFilter>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { symbol: currencySymbol } = useCurrency();
  const { selectedSegment, isGlobalView } = useMarketSegment();
  const [searchTerm, setSearchTerm] = useState('');

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
      marketSegmentId: selectedSegment?.id,
    }),
    [searchTerm, selectedSegment, isGlobalView, txFilter, page, pageSize]
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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value: 'ALL' | 'OUTBOUND' | 'INBOUND') => {
    setTxFilter(value);
  };

  if (isLoadingTransactions) {
    return (
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-[400px] flex items-center justify-center">
        <Spinner size="md" variant="primary" label="Loading transactions..." />
      </div>
    );
  }

  // Don't show error here - let parent handle it via onError callback
  if (transactionsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-4">
        <p className="text-red-700">Failed to load transactions: {transactionsError?.message}</p>
      </div>
    );
  }

  return (
    <TransactionTable
      transactions={transactions}
      searchTerm={searchTerm}
      txFilter={txFilter}
      onSearchChange={handleSearchChange}
      onFilterChange={handleFilterChange}
      currencySymbol={currencySymbol}
      currentPage={page}
      pageSize={pageSize}
      totalCount={transactionsData?.meta?.total || 0}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  );
};

export default TransactionSection;
