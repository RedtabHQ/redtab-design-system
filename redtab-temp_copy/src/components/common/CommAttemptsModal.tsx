import React from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import type { Communication } from '@/types';
import { formatDateTime } from '@/utils/dateFormatter';

interface CommAttemptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  communications: Communication[];
  merchantName?: string;
}

const statusColors: Record<string, string> = {
  SENT: 'bg-blue-50 text-blue-700 border-blue-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const CommAttemptsModal: React.FC<CommAttemptsModalProps> = ({
  isOpen,
  onClose,
  communications,
  merchantName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900/10 text-gray-900 rounded-xl">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                Communication Attempts
              </h3>
              <p className="text-2xs font-bold text-gray-400 uppercase mt-0.5">
                {merchantName ? `Merchant: ${merchantName}` : 'All Communications'}
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
          {communications.length > 0 ? (
            <div className="space-y-4">
              {communications.map((comm) => (
                <div
                  key={comm.id}
                  className="p-5 rounded-2xl border border-gray-200 bg-gray-50 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white border border-gray-100 text-redtab">
                      <Send size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">
                          {comm.channel} &bull; {comm.type || 'GENERAL'}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-lg text-3xs font-bold uppercase border ${statusColors[comm.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {comm.status}
                        </span>
                      </div>
                      <p className="text-xs+ text-gray-600 mt-2 italic leading-relaxed">
                        &ldquo;{comm.message}&rdquo;
                      </p>
                      <p className="text-3xs text-gray-400 mt-2 uppercase tracking-wider">
                        {formatDateTime(comm.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center">
              <div className="p-4 bg-gray-100 text-gray-400 rounded-full mb-4">
                <MessageSquare size={48} />
              </div>
              <p className="text-sm font-bold text-gray-900 mb-2">No Communications</p>
              <p className="text-xs text-gray-400 max-w-md">
                There are no communication attempts recorded yet.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 cursor-pointer py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommAttemptsModal;
