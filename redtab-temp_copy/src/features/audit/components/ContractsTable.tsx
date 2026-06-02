/**
 * Contracts Table Component
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Table } from '@/components/common/Table';
import { Pagination, type PaginationMeta } from '@/components/common/Pagination';
import { formatCurrency } from '@/utils/currencyFormatter';
import { formatDate } from '@/utils/dateFormatter';
import type { Contract } from '@/types';
import { Amount } from '@/components/common/Amount';

interface ContractsTableProps {
  contracts: Contract[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  paginationMeta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
}

export const ContractsTable = ({
  contracts,
  isLoading,
  isError,
  error,
  paginationMeta,
  onPageChange,
  onPageSizeChange,
  totalItems,
}: ContractsTableProps) => {
  const [expandedContractId, setExpandedContractId] = useState<string | undefined>();

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-sm font-bold text-red-900">Failed to load contracts</p>
          <p className="text-xs text-red-700 mt-1">
            {error instanceof Error ? error.message : 'An error occurred while fetching data'}
          </p>
        </div>
      </div>
    );
  }

  const columns = [
    {
      key: 'contractId' as const,
      label: 'Contract ID',
      width: 'w-1/4',
      render: (_value: unknown, contract: Contract) => (
        <Link
          to={`/contracts/${contract.id}`}
          className="text-xs whitespace-nowrap font-bold text-gray-900 hover:text-redtab transition-colors"
          aria-label={`View contract ${contract.id}`}
        >
          {contract.id}
        </Link>
      ),
    },
    {
      key: 'drawdownAmount' as const,
      label: 'Amount',
      align: 'right' as const,
      width: 'w-1/3',
      render: (_value: number, contract: Contract) => (
        <Amount value={_value} currency={contract.currency?.code} showUSD />
      ),
    },
    {
      key: 'dueDate' as const,
      label: 'Due Date',
      width: 'w-1/5',
      align: 'right' as const,
      render: (value?: Contract['dueDate']) => (
        <span className="text-sm text-gray-600">
          {value ? formatDate(value) : '--'}
        </span>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      width: 'w-1/5',
      align: 'center' as const,
      render: (value: Contract['status']) => (
        <span
          className={`text-2xs font-black px-2 py-1 rounded border ${
            value === 'ACTIVE'
              ? 'text-green-600 bg-green-50 border-green-100'
              : value === 'OVERDUE'
                ? 'text-orange-600 bg-orange-50 border-orange-100'
                : value === 'PAID'
                  ? 'text-blue-600 bg-blue-50 border-blue-100'
                  : 'text-red-600 bg-red-50 border-red-100'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'id' as const,
      label: 'Details',
      align: 'right' as const,
      render: (_value: unknown, contract: Contract) => {
        const isExpanded = expandedContractId === contract.id;
        return (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setExpandedContractId(isExpanded ? undefined : contract.id);
            }}
            className="p-2 cursor-pointer text-gray-300 hover:text-redtab transition-all"
            aria-expanded={isExpanded}
            aria-label={`Toggle details for ${contract.id}`}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        );
      },
    },
  ];

  return (
    <>
      <Table<Contract>
        columns={columns}
        data={contracts}
        keyExtractor={(contract) => contract.id}
        loading={isLoading}
        emptyMessage={<p className="text-gray-500 font-medium">No contracts found</p>}
        headerClassName="bg-gray-50/50 text-gray-400 text-2xs uppercase font-black tracking-widest border-b border-gray-100"
        rowClassName="divide-y divide-gray-50"
        containerClassName="overflow-x-auto"
        rowRenderer={({ row, defaultRow, rowKey, columnCount }) => (
          <>
            {defaultRow}
            {expandedContractId === row.id && (
              <tr key={`${rowKey}-expanded`} className="bg-gray-50/50">
                <td colSpan={columnCount} className="px-8 py-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Principal Paid
                      </p>
                      <p className="text-lg font-black text-gray-900 mt-1">
                        {formatCurrency(
                          row.principalPaid || 0,
                          row.marketSegment?.currency,
                          row.marketSegment?.currencySymbol
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Current Penalty
                      </p>
                      <p className="text-lg font-black text-gray-900 mt-1">
                        {formatCurrency(
                          row.currentPenalty || 0,
                          row.marketSegment?.currency,
                          row.marketSegment?.currencySymbol
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Tenure
                      </p>
                      <p className="text-lg font-black text-gray-900 mt-1">
                        {row.tenureDays || 0} days
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Days Overdue
                      </p>
                      <p className="text-lg font-black text-gray-900 mt-1">
                        {row.daysOverdue || 0} days
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </>
        )}
      />

      {!isLoading && totalItems > 0 && (
        <Pagination
          meta={paginationMeta}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          showPageSize={true}
          pageSizeOptions={[5, 10, 20, 30, 50]}
          itemsTitle="contracts"
        />
      )}
    </>
  );
};
