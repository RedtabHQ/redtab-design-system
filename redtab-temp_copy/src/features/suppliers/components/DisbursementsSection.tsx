import React, { lazy, Suspense, useState } from 'react';
import { History, X } from 'lucide-react';
import { Table, Pagination, Spinner } from '@/components/common';
import type { Payment } from '@/types';
import { formatDateTime, getStatusStyles } from '@/utils';
import { Link } from 'react-router-dom';
import { usePaymentsBySupplier } from '@/features/payment/hooks/usePayments';
import { Amount } from '@/components/common/Amount';

const DateTimePickerField = lazy(() => import('@/components/common/DateTimePickerField'));

type DisbursementsSectionProps = {
  supplierId: string;
};

export const DisbursementsSection: React.FC<DisbursementsSectionProps> = ({ supplierId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  const { data: transactionsData } = usePaymentsBySupplier(
    supplierId,
    { page: currentPage, pageSize, paymentType: 'SUPPLIER_SETTLEMENT', startDate, endDate },
  );
  const supplierTransactions = transactionsData ?? {
    items: [],
    meta: { page: currentPage, pageSize, total: 0, totalPages: 1 },
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleStartDateChange = (value: string | undefined) => {
    setStartDate(value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (value: string | undefined) => {
    setEndDate(value);
    setCurrentPage(1);
  };

  type SupplierTransactionRow = Payment;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex flex-wrap items-center">
          <div className="flex items-center justify-between flex-1">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <History className="text-redtab" size={18} /> Payout Ledger
            </h3>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <Suspense fallback={
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
                <Spinner size="sm" variant="secondary" />
              </div>
            }>
              <DateTimePickerField
                value={startDate}
                onChange={handleStartDateChange}
                dateFormat="yyyy-MM-dd"
                variant="compact"
              />
            </Suspense>
            <Suspense fallback={
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
                <Spinner size="sm" variant="secondary" />
              </div>
            }>
              <DateTimePickerField
                value={endDate}
                onChange={handleEndDateChange}
                dateFormat="yyyy-MM-dd"
                variant="compact"
              />
            </Suspense>
          </div>

          {/* Active Filters */}
          {(startDate || endDate) && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
              <span className="text-2xs font-black text-gray-400 uppercase tracking-widest">Active filters:</span>
              <div className="flex gap-2 flex-wrap">
                {startDate && (
                  <button
                    onClick={() => handleStartDateChange(undefined)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 border border-purple-200 rounded text-2xs font-bold text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    From: {startDate}
                    <X size={12} />
                  </button>
                )}
                {endDate && (
                  <button
                    onClick={() => handleEndDateChange(undefined)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded text-2xs font-bold text-orange-700 hover:bg-orange-100 transition-colors"
                  >
                    To: {endDate}
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="p-6">
          <Table
            columns={[
              {
                key: 'id',
                label: 'TXN ID',
                render: (value: string | number | undefined, row: SupplierTransactionRow) => (
                  <Link to={`/contracts/${row.contractId}`} className="font-mono text-xs font-bold text-gray-400 hover:text-redtab transition-colors">
                    {String(value)}
                  </Link>
                ),
              },
              {
                key: 'createdAt',
                label: 'Settlement Date',
                align: 'right',
                render: (value: string | number | undefined) => (
                  <span className="text-xs font-medium text-gray-500">{formatDateTime(value)}</span>
                ),
              },
              {
                key: 'amount',
                label: 'Amount',
                align: 'right',
                render: (value: string | number | undefined, row: SupplierTransactionRow) => {
                  // Use payment's currency, fall back to contract's market segment currency
                  const itemCurrency = row.contract?.marketSegment?.currency || '';

                  return (
                    <div className="flex flex-col md:items-end">
                      <Amount value={Number(value)} currency={itemCurrency} showUSD />
                    </div>
                  );
                }
              },
              {
                key: 'status',
                label: 'Status',
                render: (value: string | number | undefined) => (
                  <span className={`px-2 py-0.5 rounded text-3xs font-black uppercase border ${getStatusStyles(String(value))}`}>
                    {String(value)}
                  </span>
                ),
              },
            ]}
            data={supplierTransactions.items}
            keyExtractor={(row) => row.id}
            emptyMessage="No transactions found."
            headerClassName="bg-white border-b border-gray-100 text-2xs uppercase font-black text-gray-400 tracking-widest"
            rowClassName="divide-y divide-gray-50"
            containerClassName="overflow-x-auto"
          />
          <Pagination
            meta={supplierTransactions.meta}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            itemsTitle="transactions"
          />
        </div>
      </div>
    </div>
  );
};
