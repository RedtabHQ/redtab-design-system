import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Table, EmptyState, Tooltip } from '@/components/common';
import type { Contract } from '@/types';
import { formatDateTime } from '@/utils/dateFormatter';
import { formatCurrency } from '@/utils/currencyFormatter';
import { useCurrency } from '@/hooks/useCurrency';
import { useExchangeRateContext } from '@/contexts/ExchangeRateContext';
import { getInstallmentStatusStyles } from '@/features/contracts/utils/installmentStatus';
import { DEFAULT_GLOBAL_CURRENCY, DEFAULT_GLOBAL_CURRENCY_SYMBOL, getCurrencySymbol } from '@/constants/currency';
import { Amount } from '@/components/common/Amount';

interface ContractTableProps {
  contracts: Contract[];
  onRowClick?: (contract: Contract) => void;
  loading?: boolean;
  containerClassName?: string;
}

/**
 * Get status badge styling based on contract status
 */
const getStatusStyles = (status: Contract['status']): string => {
  const statusMap: Record<Contract['status'], string> = {
    'ACTIVE': 'bg-blue-50 text-blue-700 border-blue-100',
    'OVERDUE': 'bg-orange-50 text-orange-700 border-orange-100',
    'PAID': 'bg-green-50 text-green-700 border-green-100',
    'DEFAULTED': 'bg-red-50 text-red-700 border-red-100',
    'DELINQUENT': 'bg-red-50 text-red-700 border-red-100',
    'WRITTEN_OFF': 'bg-gray-50 text-gray-700 border-gray-100',
  };
  return statusMap[status] || 'bg-gray-50 text-gray-700 border-gray-100';
};

/**
 * Reusable Contract Table component
 * Displays contracts in a formatted table with standardized styling
 */
export const ContractTable: React.FC<ContractTableProps> = ({
  contracts,
  onRowClick,
  loading = false,
  containerClassName,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (contract: Contract) => {
    if (onRowClick) {
      onRowClick(contract);
    } else {
      navigate(`/contracts/${contract.id}`);
    }
  };

  const columns = [
    {
      key: 'id' as const,
      label: 'Agreement ID',
      width: 'w-1/4',
      render: (_value: unknown, row: Contract) => (
        <div className="flex items-center gap-4 whitespace-nowrap truncate">
          <div>
            <p className="text-sm font-black text-gray-900 hover:text-redtab transition-colors">
              {row.id}
            </p>
            <p className="text-2xs text-gray-400 font-mono mt-0.5">
              {row.disbursedAt ? `EST: ${formatDateTime(row.disbursedAt)}` : 'N/A'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'drawdownAmount' as const,
      label: 'Principal Value',
      width: 'w-1/5',
      align: 'right' as const,
      render: (_value: unknown, row: Contract) => {
        // Use contract's currency, fall back to market segment if not available
        const contractCurrency = row.marketSegment?.currency || '';
        const contractCurrencySymbol = row.marketSegment?.currencySymbol || '';
        return (
          <div>
            <Amount value={row.drawdownAmount ?? 0} currency={contractCurrency} symbol={contractCurrencySymbol} showUSD />
            <p className="text-3xs text-gray-400 uppercase font-black mt-1">
              Disbursed
            </p>
          </div>
        );
      },
    },
    {
      key: 'dueDate' as const,
      label: 'Lifecycle Terms',
      width: 'w-1/5',
      align: 'right' as const,
      render: (_value: unknown, row: Contract) => (
        <div className="flex items-center gap-2 lg:justify-end">
          <span className="text-xs font-bold text-gray-600">
            {row.originalTenure ? `${row.originalTenure} days` : 'N/A'}
          </span>
          {row.daysOverdue && row.daysOverdue > 0 ? (
            <span className="text-3xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-tight">
              {row.daysOverdue}d Overdue
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: 'nextRepaymentSummary' as const,
      label: 'Next Repayment',
      width: 'w-1/5',
      align: 'right' as const,
      render: (_value: unknown, row: Contract) => {
        const nextInstallment = row.nextRepaymentSummary;

        if (!nextInstallment) {
          return <p className="text-xs text-gray-400 font-medium">No schedule</p>;
        }

        const statusStyles = getInstallmentStatusStyles(nextInstallment.status);
        const totalAmt = nextInstallment.totalDue ?? 0;
        // Use contract's currency, fall back to global currency context
        const contractCurrency = row.marketSegment?.currency || '';
        const contractCurrencySymbol = row.marketSegment?.currencySymbol || '';

        return (
          <div className="space-y-1">
            <Amount value={totalAmt ?? row.principalDue ?? 0} currency={contractCurrency} symbol={contractCurrencySymbol} showUSD />

            <div className="flex lg:justify-end">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-3xs font-black uppercase tracking-widest ${statusStyles.badgeClasses}`}>
                {statusStyles.label}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status' as const,
      label: 'Lifecycle Status',
      align: 'center' as const,
      width: 'w-1/5',
      render: (value: string | number | undefined) => {
        const status = (value ?? 'ACTIVE') as Contract['status'];
        return (
          <span className={`text-xs font-black uppercase tracking-tight px-2.5 py-1 rounded-xl border ${getStatusStyles(status)}`}>
            {status}
          </span>
        );
      },
    },
    {
      key: 'id' as const,
      label: 'Audit',
      width: 'w-auto',
      align: 'center' as const,
      render: (_value: unknown) => (
        <Tooltip content="View contract details" position="top">
          <button
            className="p-2 text-gray-300 hover:text-redtab hover:bg-red-50 rounded-xl transition-all"
            aria-label="View contract details"
          >
            <Eye size={20} aria-hidden="true" />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table<Contract>
        columns={columns}
        data={contracts}
        keyExtractor={(contract) => contract.id}
        loading={loading}
        emptyMessage={
          <EmptyState
            title="No contracts found"
            description="Try adjusting your search or filters"
            variant="compact"
          />
        }
        onRowClick={handleRowClick}
        headerClassName="bg-gray-50/50 text-gray-400 text-2xs uppercase tracking-widest font-black border-b border-gray-100"
        rowClassName="divide-y divide-gray-50"
        containerClassName={
          containerClassName ||
          'overflow-x-auto rounded-lg border-0'
        }
      />
    </div>
  );
};
