import React, { useState } from 'react';
import { X, History } from 'lucide-react';
import { Pagination } from '@/components/common/Pagination';
import { useContractLifecycleEvents } from '@/features/contracts/hooks/useContracts';
import { formatDateTime } from '@/utils/dateFormatter';
import { formatAmountsInText } from '@/utils/currencyFormatter';

interface LifecycleEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
}

const LifecycleEventsModal: React.FC<LifecycleEventsModalProps> = ({
  isOpen,
  onClose,
  contractId,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useContractLifecycleEvents(contractId, {
    page,
    pageSize,
    sortBy: 'eventDate',
    sortOrder: 'desc',
  });

  const events = data?.items ?? [];
  const meta = data?.meta ?? { page: 1, pageSize: 10, total: 0, totalPages: 0 };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900/10 text-gray-900 rounded-xl">
              <History size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                Lifecycle Events
              </h3>
              <p className="text-2xs font-bold text-gray-400 uppercase mt-0.5">
                Contract {contractId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 cursor-pointer text-gray-400 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <p className="text-sm text-gray-400 italic">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`p-5 rounded border transition-all ${
                    event.active
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        event.active
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      <History size={16} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">
                        {event.title}
                      </h4>
                      <p className="text-xs+ text-gray-600 mt-1">{formatAmountsInText(event.subtitle)}</p>
                      <p className="text-3xs text-gray-400 mt-2 uppercase tracking-wider">
                        {formatDateTime(event.eventDate)}
                      </p>
                    </div>
                    {event.active && (
                      <div className="flex items-center gap-1 text-green-700">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-3xs font-bold uppercase">Active</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="p-4 bg-gray-100 text-gray-400 rounded-full mb-4">
                <History size={48} />
              </div>
              <p className="text-sm font-bold text-gray-900 mb-2">No Lifecycle Events</p>
              <p className="text-xs text-gray-400 max-w-md">
                There are no lifecycle events recorded for this contract yet.
              </p>
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        <div className="border-t border-gray-100 p-6">
          {meta.total > 0 ? (
            <Pagination
              meta={meta}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
              pageSizeOptions={[5, 10, 20]}
              itemsTitle="events"
            />
          ) : (
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 cursor-pointer py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifecycleEventsModal;
