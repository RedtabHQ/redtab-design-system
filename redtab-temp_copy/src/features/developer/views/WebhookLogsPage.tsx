import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { developerService } from '@/features/developer/services/developerService';
import { WebhookLog, WebhookLogStatus } from '@/types/developer';
import { ScrollText, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { formatDateTime } from '@/utils/dateFormatter';

export default function WebhookLogsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { data: logs = [], isLoading } = useQuery<WebhookLog[]>({
    queryKey: ['developer', 'webhook-logs', { page, pageSize }],
    queryFn: async () => {
      const response = await developerService.listWebhookLogs({ page, pageSize });
      const data = (response as { items?: WebhookLog[] }).items || response;
      return Array.isArray(data) ? data : [];
    },
    placeholderData: (previousData) => previousData ?? [],
  });

  const { data: selectedLog } = useQuery<WebhookLog>({
    queryKey: ['developer', 'webhook-log', selectedLogId],
    queryFn: () => developerService.getWebhookLog(selectedLogId as string),
    enabled: !!selectedLogId && showDetailModal,
  });

  const getStatusIcon = (status: WebhookLogStatus) => {
    switch (status) {
      case WebhookLogStatus.SUCCESS:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case WebhookLogStatus.FAILED:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case WebhookLogStatus.RETRYING:
        return <RefreshCw className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: WebhookLogStatus) => {
    switch (status) {
      case WebhookLogStatus.SUCCESS:
        return 'bg-green-100 text-green-800';
      case WebhookLogStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case WebhookLogStatus.RETRYING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatJson = (data: unknown) => {
    return JSON.stringify(data, null, 2);
  };

  const viewDetails = async (log: WebhookLog) => {
    setSelectedLogId(log.id);
    setShowDetailModal(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Webhook Logs</h2>
        <p className="text-sm text-gray-600 mt-1">
          View webhook delivery history and debug issues
        </p>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-white rounded-lg shadow">
            <div
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(log.status)}
                    <span className="font-mono text-sm text-redtab">{log.eventType}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                    {log.responseStatusCode && (
                      <span className="text-sm text-gray-600">
                        HTTP {log.responseStatusCode}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">URL:</span> {log.url}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDateTime(log.createdAt)}
                    </span>
                    {log.durationMs && (
                      <span>Duration: {log.durationMs}ms</span>
                    )}
                    <span>Attempt: {log.attemptNumber}</span>
                  </div>

                  {log.errorMessage && (
                    <div className="mt-2 text-sm text-red-600">
                      Error: {log.errorMessage}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewDetails(log);
                    }}
                    className="px-3 py-1 text-sm text-redtab hover:bg-red-50 rounded"
                  >
                    Details
                  </button>
                  {expandedLog === log.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedLog === log.id && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Request Payload</h4>
                    <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto max-h-48">
                      {formatJson(log.requestPayload)}
                    </pre>
                  </div>
                  {log.responseData && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Response Data</h4>
                      <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto max-h-48">
                        {formatJson(log.responseData)}
                      </pre>
                    </div>
                  )}
                </div>

                {log.requestHeaders && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Request Headers</h4>
                    <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto">
                      {formatJson(log.requestHeaders)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {logs.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <ScrollText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No webhook logs</h3>
            <p className="text-gray-600">
              Webhook delivery logs will appear here once webhooks start firing
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {logs.length > 0 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {page}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={logs.length < pageSize}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-2">Webhook Log Details</h3>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(selectedLog.status)}
                    <span className="font-mono text-sm text-blue-600">{selectedLog.eventType}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedLogId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">URL:</span>
                  <p className="font-medium break-all">{selectedLog.url}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status Code:</span>
                  <p className="font-medium">{selectedLog.responseStatusCode || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium">{formatDateTime(selectedLog.createdAt)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <p className="font-medium">{selectedLog.durationMs || 'N/A'}ms</p>
                </div>
                <div>
                  <span className="text-gray-500">Attempt:</span>
                  <p className="font-medium">{selectedLog.attemptNumber}</p>
                </div>
                <div>
                  <span className="text-gray-500">Completed:</span>
                  <p className="font-medium">
                    {selectedLog.completedAt
                      ? formatDateTime(selectedLog.completedAt)
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {selectedLog.errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-sm text-red-700">{selectedLog.errorMessage}</p>
                </div>
              )}

              {/* Request */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Request Payload</h4>
                <pre className="text-xs bg-gray-50 p-4 rounded border border-gray-200 overflow-auto">
                  {formatJson(selectedLog.requestPayload)}
                </pre>
              </div>

              {selectedLog.requestHeaders && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Request Headers</h4>
                  <pre className="text-xs bg-gray-50 p-4 rounded border border-gray-200 overflow-auto">
                    {formatJson(selectedLog.requestHeaders)}
                  </pre>
                </div>
              )}

              {/* Response */}
              {selectedLog.responseData && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Response Data</h4>
                  <pre className="text-xs bg-gray-50 p-4 rounded border border-gray-200 overflow-auto">
                    {formatJson(selectedLog.responseData)}
                  </pre>
                </div>
              )}

              {selectedLog.responseHeaders && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Response Headers</h4>
                  <pre className="text-xs bg-gray-50 p-4 rounded border border-gray-200 overflow-auto">
                    {formatJson(selectedLog.responseHeaders)}
                  </pre>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedLogId(null);
                }}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
