import React from 'react';
import { SearchIcon } from '@/components/icons';

interface FilterControlsProps {
  searchTerm: string;
  txFilter: 'ALL' | 'OUTBOUND' | 'INBOUND';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: 'ALL' | 'OUTBOUND' | 'INBOUND') => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  txFilter,
  onSearchChange,
  onFilterChange
}) => {
  return (
    <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/30">
      <div className="relative flex-1 w-full max-w-lg">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
        <input 
          type="text" 
          placeholder="Search settlement trace or merchant..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded text-xs font-bold outline-none focus:ring-4 focus:ring-red-50/50 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex bg-white p-1.5 rounded border border-gray-100 shadow-sm">
        {(['ALL', 'OUTBOUND', 'INBOUND'] as const).map(f => (
          <button 
            key={f}
            onClick={() => onFilterChange(f)}
            className={`px-6 py-2 rounded text-2xs font-black uppercase tracking-widest transition-all ${
              txFilter === f ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
};