import React from 'react';
import { AlertCircle } from 'lucide-react';
import { PageHeader } from '../PageHeader';
import { Pagination, type PaginationMeta } from '../Pagination';
import { Spinner } from '../Spinner';

export type { PaginationMeta } from '../Pagination';

export interface ListPageLayoutProps {
  // Header
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;

  // Slots
  stats?: React.ReactNode;     // optional grid of StatsCards
  filters?: React.ReactNode;   // ContractFilters / MerchantFilters / etc.
  children: React.ReactNode;   // the table

  // Pagination
  paginationMeta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  itemsTitle?: string;
  pageSizeOptions?: number[];

  // State
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;

  className?: string;
}

export const ListPageLayout: React.FC<ListPageLayoutProps> = ({
  title,
  subtitle,
  icon,
  actions,
  backHref,
  stats,
  filters,
  children,
  paginationMeta,
  onPageChange,
  onPageSizeChange,
  itemsTitle,
  pageSizeOptions,
  isLoading = false,
  isError = false,
  errorMessage,
  className,
}) => {
  return (
    <div className={`space-y-8 pb-20 animate-in fade-in duration-500 ${className || ''}`}>
      <PageHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        actions={actions}
        backHref={backHref}
      />

      {stats && <>{stats}</>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        {filters && filters}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" variant="primary" label="Loading..." />
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3 m-6">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-bold text-red-900">Failed to load data</p>
              {errorMessage && (
                <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && (
          <>
            {children}

            {/* Pagination */}
            {paginationMeta && (
              <Pagination
                meta={paginationMeta}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                showPageSize={!!onPageSizeChange}
                pageSizeOptions={pageSizeOptions}
                itemsTitle={itemsTitle}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
