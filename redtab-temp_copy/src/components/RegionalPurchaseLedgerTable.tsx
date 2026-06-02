import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { useMerchant } from '@/features/merchants/hooks';
import { useContracts } from '@/features/contracts/hooks';
import { Contract } from '@/types';
import { Table } from './common/Table';
import { Pagination } from './common/Pagination';
import { EmptyState } from './common/EmptyState';
import { formatDateTime } from '@/utils/dateFormatter';
import { DEFAULT_GLOBAL_CURRENCY, DEFAULT_GLOBAL_CURRENCY_SYMBOL } from '@/constants/currency';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';
import { Amount } from './common/Amount';

interface RegionalPurchaseLedgerTableProps {
  merchantId: string;
}

const DEFAULT_PAGE_SIZE = 8;

function getStatusBadgeClass(status?: string): string {
  switch (status) {
    case 'PAID':
      return 'bg-green-50 text-green-700';
    case 'OVERDUE':
    case 'DEFAULTED':
      return 'bg-red-50 text-red-700';
    case 'DELINQUENT':
      return 'bg-orange-50 text-orange-700';
    case 'WRITTEN_OFF':
      return 'bg-gray-50 text-gray-700';
    default:
      return 'bg-blue-50 text-blue-700';
  }
}

const getContractColumns = (
) => [
    {
      key: 'id' as keyof Contract,
      label: 'Agreement ID',
      render: (_value: unknown, row: Contract) => (
        <Link to={`/contracts/${row.id}`} className="hover:underline flex items-center gap-2">
          <span className="font-mono text-xs font-black text-gray-400">{row.id}</span>
        </Link>
      ),
    },
    {
      key: 'drawdownAmount' as keyof Contract,
      label: 'Principal',
      align: 'right' as const,
      sortable: true,
      render: (_value: unknown, row: Contract) => {
        return (
          <>
          <Amount currency={row.currency?.code} value={row.drawdownAmount} showUSD />
          </>
        );
      },
    },
    // {
    //   key: 'currency' as keyof Contract,
    //   label: 'Currency',
    //   align: 'center' as const,
    //   render: (_value: unknown, row: Contract) => (
    //     <span className="text-xs font-bold text-gray-500">
    //       {options.isGlobal
    //         ? DEFAULT_GLOBAL_CURRENCY
    //         : row.currency || merchant.currency || options.displayCurrency}
    //     </span>
    //   ),
    // },
    {
      key: 'tenureDays' as keyof Contract,
      label: 'Tenure',
      sortable: true,
      align: 'right' as const,
      render: (_value: unknown, row: Contract) => (
        <span className="text-xs font-bold text-gray-500">{row.tenureDays || '-'}D</span>
      ),
    },
    {
      key: 'status' as keyof Contract,
      label: 'Status',
      sortable: true,
      align: 'center' as const,
      render: (_value: unknown, row: Contract) => (
        <span className={`px-2.5 py-1 rounded-lg text-3xs font-black uppercase ${getStatusBadgeClass(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

const RegionalPurchaseLedgerTable: React.FC<RegionalPurchaseLedgerTableProps> = ({ merchantId }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { currency: baseCurrency, symbol: baseSymbol, isGlobal } = useCurrency();

  // Fetch merchant data
  const { data: merchant, isLoading: isMerchantLoading } = useMerchant(merchantId, { enabled: !!merchantId });

  // Fetch contracts for this merchant with pagination
  const { data: contractsData, isLoading: isContractsLoading } = useContracts(
    merchantId ? { merchantId, page, pageSize } : undefined,
    { enabled: !!merchantId }
  );

  const merchantContracts = contractsData?.items || [];
  const paginationMeta = contractsData?.meta;
  const loading = isMerchantLoading || isContractsLoading;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Regional Purchase Ledger</h3>
        </div>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
  }

  if (!merchant) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Regional Purchase Ledger</h3>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertTriangle size={20} />
            <span className="text-sm font-bold">Merchant not found</span>
          </div>
        </div>
      </div>
    );
  }

  const displayCurrency = isGlobal
    ? DEFAULT_GLOBAL_CURRENCY
    : merchant.currency || baseCurrency;
  const displaySymbol = isGlobal
    ? DEFAULT_GLOBAL_CURRENCY_SYMBOL
    : merchant.marketSegment?.currencySymbol || baseSymbol;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Regional Purchase Ledger</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Merchant:</span>
            <span className="text-sm font-black text-gray-900">{merchant.name}</span>
            <ShieldCheck className={merchant.status === 'VERIFIED' ? 'text-green-500' : 'text-gray-300'} size={16} />
          </div>
        </div>
      </div>

      <Table<Contract>
        columns={getContractColumns()}
        data={merchantContracts}
        keyExtractor={(row) => row.id}
        loading={isContractsLoading}
        emptyMessage={
          <EmptyState
            title="No contracts found"
            description="This merchant has no contracts"
            variant="compact"
            className="py-10"
          />
        }
        containerClassName="border-0 rounded-none"
        headerClassName="bg-gray-50 text-2xs uppercase font-black text-gray-400 tracking-widest"
      />

      {paginationMeta && paginationMeta.totalPages > 1 && (
        <Pagination
          meta={paginationMeta}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          itemsTitle="contracts"
        />
      )}

      {merchantContracts.length > 0 && (
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs font-bold text-gray-600">
            <span>Total Contracts: {paginationMeta?.total || merchantContracts.length}</span>
            <span className="text-gray-400">
              Currency: {isGlobal ? DEFAULT_GLOBAL_CURRENCY : merchant.currency?.code} • Last Updated: {formatDateTime(new Date().toISOString())}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionalPurchaseLedgerTable;
