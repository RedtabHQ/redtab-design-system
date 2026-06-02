import React from 'react';

type RailsViewMode = 'ledger' | 'routing';

interface RailsViewModeToggleProps {
  viewMode: RailsViewMode;
  onViewModeChange: (mode: RailsViewMode) => void;
  activeSegmentCurrency: string;
}

export const RailsViewModeToggle: React.FC<RailsViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  activeSegmentCurrency,
}) => {
  return (
    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewModeChange('ledger')}
          className={`px-4 py-2 rounded-lg text-2xs font-black uppercase tracking-widest transition-all ${
            viewMode === 'ledger' ? 'bg-gray-900 text-white' : 'text-gray-400'
          }`}
        >
          Ledger
        </button>
        <button
          onClick={() => onViewModeChange('routing')}
          className={`px-4 py-2 rounded-lg text-2xs font-black uppercase tracking-widest transition-all ${
            viewMode === 'routing' ? 'bg-gray-900 text-white' : 'text-gray-400'
          }`}
        >
          Routing Strategy
        </button>
      </div>
      <p className="text-2xs font-black text-gray-400 uppercase tracking-widest">
        Active Segment: {activeSegmentCurrency}
      </p>
    </div>
  );
};

