import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { contractService } from '@services';
import type { Contract, PaginatedResponse } from '@/types';
import { createResourceHooks } from '@/hooks/createResourceHooks';
import { contractKpiService } from '@/services';

/**
 * Contract-specific query parameter types for type-safe filtering
 */
export interface ContractListParams extends Record<string, unknown> {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'dueDate' | 'drawdownAmount' | 'status';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: 'ACTIVE' | 'OVERDUE' | 'PAID' | 'DEFAULTED' | 'DELINQUENT' | 'WRITTEN_OFF';
  merchantId?: string;
  supplierId?: string;
  minAmount?: number;
  maxAmount?: number;
  overdueOnly?: boolean;
  marketSegmentId?: string;
}

/**
 * Export filter parameters for CSV export
 */
export interface ContractExportParams {
  search?: string;
  status?: 'ACTIVE' | 'OVERDUE' | 'PAID' | 'DEFAULTED' | 'DELINQUENT';
  merchantId?: string;
  supplierId?: string;
}

/**
 * Create all contract-related React Query hooks using the generic factory
 */
const contractHooks = createResourceHooks<Contract>('contracts', contractService);

/**
 * Query keys for contracts - use for manual cache invalidation
 */
export const contractKeys = contractHooks.keys;

/**
 * Hook to fetch paginated list of contracts
 */
export const useContracts = (params?: ContractListParams, options?: Omit<UseQueryOptions<PaginatedResponse<Contract>>, 'queryKey' | 'queryFn'>) =>
  contractHooks.useList(params, options);

/**
 * Hook to fetch a single contract by ID
 */
export const useContract = contractHooks.useDetail;

/**
 * Hook to create a new contract
 */
export const useCreateContract = contractHooks.useCreate;

/**
 * Hook to update a contract
 */
export const useUpdateContract = contractHooks.useUpdate;

/**
 * Hook to partially update a contract
 */
export const usePatchContract = contractHooks.usePatch;

/**
 * Hook to delete a contract
 */
export const useDeleteContract = contractHooks.useDelete;

/**
 * Hook to bulk delete contracts
 */
export const useBulkDeleteContracts = contractHooks.useBulkDelete;

/**
 * Hook to export contracts as CSV
 * @returns Mutation hook with exportCSV function
 */
export const useExportContractsCSV = () => {
  return useMutation({
    mutationFn: async (params?: ContractExportParams) => {
      const queryParams = new URLSearchParams();

      if (params?.status) {
        queryParams.append('status', params.status);
      }
      if (params?.search) {
        queryParams.append('search', params.search);
      }
      if (params?.merchantId) {
        queryParams.append('merchantId', params.merchantId);
      }
      if (params?.supplierId) {
        queryParams.append('supplierId', params.supplierId);
      }

      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

      const response = await fetch(
        `${baseUrl}/api/v1/contracts/export/csv?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] || `contract-ledger-${new Date().toISOString().split('T')[0]}.csv`;

      return { blob, filename };
    },
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};

/**
 * Hook to fetch KPI aggregation for contracts
 * @deprecated Use useContractKpiAggregation instead
 * @param params - Filter parameters (excluding pagination)
 * @returns Query result with KPI data
 */
export const useContractKpi = (params: Omit<ContractListParams, 'page' | 'pageSize'>) => {
  return useQuery({
    queryKey: ['contract-kpi', params],
    queryFn: () => contractKpiService.getKpis(params),
  });
};

/**
 * Hook to fetch suppliers linked to a contract
 * Useful for finding alternate suppliers or supplier relationships
 *
 * @param contractId - Contract ID
 * @param params - Pagination parameters
 * @returns Query result with linked suppliers
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useContractLinkedSuppliers('C001', {
 *   page: 1,
 *   pageSize: 10
 * });
 *
 * if (isLoading) return <LoadingSpinner />;
 *
 * const suppliers = data?.items || [];
 * ```
 */
export const useContractLinkedSuppliers = (
  contractId: string,
  params?: { page?: number; pageSize?: number }
) => {
  return useQuery({
    queryKey: ['contracts', contractId, 'linked-suppliers', params],
    queryFn: () => contractService.getLinkedSuppliers(contractId, params),
    enabled: !!contractId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch paginated lifecycle events for a contract
 */
export const useContractLifecycleEvents = (
  contractId: string,
  params?: { page?: number; pageSize?: number; sortBy?: string; sortOrder?: string }
) => {
  return useQuery({
    queryKey: ['contracts', contractId, 'lifecycle-events', params],
    queryFn: () => contractService.getLifecycleEvents(contractId, params),
    enabled: !!contractId,
  });
};

/**
 * Hook to fetch overdue contracts
 * @param params - Filter and pagination parameters
 * @returns Query result with overdue contracts
 */
export const useOverdueContracts = (params?: Omit<ContractListParams, 'overdueOnly'>, options?: Omit<UseQueryOptions<PaginatedResponse<Contract>>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: ['contracts', 'overdue', params],
    queryFn: () => contractService.getOverdueContracts(params),
    ...options,
  });

/**
 * Hook to fetch contract statistics
 * @returns Query result with contract statistics
 */
export const useContractStatistics = (options?: Omit<UseQueryOptions<Record<string, number>>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: ['contracts', 'statistics'],
    queryFn: () => contractService.getStatistics(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });

/**
 * Hook to fetch KPI aggregation for contracts
 * Replaces the old useContractKpi hook
 * @returns Query result with KPI aggregation
 */
export const useContractKpiAggregation = (
  params?: Omit<ContractListParams, 'page' | 'pageSize'>,
  options?: Omit<
    UseQueryOptions<{
      totalDisbursed: number;
      totalOutstanding: number;
      totalRecovered: number;
      recoveryProgress: number;

      currency: string;
      currencySymbol: string;
    }>,
    'queryKey' | 'queryFn'
  >
) =>
  useQuery({
    queryKey: ['contracts', 'kpi-aggregation', params],
    queryFn: () => contractService.getKpiAggregation(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
