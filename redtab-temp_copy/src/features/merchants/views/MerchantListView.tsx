import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, UserPlus } from 'lucide-react';
import { useMerchants } from '../hooks/useMerchants';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useListFilters } from '@/hooks/useListFilters';
import { ListPageLayout, type PaginationMeta } from '@/components/common';
import { Button } from '@/components/common/Button';
import { MerchantListFilters } from '../components/MerchantListFilters';
import { MerchantTable } from '../components/MerchantTable';
import { EmptyState } from '@/components/common';
import type { Merchant } from '@/types';
import { MerchantStatus } from '@/types';

const MERCHANT_STATUS_OPTIONS = ['ALL', MerchantStatus.VERIFIED, MerchantStatus.PENDING, MerchantStatus.SUSPENDED];

const MerchantListView: React.FC = () => {
  const { t } = useTranslation('merchants');
  const navigate = useNavigate();
  const { availableSegments, selectedSegment, isGlobalView } = useMarketSegment();

  // Manage filter state (internal only, no URL sync)
  const {
    currentPage,
    pageSize,
    searchTerm,
    statusFilter,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
  } = useListFilters<'ALL' | 'VERIFIED' | 'PENDING' | 'SUSPENDED'>({
    defaultPageSize: 5,
    defaultStatus: 'ALL' as 'ALL' | 'VERIFIED' | 'PENDING' | 'SUSPENDED',
  });

  // Fetch merchants from API
  const { data: merchantsResponse, isLoading, error, isFetching } = useMerchants({
    page: currentPage,
    pageSize,
    search: searchTerm || undefined,
    status: statusFilter === 'ALL' ? undefined : (statusFilter as 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED'),
    marketSegmentId: selectedSegment?.id,
  });

  const responseData = merchantsResponse;
  const merchants = (responseData?.items || []) as Merchant[];

  const handleMerchantClick = (merchantId: string) => {
    navigate(`/merchants/${merchantId}`);
  };

  const handleAddMerchant = () => {
    navigate('/onboarding');
  };

  const paginationMeta: PaginationMeta = {
    page: currentPage,
    pageSize,
    total: responseData?.meta?.total || 0,
    totalPages: responseData?.meta?.totalPages || 1,
  };

  return (
    <ListPageLayout
      icon={<Users className="text-redtab" size={28} />}
      title={isGlobalView ? t('globalMerchantDirectory') : t('marketMerchants', { market: selectedSegment?.name || 'Market' })}
      subtitle={t('registryDescription', { total: responseData?.meta?.total || 0, region: isGlobalView ? t('allRegions') : t('thisMarket') })}
      actions={
        <Button variant="primary" size="md" onClick={handleAddMerchant} className="uppercase font-black">
          <UserPlus size={18} /> {t('onboardMerchant')}
        </Button>
      }
      filters={
        <MerchantListFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter || 'ALL'}
          onStatusFilterChange={handleStatusFilterChange}
          searchPlaceholder={t('searchPlaceholder')}
        />
      }
      paginationMeta={paginationMeta}
      onPageChange={handlePageChange}
      itemsTitle="merchants"
      pageSizeOptions={[5, 10, 20, 30, 50]}
      isLoading={isLoading}
      isError={!!error}
      errorMessage={error instanceof Error ? error.message : undefined}
    >
      <MerchantTable
        merchants={merchants}
        regions={availableSegments}
        onMerchantClick={handleMerchantClick}
        emptyMessage={
          <EmptyState
            title={t('noMerchantsFound')}
            description={t('searchPlaceholder')}
            variant="compact"
          />
        }
      />
    </ListPageLayout>
  );
};

export default MerchantListView;
