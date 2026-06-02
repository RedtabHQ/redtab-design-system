import React from 'react';
import { FileStack } from 'lucide-react';
import { ContractTable } from '../components';
import { ContractFilters } from '../components/ContractFilters';
import ContractStatsSection from '../components/ContractStatsSection';
import { ListPageLayout, type PaginationMeta } from '@/components/common';
import { useContracts } from '../hooks/useContracts';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useListFilters } from '@/hooks/useListFilters';

const ContractListView: React.FC = () => {
  const { selectedSegment, isGlobalView } = useMarketSegment();

  // Get filters with internal state only
  const {
    currentPage,
    pageSize,
    searchTerm,
    statusFilter,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useListFilters<'ACTIVE' | 'OVERDUE' | 'PAID' | 'WRITTEN_OFF'>({
    defaultPageSize: 5,
  });

  // Fetch contracts from API
  const {
    data: contractsResponse,
    isLoading,
    isError,
    error,
  } = useContracts({
    page: currentPage,
    pageSize,
    search: searchTerm || undefined,
    status: statusFilter,
    marketSegmentId: selectedSegment?.id,
  });

  const contracts = contractsResponse?.items || [];
  const currentMarketSegmentName = selectedSegment?.name;

  // Pagination metadata
  const paginationMeta: PaginationMeta = {
    page: currentPage,
    pageSize,
    total: contractsResponse?.meta?.total || 0,
    totalPages: contractsResponse?.meta?.totalPages || 1,
  };

  return (
    <ListPageLayout
      icon={<FileStack className="text-redtab" size={28} />}
      title={isGlobalView ? 'Global Contract Ledger' : `${currentMarketSegmentName || 'Market'} Agreements`}
      subtitle={`Registry of ${contractsResponse?.meta?.total || contracts.length} financing contracts in this segment.`}
      stats={
        <ContractStatsSection
          searchTerm={searchTerm}
          statusFilter={statusFilter}
        />
      }
      filters={
        <ContractFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter || 'ALL'}
          onSearchChange={handleSearchChange}
          onStatusFilterChange={handleStatusFilterChange}
        />
      }
      paginationMeta={paginationMeta}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      itemsTitle="contracts"
      pageSizeOptions={[5, 10, 20, 30, 50]}
      isLoading={isLoading}
      isError={isError}
      errorMessage={error instanceof Error ? error.message : 'An error occurred'}
    >
      <ContractTable contracts={contracts} loading={isLoading} />
    </ListPageLayout>
  );
};

export default ContractListView;
