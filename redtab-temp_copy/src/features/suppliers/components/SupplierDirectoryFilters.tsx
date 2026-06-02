import React from 'react';
import { Globe } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';

interface SupplierDirectoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isGlobal?: boolean;
  className?: string;
}

export const SupplierDirectoryFilters: React.FC<SupplierDirectoryFiltersProps> = ({
  searchTerm,
  onSearchChange,
  isGlobal = false,
  className = "",
}) => {
  return (
    <div className={`p-4 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30 ${className}`}>
      <div className="relative lg:max-w-md w-full">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search by legal name or category..."
        />
      </div>
      {isGlobal && (
        <span className="flex items-center gap-2 text-2xs font-black text-gray-400 uppercase tracking-widest bg-white px-4 py-1.5 rounded-xl border border-gray-100">
          <Globe size={14} /> HQ Visibility
        </span>
      )}
    </div>
  );
};
