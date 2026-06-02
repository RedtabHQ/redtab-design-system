import React from 'react';
import { Search } from 'lucide-react';
import { StatusFilter } from '@/components/StatusFilter';

interface ContractFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  placeholder?: string;
}

export const ContractFilters: React.FC<ContractFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  placeholder = 'Search segment agreements...'
}) => {
  return (
    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-redtab shadow-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <StatusFilter
        value={statusFilter}
        onChange={onStatusFilterChange}
        options={['ALL', 'ACTIVE', 'OVERDUE', 'PAID', 'WRITTEN_OFF']}
        className="ml-4"
      />
    </div>
  );
};