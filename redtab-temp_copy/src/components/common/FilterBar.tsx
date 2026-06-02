import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

const FilterBarRoot: React.FC<FilterBarProps> = ({ children, className }) => (
  <div className={cn('flex items-center gap-3 flex-wrap', className)}>{children}</div>
);

const FilterSearch: React.FC<{
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}> = ({ placeholder = 'Search...', value, onChange, className }) => (
  <div className={cn('relative flex-1 min-w-[200px]', className)}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const FilterStatus: React.FC<{
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ options, value, onChange, placeholder = 'All statuses', className }) => (
  <select
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      'px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
      className
    )}
  >
    <option value="">{placeholder}</option>
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

const FilterCustom: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const FilterBar = Object.assign(FilterBarRoot, {
  Search: FilterSearch,
  Status: FilterStatus,
  Custom: FilterCustom,
});
