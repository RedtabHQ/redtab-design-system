import React, { useEffect, useState } from 'react';
import { ContractsTable } from '@/features/audit/components/ContractsTable';
import { useContracts } from '@/features/contracts/hooks/useContracts';
import { useCurrency } from '@/hooks/useCurrency';
import type { PaginationMeta } from '@/components/common/Pagination';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';

type ContractStatus = 'ACTIVE' | 'OVERDUE' | 'PAID' | 'DEFAULTED' | 'DELINQUENT';

const AuditContractsTab: React.FC = () => {
  const [contractPage, setContractPage] = useState(1);
  const [contractPageSize, setContractPageSize] = useState(5);
  const [contractStatus, setContractStatus] = useState<ContractStatus | undefined>();
  const { selectedSegment } = useMarketSegment();
  const marketSegmentId = selectedSegment?.id;

  useEffect(() => {
    setContractPage(1);
  }, [marketSegmentId]);

  const {
    data: contractsResponse,
    isLoading,
    isError,
    error,
  } = useContracts({
    page: contractPage,
    pageSize: contractPageSize,
    status: contractStatus,
    marketSegmentId,
  });

  const contracts = contractsResponse?.items || [];

  const contractPaginationMeta: PaginationMeta = {
    page: contractPage,
    pageSize: contractPageSize,
    total: contractsResponse?.meta?.total || 0,
    totalPages: contractsResponse?.meta?.totalPages || 1,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 items-center bg-gray-50/30">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Status
          </label>
          <select
            value={contractStatus || ''}
            onChange={(event) => {
              const value = event.target.value;
              setContractPage(1);
              setContractStatus(value ? (value as ContractStatus) : undefined);
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-redtab/20"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="OVERDUE">Overdue</option>
            <option value="PAID">Paid</option>
            <option value="DEFAULTED">Defaulted</option>
            <option value="DELINQUENT">Delinquent</option>
          </select>
        </div>
      </div>

      <ContractsTable
        contracts={contracts}
        isLoading={isLoading}
        isError={isError}
        error={error}
        paginationMeta={contractPaginationMeta}
        onPageChange={setContractPage}
        onPageSizeChange={setContractPageSize}
        totalItems={contractsResponse?.meta?.total || 0}
      />
    </div>
  );
};

export default AuditContractsTab;
