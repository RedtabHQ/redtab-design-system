import React from 'react';
import { RefreshCcw, AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/common';
import { useMarketSegments } from '@/hooks/useMarketSegments';
import { Pagination } from '@/components/common/Pagination';
import { FXBridgeList } from './FXBridgeList';

interface FXBridgeSectionProps {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const FXBridgeSection: React.FC<FXBridgeSectionProps> = ({
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const {
    data: fxBridgeResponse,
    isLoading: isFxBridgeLoading,
    isError: isFxBridgeError,
    error: fxBridgeError,
    refetch: refetchFxBridge,
  } = useMarketSegments({
    page,
    pageSize,
    status: 'ACTIVE',
  });

  const handleRefreshData = () => {
    refetchFxBridge();
  };

  const fxBridgeSegments = fxBridgeResponse?.items || [];
  const fxBridgeMeta = fxBridgeResponse?.meta || {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm space-y-10">
      <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <button
          onClick={handleRefreshData}
          className="hover:text-redtab transition-colors cursor-pointer"
          title="Click here to refresh data"
        >
          <RefreshCcw size={16} className={isFxBridgeLoading ? 'animate-spin' : ''} />
        </button>
        FX Bridge Maintenance
      </h3>

      {/* Loading State */}
      {isFxBridgeLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" variant="primary" label="Loading market segments..." />
        </div>
      )}

      {/* Error State */}
      {isFxBridgeError && !isFxBridgeLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-red-900">Failed to load market segments</p>
            <p className="text-xs text-red-700 mt-1">
              {fxBridgeError instanceof Error ? fxBridgeError.message : 'An error occurred'}
            </p>
          </div>
        </div>
      )}

      {/* Data Display */}
      {!isFxBridgeLoading && !isFxBridgeError && (
        <>
          <FXBridgeList
            segments={fxBridgeSegments}
          />

          {/* Pagination */}
          {fxBridgeMeta.total > 0 && (
            <Pagination
              meta={fxBridgeMeta}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              showPageSize={true}
              pageSizeOptions={[5, 10, 20]}
              itemsTitle="market segments"
            />
          )}
        </>
      )}
    </div>
  );
};
