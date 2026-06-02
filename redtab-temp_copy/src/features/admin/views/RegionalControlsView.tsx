import React, { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction, MarketSegmentStatus } from '@/types';
import { RegionalHeader } from '@/features/contracts/components/RegionalHeader';
import { useUpdateMarketSegment, useMarketSegments } from '@/hooks/useMarketSegments';
import { RegionCardGrid, FXBridgeSection, RegionalSidebar } from '@/features/admin/components/RegionalControls';
import { Pagination } from '@/components/common/Pagination';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { useToast } from '@/hooks/useToast';

const RegionalControlsView: React.FC = () => {
  // Region card grid pagination
  const [regionPage, setRegionPage] = useState(1);
  const [regionPageSize, setRegionPageSize] = useState(12);
  const [showDeployConfirm, setShowDeployConfirm] = useState(false);

  const queryClient = useQueryClient();
  const { show: showToast } = useToast();

  // Fetch all market segments (both ACTIVE and INACTIVE) for the regional controls view
  const { data: segmentsResponse } = useMarketSegments({
    page: regionPage,
    pageSize: regionPageSize,
  });

  const paginatedSegments = segmentsResponse?.items || [];
  const regionPaginationMeta = segmentsResponse?.meta || {
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 1,
  };

  // FX Bridge pagination state
  const [fxBridgePage, setFxBridgePage] = useState(1);
  const [fxBridgePageSize, setFxBridgePageSize] = useState(10);

  // Fetch transactions from API
  const { data: transactionsResponse } = useTransactions({
    page: 1,
    pageSize: 100,
  });
  const transactions = transactionsResponse?.items || [];

  const updateSegmentMutation = useUpdateMarketSegment();

  const { data: activePolicy, refetch: refetchActivePolicy } = useQuery({
    queryKey: ['policies', 'active', 'raw'],
    queryFn: () => apiClient.get('/policies/configs/active'),
  });

  // Global policy deployment mutation
  const deployPolicyMutation = useMutation({
    mutationFn: async () => {
      // Fetch current active policy config
      const currentPolicy = activePolicy ?? (await refetchActivePolicy()).data;
      if (!currentPolicy) {
        throw new Error('Unable to load current policy configuration');
      }
      // Deploy the current configuration (this triggers sync events)
      return apiClient.post('/policies/deploy', currentPolicy);
    },
    onSuccess: () => {
      showToast({
        title: 'Policy Deployed',
        message: 'Global policy deployed successfully to all market segments',
        type: 'SUCCESS',
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      queryClient.invalidateQueries({ queryKey: ['policyConfig'] });
      queryClient.invalidateQueries({ queryKey: ['marketSegments'] });
      setShowDeployConfirm(false);
    },
    onError: (error: Error) => {
      showToast({
        title: 'Deployment Failed',
        message: `Failed to deploy policy: ${error.message}`,
        type: 'DANGER',
      });
      setShowDeployConfirm(false);
    },
  });

  const getActiveVolume = (currency: string): number => {
    console.warn('Calculating active volume for currency:', currency);
    return 0; 
  };

  const handleDeployPolicy = () => {
    setShowDeployConfirm(true);
  };

  const confirmDeployPolicy = () => {
    deployPolicyMutation.mutate();
  };

  const handleToggle = async (id: string, updates: { status: MarketSegmentStatus }) => {
    try {
      debugger
      await updateSegmentMutation.mutateAsync({ id, data: updates });
      showToast({
        title: "Update status",
        type: "SUCCESS",
        message: "Update config successfullyÏ"
      })
    } catch (e: any) {
      showToast({
        title: "Update status",
        type: "DANGER",
        message: e.message
      })
    }

  };

  return (
    <div className="mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <RegionalHeader onDeployPolicy={handleDeployPolicy} />

      <div>
        <RegionCardGrid
          segments={paginatedSegments}
          getActiveVolume={getActiveVolume}
          onToggle={handleToggle}
        />

        {regionPaginationMeta.total > regionPaginationMeta.pageSize && (
          <Pagination
            meta={regionPaginationMeta}
            onPageChange={setRegionPage}
            onPageSizeChange={setRegionPageSize}
            showPageSize={true}
            pageSizeOptions={[6, 12, 24, 36]}
            itemsTitle="market segments"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <FXBridgeSection
            page={fxBridgePage}
            pageSize={fxBridgePageSize}
            onPageChange={setFxBridgePage}
            onPageSizeChange={setFxBridgePageSize}
          />
        </div>

        <div className="lg:col-span-4">
          <RegionalSidebar />
        </div>
      </div>

      {/* Deploy Policy Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeployConfirm}
        onCancel={() => setShowDeployConfirm(false)}
        onConfirm={confirmDeployPolicy}
        title="Deploy Global Policy"
        message="Are you sure you want to deploy the current policy configuration to all active market segments? This action will synchronize policy settings across all regions."
        confirmText={deployPolicyMutation.isPending ? 'Deploying...' : 'Deploy'}
        cancelText="Cancel"
        isLoading={deployPolicyMutation.isPending}
      />
    </div>
  );
};

export default RegionalControlsView;
