import React from 'react';
import { RegionCard } from '@/features/contracts/components/RegionCard';
import { MarketSegment, MarketSegmentStatus } from '@/types';

interface RegionCardGridProps {
  segments: MarketSegment[];
  getActiveVolume: (currency: string) => number;
  onToggle: (id: string, updates: { status: MarketSegmentStatus }) => void;
}

export const RegionCardGrid: React.FC<RegionCardGridProps> = ({
  segments,
  getActiveVolume,
  onToggle,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {segments.map(region => (
        <RegionCard
          key={region.id}
          region={region}
          volume={getActiveVolume(region.currency)}
          onToggle={(id, updates) => {
            onToggle(id, updates);
          }}
        />
      ))}
    </div>
  );
};
