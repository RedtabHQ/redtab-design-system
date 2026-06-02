import React, { useState } from 'react';
import { History, CheckCircle2 } from 'lucide-react';
import LifecycleEventsModal from '@/components/common/LifecycleEventsModal';
import { TimelineItem } from './TimelineItem';
import { useContractLifecycleEvents } from '../../hooks/useContracts';
import { formatAmountsInText } from '@/utils/currencyFormatter';
import { formatDateTime } from '@/utils/dateFormatter';
import type { Contract } from '@/types';

interface LifecycleEventsSectionProps {
  contract: Contract;
}

export const LifecycleEventsSection: React.FC<LifecycleEventsSectionProps> = ({ contract }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contractId = contract.id;

  const { data, isLoading } = useContractLifecycleEvents(contractId, {
    page: 1,
    pageSize: 3,
    sortBy: 'eventDate',
    sortOrder: 'desc',
  });

  const previewEvents = data?.items ?? [];

  return (
    <>
      <div
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:border-gray-300 transition-all"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <History size={16} /> Lifecycle Events
          </h3>
        </div>
        <div className="p-8 space-y-6">
          {isLoading ? (
            <div className="text-center text-sm text-gray-400 italic">Loading...</div>
          ) : previewEvents.length === 0 ? (
            <div className="text-center text-sm text-gray-500 italic">
              No lifecycle events recorded for this contract.
            </div>
          ) : (
            previewEvents.map((event) => (
              <TimelineItem
                key={event.id}
                title={event.title}
                subtitle={formatAmountsInText(event.subtitle)}
                date={formatDateTime(event.eventDate) || '-'}
                icon={event.active ? CheckCircle2 : History}
                active={event.active ?? false}
              />
            ))
          )}
        </div>
      </div>

      <LifecycleEventsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contractId={contractId}
      />
    </>
  );
};
