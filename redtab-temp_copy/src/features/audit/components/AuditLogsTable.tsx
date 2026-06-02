/**
 * Audit Logs Table Component
 */

import React, { useState } from 'react';
import { Eye, AlertCircle, Globe } from 'lucide-react';
import { Table } from '@/components/common/Table';
import { Pagination, type PaginationMeta } from '@/components/common/Pagination';
import type { AuditLog } from '@/types';

interface AuditLogsTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  paginationMeta: PaginationMeta;
  isGlobal: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
}

export const AuditLogsTable = ({
  logs,
  isLoading,
  isError,
  error,
  paginationMeta,
  isGlobal,
  onPageChange,
  onPageSizeChange,
  totalItems,
}: AuditLogsTableProps) => {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const handleToggleDetails = (logId: string) => {
    setExpandedLogId((prev) => (prev === logId ? null : logId));
  };

  const renderStatusBadge = (status?: AuditLog['status']) => {
    if (!status) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg border border-gray-200 text-2xs font-black uppercase tracking-widest text-gray-500">
          Unknown
        </span>
      );
    }

    const badgeClasses =
      status === 'SUCCESS'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
        : 'bg-red-50 text-red-700 border-red-100';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-2xs font-black uppercase tracking-widest ${badgeClasses}`}>
        {status}
      </span>
    );
  };

  const renderChangesTable = (changes: Record<string, unknown>) => {
    const entries = Object.entries(changes);
    if (entries.length === 0) return null;

    return (
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100 text-gray-500">
              <th className="px-3 py-2 text-left font-bold uppercase tracking-widest text-2xs">Field</th>
              <th className="px-3 py-2 text-left font-bold uppercase tracking-widest text-2xs">Before</th>
              <th className="px-3 py-2 text-left font-bold uppercase tracking-widest text-2xs">After</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {entries.map(([field, value]) => {
              const change = value as { before?: unknown; after?: unknown } | unknown;
              const hasDiff = typeof change === 'object' && change !== null && 'before' in change;
              return (
                <tr key={field} className="bg-white">
                  <td className="px-3 py-2 font-mono font-semibold text-gray-700">{field}</td>
                  <td className="px-3 py-2 text-red-600 font-mono">
                    {hasDiff ? JSON.stringify((change as any).before) : '—'}
                  </td>
                  <td className="px-3 py-2 text-emerald-600 font-mono">
                    {hasDiff ? JSON.stringify((change as any).after) : JSON.stringify(change)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMetadataSection = (metadata: Record<string, unknown>) => {
    const { description, request, provider, tierAdvisory, impact, error: errorInfo, ...rest } = metadata;

    return (
      <div className="space-y-3">
        {description ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-sm text-blue-900 font-medium">{String(description)}</p>
          </div>
        ) : null}

        {provider ? (
          <div>
            <p className="text-2xs font-black uppercase text-gray-400 tracking-widest mb-1">Provider Context</p>
            <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-xs space-y-1">
              {Object.entries(provider as Record<string, unknown>).filter(([, v]) => v != null).map(([k, v]) => (
                <p key={k}><span className="font-semibold text-gray-600">{k}:</span> <span className="text-gray-900">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span></p>
              ))}
            </div>
          </div>
        ) : null}

        {tierAdvisory ? (
          <div>
            <p className="text-2xs font-black uppercase text-gray-400 tracking-widest mb-1">Tier Advisory</p>
            <pre className="bg-amber-50 border border-amber-100 text-amber-900 text-xs rounded-xl p-3 overflow-x-auto">
              {JSON.stringify(tierAdvisory, null, 2)}
            </pre>
          </div>
        ) : null}

        {impact ? (
          <div>
            <p className="text-2xs font-black uppercase text-gray-400 tracking-widest mb-1">Impact</p>
            <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-xs">
              {Object.entries(impact as Record<string, unknown>).map(([k, v]) => (
                <span key={k} className="inline-block mr-4"><span className="font-semibold">{k}:</span> {String(v)}</span>
              ))}
            </div>
          </div>
        ) : null}

        {errorInfo ? (
          <div>
            <p className="text-2xs font-black uppercase text-red-400 tracking-widest mb-1">Error</p>
            <pre className="bg-red-50 border border-red-100 text-red-800 text-xs rounded-xl p-3 overflow-x-auto">
              {JSON.stringify(errorInfo, null, 2)}
            </pre>
          </div>
        ) : null}

        {request ? (
          <div>
            <p className="text-2xs font-black uppercase text-gray-400 tracking-widest mb-1">Request Context</p>
            <div className="rounded-xl border border-gray-100 bg-white px-4 py-2 text-xs text-gray-500 font-mono">
              {Object.entries(request as Record<string, unknown>).filter(([, v]) => v != null).map(([k, v]) => (
                <span key={k} className="inline-block mr-4">{k}: {String(v)}</span>
              ))}
            </div>
          </div>
        ) : null}

        {Object.keys(rest).length > 0 && (
          <div>
            <p className="text-2xs font-black uppercase text-gray-400 tracking-widest mb-1">Additional Data</p>
            <pre className="bg-gray-900 text-gray-100 text-xs rounded-xl p-3 overflow-x-auto">
              {JSON.stringify(rest, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const renderDetailRow = (log: AuditLog, columnCount: number) => (
    <tr key={`${log.id}-details`}>
      <td colSpan={columnCount} className="bg-gray-50 px-6 py-5">
        {/* Description banner */}
        {log.metadata?.description ? (
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-sm text-blue-900 font-medium">{String(log.metadata.description)}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <p className="text-2xs font-black uppercase text-gray-400 tracking-widest">Resource</p>
            <div className="rounded-xl border border-white bg-white px-4 py-3 shadow-sm">
              <p className="font-semibold text-gray-900">
                {log.resource || '—'}
                {log.resourceId ? (
                  <span className="text-xs text-gray-500 font-mono ml-2">#{log.resourceId}</span>
                ) : null}
              </p>
              {log.merchantId && (
                <p className="text-xs text-gray-500 mt-1">Merchant ID: {log.merchantId}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-2xs font-black uppercase text-gray-400 tracking-widest">Actor</p>
            <div className="rounded-xl border border-white bg-white px-4 py-3 shadow-sm">
              <p className="font-semibold text-gray-900">{log.actorId || log.userId || 'SYSTEM'}</p>
              <p className="text-xs text-gray-500 mt-1">
                Traits: {log.traits || '—'} • Category: {log.category || 'SYSTEM'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-2xs font-black uppercase text-gray-400 tracking-widest mb-2">Changes</p>
            {log.changes ? (
              renderChangesTable(log.changes)
            ) : (
              <p className="text-sm text-gray-500 italic">No field-level changes recorded.</p>
            )}
          </div>
          <div>
            <p className="text-2xs font-black uppercase text-gray-400 tracking-widest mb-2">Context</p>
            {log.metadata ? (
              renderMetadataSection(
                Object.fromEntries(
                  Object.entries(log.metadata).filter(([k]) => k !== 'description')
                )
              )
            ) : (
              <p className="text-sm text-gray-500 italic">No supplemental context provided.</p>
            )}
          </div>
        </div>
      </td>
    </tr>
  );

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-sm font-bold text-red-900">Failed to load audit logs</p>
          <p className="text-xs text-red-700 mt-1">
            {error instanceof Error ? error.message : 'An error occurred while fetching data'}
          </p>
        </div>
      </div>
    );
  }

  const columns = [
    {
      key: 'timestamp' as const,
      label: 'Event Time',
      width: 'w-1/4',
      render: (value?: AuditLog['timestamp']) => (
        <span className="text-xs font-bold text-gray-400">{value ?? '--'}</span>
      ),
    },
    {
      key: 'action' as const,
      label: 'Trace',
      width: 'w-1/3',
      render: (_value: AuditLog['action'], row: AuditLog) => (
        <div>
          <p className="text-sm font-black text-gray-900">{row.action}</p>
          {row.metadata?.description ? (
            <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{String(row.metadata.description)}</p>
          ) : null}
          <p className="text-3xs text-gray-400 uppercase font-bold mt-1">
            Actor: {row.actorId || 'SYSTEM'}
          </p>
        </div>
      ),
    },
    {
      key: 'resource' as const,
      label: 'Resource',
      width: 'w-1/4',
      render: (_value: AuditLog['resource'], row: AuditLog) => (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-900">{row.resource || '—'}</p>
          <p className="text-xs text-gray-500 font-mono">{row.resourceId ? `#${row.resourceId}` : ''}</p>
        </div>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      align: 'center' as const,
      render: (_value: AuditLog['status'], row: AuditLog) => renderStatusBadge(row.status),
    },
    {
      key: 'category' as const,
      label: 'Segment context',
      width: 'w-1/5',
      render: (value?: AuditLog['category']) => (
        <span className="text-2xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
          {value || 'SYSTEM'}
        </span>
      ),
    },
    {
      key: 'id' as const,
      label: 'Audit',
      align: 'right' as const,
      render: (_value: unknown, row: AuditLog) => (
        <button
          type="button"
          onClick={() => handleToggleDetails(row.id)}
          className="p-2 text-gray-400 hover:text-redtab transition-all rounded-xl border border-transparent hover:border-red-50"
          aria-label={expandedLogId === row.id ? 'Hide audit details' : 'View audit details'}
        >
          <Eye size={20} />
        </button>
      ),
    },
  ];

  return (
    <>
      {isGlobal && (
        <div className="px-4 py-2 flex items-center gap-2 text-2xs font-black text-gray-400 uppercase tracking-widest bg-gray-50/30 border-b border-gray-50">
          <Globe size={14} /> HQ Visibility
        </div>
      )}

      <Table<AuditLog>
        columns={columns}
        data={logs}
        keyExtractor={(log) => log.id}
        loading={isLoading}
        emptyMessage={<p className="text-gray-500 font-medium">No audit logs found</p>}
        headerClassName="bg-gray-50/50 text-gray-400 text-2xs uppercase font-black tracking-widest border-b border-gray-100"
        rowClassName="divide-y divide-gray-50"
        containerClassName="overflow-x-auto"
        rowRenderer={({ row, defaultRow, columnCount }) => (
          <>
            {defaultRow}
            {expandedLogId === row.id ? renderDetailRow(row, columnCount) : null}
          </>
        )}
      />

      {!isLoading && totalItems > 0 && (
        <Pagination
          meta={paginationMeta}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          showPageSize={true}
          pageSizeOptions={[5, 10, 20, 30, 50]}
          itemsTitle="audit logs"
        />
      )}
    </>
  );
};
