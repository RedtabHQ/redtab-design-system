import React from 'react';
import { FXBridgeItem } from '@/features/contracts/components/FXBridgeItem';
import { MarketSegment } from '@/types';
import { useExchangeRateContext } from '@/contexts/ExchangeRateContext';

interface FXBridgeListProps {
  segments: MarketSegment[];
}

export const FXBridgeList: React.FC<FXBridgeListProps> = ({
  segments,
}) => {
  if (segments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-medium">No active market segments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {segments.map(region => (
        <FXBridgeItem
          key={region.id}
          region={region}
        />
      ))}
    </div>
  );
};
