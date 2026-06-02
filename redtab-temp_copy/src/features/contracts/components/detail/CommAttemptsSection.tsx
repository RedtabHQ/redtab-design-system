import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import CommAttemptsModal from '@/components/common/CommAttemptsModal';
import { useCommunicationsByRecipient } from '@/features/communication/hooks/useCommunication';
import { formatDateTime } from '@/utils/dateFormatter';

interface CommAttemptsSectionProps {
  merchantId: string;
  merchantName?: string;
}

export const CommAttemptsSection: React.FC<CommAttemptsSectionProps> = ({ merchantId, merchantName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: communications = [], isLoading } = useCommunicationsByRecipient(merchantId);

  return (
    <>
      <div
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:border-gray-300 transition-all"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
          <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <MessageSquare size={16} /> Comm Attempts
          </h3>
        </div>
        <div className="p-6 space-y-4 max-h-[250px] overflow-y-auto">
          {communications.length > 0 ? communications.map((comm) => (
            <div key={comm.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
              <div className="p-1.5 bg-white rounded-lg border border-gray-100 text-redtab">
                <Send size={12} />
              </div>
              <div>
                <p className="text-2xs font-black text-gray-900 uppercase">
                  {comm.channel} &bull; {comm.type || 'GENERAL'}
                </p>
                <p className="text-xs+ text-gray-500 mt-0.5 line-clamp-1 italic">
                  &ldquo;{comm.message}&rdquo;
                </p>
                <p className="text-3xs text-gray-400 mt-1">{formatDateTime(comm.createdAt)}</p>
              </div>
            </div>
          )) : (
            <p className="text-center text-gray-400 text-xs italic py-10">
              {isLoading ? 'Loading...' : 'No messages logged.'}
            </p>
          )}
        </div>
      </div>

      <CommAttemptsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        communications={communications}
        merchantName={merchantName}
      />
    </>
  );
};
