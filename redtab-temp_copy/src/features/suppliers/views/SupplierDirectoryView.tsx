import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus } from 'lucide-react';
import { useSupplierDirectory } from '@/features/suppliers/hooks/useSupplierDirectory';
import { SupplierTable } from '@/components/SupplierTable';
import { ListPageLayout, type PaginationMeta } from '@/components/common';
import { useCurrentMarketSegment, useIsGlobalMarketView, useMarketSegment } from '@/contexts/MarketSegmentContext';
import { Button } from '@/components/common/Button';
import { SupplierDirectoryFilters } from '../components/SupplierDirectoryFilters';

const SupplierDirectoryView: React.FC = () => {
  const navigate = useNavigate();
  const { selectedSegment } = useMarketSegment();

  const {
    suppliers,
    currentPage,
    pageSize,
    totalPages,
    total,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    setPageSize,
  } = useSupplierDirectory({
    pageSize: 5,
    marketSegmentId: selectedSegment?.id,
  });

  const isGlobal = useIsGlobalMarketView();
  const currentMarketSegment = useCurrentMarketSegment();
  const { availableSegments } = useMarketSegment();

  const paginationMeta: PaginationMeta = {
    page: currentPage,
    pageSize,
    total,
    totalPages,
  };

  return (
    <ListPageLayout
      icon={<Truck className="text-redtab" size={28} />}
      title={isGlobal ? 'Global Supplier Index' : `${currentMarketSegment} Suppliers`}
      subtitle="Registry of authorized settlement beneficiaries for all segments."
      actions={
        <Button className="uppercase font-black" variant="primary" size="md" onClick={() => navigate('/suppliers/onboarding')}>
          <Plus size={18} /> Partner Onboarding
        </Button>
      }
      filters={
        <SupplierDirectoryFilters
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          isGlobal={isGlobal}
        />
      }
      paginationMeta={paginationMeta}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      itemsTitle="suppliers"
      pageSizeOptions={[5, 10, 20, 30, 50]}
      isLoading={isLoading}
      isError={isError}
      errorMessage={error?.message}
    >
      <SupplierTable suppliers={suppliers} loading={isLoading} regions={availableSegments} />
    </ListPageLayout>
  );
};

export default SupplierDirectoryView;
