import React from 'react';
import { SettlementMode } from '@/types';

interface SettlementModeSelectorProps {
  value: SettlementMode;
  onChange: (mode: SettlementMode) => void;
}

const SettlementModeSelector: React.FC<SettlementModeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <label className="text-2xs font-black text-gray-400 uppercase tracking-widest px-1">Settlement Mode</label>
      <div className="grid grid-cols-3 gap-3">
        {Object.values(SettlementMode).map(mode => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`py-4 rounded-2xl text-2xs font-black uppercase tracking-tight border transition-all ${
              value === mode
                ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'
            }`}
          >
            {mode.replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettlementModeSelector;