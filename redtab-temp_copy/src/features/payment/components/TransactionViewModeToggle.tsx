import React from 'react';
import { Grid2x2, LayoutList } from 'lucide-react';

type TransactionViewMode = 'table' | 'cards';

interface TransactionViewModeToggleProps {
  viewMode: TransactionViewMode;
  onViewModeChange: (mode: TransactionViewMode) => void;
}

const TransactionViewModeToggle: React.FC<TransactionViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex bg-white gap-1 p-1.5 rounded border border-gray-100 shadow-sm">
      <button
        onClick={() => onViewModeChange('table')}
        className={`px-4 py-2 rounded text-2xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
          viewMode === 'table' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
        }`}
      >
        <LayoutList size={14} />
        Table
      </button>
      <button
        onClick={() => onViewModeChange('cards')}
        className={`px-4 py-2 rounded text-2xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
          viewMode === 'cards' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
        }`}
      >
        <Grid2x2 size={14} />
        Cards
      </button>
    </div>
  );
};

export default TransactionViewModeToggle;
