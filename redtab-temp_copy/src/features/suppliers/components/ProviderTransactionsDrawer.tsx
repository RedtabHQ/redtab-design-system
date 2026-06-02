import React, { useEffect, useMemo, useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Settings2, Receipt } from 'lucide-react';
import { formatCurrency } from '@/utils/currencyFormatter';
import { formatDateTime } from '@/utils/dateFormatter';
import { Spinner, Pagination } from '@/components/common';
import { StatusFilter } from '@/components/StatusFilter';
import { useProviderBalanceTransactions } from '../hooks';
import type { ProviderBalanceTransactionFilters, ProviderBalanceTransactionType } from '../types';

interface ProviderTransactionsDrawerProps {
  providerId?: string;
  currency?: string;
  currencySymbol?: string;
  isOpen: boolean;
  onClose: () => void;
}

const transactionTypes: (ProviderBalanceTransactionType | 'ALL')[] = ['ALL', 'CREDIT', 'DEBIT', 'ADJUSTMENT', 'FEE'];

const typeConfig: Record<ProviderBalanceTransactionType, { label: string; style: string; icon: React.ElementType }> = {
  CREDIT: { label: 'Credit', style: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: ArrowDownLeft },
  DEBIT: { label: 'Debit', style: 'bg-rose-50 text-rose-700 border-rose-100', icon: ArrowUpRight },
  ADJUSTMENT: { label: 'Adjustment', style: 'bg-amber-50 text-amber-700 border-amber-100', icon: Settings2 },
  FEE: { label: 'Fee', style: 'bg-blue-50 text-blue-700 border-blue-100', icon: Receipt },
};

export const ProviderTransactionsDrawer: React.FC<ProviderTransactionsDrawerProps> = ({
  providerId,
  currency,
  currencySymbol,
  isOpen,
  onClose,
}) => {
  const [filters, setFilters] = useState<ProviderBalanceTransactionFilters>({
    page: 1,
    pageSize: 10,
    transactionType: 'ALL',
  });

  useEffect(() => {
    if (!isOpen) {
      setFilters((current) => ({
        ...current,
        page: 1,
        transactionType: 'ALL',
      }));
    }
  }, [isOpen]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useProviderBalanceTransactions(
    providerId,
    filters,
    { enabled: isOpen }
  );

  const hasResults = (data?.items?.length ?? 0) > 0;
  const displayCurrency = data?.items?.[0]?.currency ?? currency ?? 'NPR';
  const displaySymbol = currencySymbol ?? displayCurrency;

  const handleFilterChange = (type: ProviderBalanceTransactionType | 'ALL') => {
    setFilters((current) => ({
      ...current,
      page: 1,
      transactionType: type,
    }));
  };

  const paginationMeta = useMemo(() => ({
    page: data?.meta?.page ?? filters.page ?? 1,
    pageSize: data?.meta?.pageSize ?? filters.pageSize ?? 10,
    total: data?.meta?.total ?? 0,
    totalPages: data?.meta?.totalPages ?? 1,
  }), [data?.meta, filters.page, filters.pageSize]);

  const drawerContent = useMemo(() => {
    if (isLoading && !data) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <Spinner size="md" variant="secondary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-sm font-bold text-gray-900">Failed to load transactions</p>
            <p className="text-xs text-gray-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
            <button
              className="text-xs font-bold text-redtab hover:underline"
              onClick={() => refetch()}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    if (!hasResults) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-2 px-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm font-bold text-gray-900">No transactions yet</p>
            <p className="text-xs text-gray-500">
              Auto-repay activity and manual adjustments will appear here.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {data?.items?.map((txn) => {
            const config = typeConfig[txn.transactionType];
            const TypeIcon = config.icon;
            const isCredit = txn.transactionType === 'CREDIT';

            return (
              <div
                key={txn.id}
                className="bg-white rounded border border-gray-100 p-4 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.style}`}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {txn.referenceType === 'AUTO_REPAYMENT' ? 'Auto-Repay' : config.label}
                        </span>
                        {txn.referenceType === 'AUTO_REPAYMENT' && (
                          <span className="text-2xs font-bold uppercase tracking-widest bg-purple-50 text-purple-700 border border-purple-100 rounded-full px-2 py-0.5">
                            Auto
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDateTime(txn.createdAt)}
                      </p>
                      {txn.description && (
                        <p className="text-xs text-gray-500 mt-1">{txn.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-black ${isCredit ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {isCredit ? '+' : '-'}{formatCurrency(txn.amount, displayCurrency, displaySymbol)}
                    </p>
                    {txn.balanceAfter != null && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Bal: {formatCurrency(txn.balanceAfter, displayCurrency, displaySymbol)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-2xs font-black uppercase tracking-widest rounded-full border ${config.style}`}>
                    {config.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-3xs font-black uppercase border ${
                    (txn.status || 'POSTED') === 'POSTED' || (txn.status || 'POSTED') === 'SETTLED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : (txn.status || 'POSTED') === 'PENDING'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {txn.status || 'POSTED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [data, error, hasResults, isLoading, displayCurrency, displaySymbol, refetch]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto h-full w-full max-w-2xl bg-white shadow-2xl animate-in slide-in-from-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 bg-gray-50/50">
          <div>
            <p className="text-xs+ font-black uppercase tracking-[0.25em] text-gray-400">
              Provider Balance Activity
            </p>
            <p className="text-xl font-black text-gray-900">Transactions</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors"
            aria-label="Close transactions drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter */}
        <div className="px-6 pt-4 pb-3 border-b border-gray-50">
          <StatusFilter
            value={filters.transactionType || 'ALL'}
            onChange={(v) => handleFilterChange(v as ProviderBalanceTransactionType | 'ALL')}
            options={transactionTypes as string[]}
          />
        </div>

        {/* Loading indicator */}
        {isFetching && data && (
          <div className="px-6 py-2 flex items-center gap-2 text-xs text-gray-500 bg-gray-50/50 border-b border-gray-50">
            <Spinner size="sm" variant="secondary" className="h-3.5 w-3.5" />
            Refreshing...
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {drawerContent}
        </div>

        {/* Pagination */}
        {hasResults && (
          <div className="border-t border-gray-100 px-6 py-3">
            <Pagination
              meta={paginationMeta}
              onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
              onPageSizeChange={(pageSize) => setFilters((f) => ({ ...f, page: 1, pageSize }))}
              showPageSize={false}
              itemsTitle="transactions"
            />
          </div>
        )}
      </div>
    </div>
  );
};
