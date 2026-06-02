import React, { useEffect, useCallback } from 'react';
import { Wallet } from 'lucide-react';
import { RailStatus, type SettlementRail } from '@/types';
import { useFilteredSettlementRails, type SettlementRailsFilterParams } from '../hooks/useSettlement';

export interface RailSelectorGridProps {
  selectedChannelId: string | null;
  onChannelSelect: (channelId: string | null) => void;
  filterParams: SettlementRailsFilterParams;
}

/**
 * Grid component for selecting settlement rails/channels
 * Displays available rails with status indicators and auto-selects first rail
 */
export const RailSelectorGrid: React.FC<RailSelectorGridProps> = ({
  selectedChannelId,
  onChannelSelect,
  filterParams,
}) => {
  // Fetch filtered rails
  const { data: railsResponse } = useFilteredSettlementRails(filterParams);
  const regionalRails = railsResponse?.items || [];

  // Auto-select first rail if not selected
  useEffect(() => {
    if (regionalRails.length > 0 && !selectedChannelId) {
      onChannelSelect(regionalRails[0].id);
    }
  }, [regionalRails, selectedChannelId, onChannelSelect]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {regionalRails.map((channel: SettlementRail) => (
        <button
          key={channel.id}
          onClick={() => onChannelSelect(channel.id)}
          className={`p-6 rounded-lg border text-left transition-all h-36 flex flex-col justify-between ${
            selectedChannelId === channel.id
              ? 'bg-white border-redtab shadow-xl ring-1 ring-redtab/10'
              : 'bg-white border-gray-100 opacity-60'
          }`}
        >
          <div className="flex justify-between items-start">
            <div
              className={`p-2 rounded-xl ${
                selectedChannelId === channel.id
                  ? 'bg-red-50 text-redtab'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              <Wallet size={24} />
            </div>
            <div
              className={`w-2 h-2 rounded-full ${
                channel.status === RailStatus.ACTIVE
                  ? 'bg-green-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            />
          </div>
          <div>
            <h4 className="font-black text-sm">{channel.railName}</h4>
            <p className="text-3xs font-black text-gray-400 uppercase tracking-widest">
              {channel.avgProcessingTimeMs}ms latency
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};
