import React from 'react';
import { Filter } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { StatusFilter } from '@/components/StatusFilter';
import { MerchantStatus } from '@/types';

const MERCHANT_STATUS_OPTIONS = ['ALL', MerchantStatus.VERIFIED, MerchantStatus.PENDING, MerchantStatus.SUSPENDED] as const;

interface MerchantListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

export const MerchantListFilters: React.FC<MerchantListFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  searchPlaceholder = "Search by legal name, ID or sector...",
  className = ""
}) => {
  return (
    <div className={`p-4 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30 ${className}`}>
      <div className="relative lg:max-w-md w-full">
        <SearchInput 
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <StatusFilter 
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={[...MERCHANT_STATUS_OPTIONS]}
        />
        <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all">
          <Filter size={18} />
        </button>
      </div>
    </div>
  );
};