import React, { useEffect, useState } from 'react';
import { useAuditLogs, type AuditLogListParams } from '@/features/audit/hooks/useAuditLogs';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useListFilters } from '@/hooks/useListFilters';
import { FilterBar } from '@/components/common';
import { AuditLogFilters } from '@/features/audit/components/AuditLogFilters';
import { AuditLogsTable } from '@/features/audit/components/AuditLogsTable';
import type { PaginationMeta } from '@/components/common/Pagination';

const AuditLogsTab: React.FC = () => {
  const { selectedSegment, isGlobalView } = useMarketSegment();
  const activeSegmentId = isGlobalView ? undefined : selectedSegment?.id;
  const {
    currentPage,
    pageSize,
    searchTerm,
    statusFilter: status,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useListFilters({
    defaultPageSize: 5,
  });

  const [category, setCategory] = useState<string | undefined>();
  const [action, setAction] = useState<string | undefined>();
  const [traits, setTraits] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  useEffect(() => {
    handlePageChange(1);
  }, [activeSegmentId, handlePageChange]);

  const {
    data: auditLogsResponse,
    isLoading,
    isError,
    error,
  } = useAuditLogs({
    page: currentPage,
    pageSize,
    search: searchTerm || undefined,
    category: category as AuditLogListParams['category'],
    status: status as AuditLogListParams['status'],
    action,
    traits,
    startDate,
    endDate,
    marketSegmentId: activeSegmentId,
  });

  const auditLogs = auditLogsResponse?.items || [];
  const isGlobal = isGlobalView;

  const auditPaginationMeta: PaginationMeta = {
    page: currentPage,
    pageSize,
    total: auditLogsResponse?.meta?.total || 0,
    totalPages: auditLogsResponse?.meta?.totalPages || 1,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <AuditLogFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={handleStatusFilterChange}
        traits={traits}
        onTraitsChange={setTraits}
        action={action}
        onActionChange={setAction}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
      />

      <AuditLogsTable
        logs={auditLogs}
        isLoading={isLoading}
        isError={isError}
        error={error}
        paginationMeta={auditPaginationMeta}
        isGlobal={isGlobal}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        totalItems={auditLogsResponse?.meta?.total || 0}
      />
    </div>
  );
};

export default AuditLogsTab;
