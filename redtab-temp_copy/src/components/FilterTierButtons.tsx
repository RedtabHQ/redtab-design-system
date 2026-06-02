import React from 'react';
import { CreditTier } from '@/types';

interface FilterTierButtonsProps {
  filterTier: 'ALL' | 'T1' | 'T2' | 'T3' | 'NONE';
  onTierChange: (tier: 'ALL' | 'T1' | 'T2' | 'T3' | 'NONE') => void;
}

const FilterTierButtons: React.FC<FilterTierButtonsProps> = ({ filterTier, onTierChange }) => {
  return (
    <div className="flex bg-gray-100/50 p-1.5 rounded-lg border border-gray-100 w-full md:w-auto overflow-x-auto">
      {(['ALL', CreditTier.T1, CreditTier.T2, CreditTier.T3, 'NONE'] as const).map(t => (
        <button
          key={t}
          onClick={() => onTierChange(t as 'ALL' | 'T1' | 'T2' | 'T3' | 'NONE')}
          className={`px-5 py-2.5 rounded-md text-2xs font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${
            filterTier === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

export default FilterTierButtons;