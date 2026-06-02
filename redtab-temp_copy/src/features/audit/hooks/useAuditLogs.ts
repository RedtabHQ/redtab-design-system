import { auditLogService, type FilterParams, type PaginationParams } from '@services';
import type { AuditLog } from '@types';
import { createResourceHooks } from '@/hooks/createResourceHooks';

/**
 * Audit log-specific query parameter types for type-safe filtering
 */
export interface AuditLogListParams extends PaginationParams, FilterParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'timestamp' | 'action' | 'category';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  userId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  merchantId?: string;
  marketSegmentId?: string;
  category?: 'RISK' | 'FINANCIAL' | 'KYC' | 'SYSTEM';
  status?: 'SUCCESS' | 'FAILURE';
  traits?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Create all audit log-related React Query hooks using the generic factory
 */
const auditLogHooks = createResourceHooks<AuditLog>('audit-logs', auditLogService);

/**
 * Query keys for audit logs - use for manual cache invalidation
 */
export const auditLogKeys = auditLogHooks.keys;

/**
 * Hook to fetch paginated list of audit logs
 */
export const useAuditLogs = auditLogHooks.useList<AuditLogListParams>;

/**
 * Hook to fetch a single audit log by ID
 */
export const useAuditLog = auditLogHooks.useDetail;

/**
 * Hook to create a new audit log
 */
export const useCreateAuditLog = auditLogHooks.useCreate;

/**
 * Hook to update an audit log
 */
export const useUpdateAuditLog = auditLogHooks.useUpdate;

/**
 * Hook to partially update an audit log
 */
export const usePatchAuditLog = auditLogHooks.usePatch;

/**
 * Hook to delete an audit log
 */
export const useDeleteAuditLog = auditLogHooks.useDelete;

/**
 * Hook to bulk delete audit logs
 */
export const useBulkDeleteAuditLogs = auditLogHooks.useBulkDelete;
