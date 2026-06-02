import React, { lazy, Suspense } from 'react';
import { X } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { Spinner } from '@/components/common';

const DateTimePickerField = lazy(() => import('@/components/common/DateTimePickerField'));

interface AuditLogFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  category?: string;
  onCategoryChange: (value: string | undefined) => void;
  status?: string;
  onStatusChange: (value: string | undefined) => void;
  traits?: string;
  onTraitsChange: (value: string | undefined) => void;
  startDate?: string;
  onStartDateChange: (value: string | undefined) => void;
  endDate?: string;
  onEndDateChange: (value: string | undefined) => void;
  action?: string;
  onActionChange: (value: string | undefined) => void;
}

const CATEGORIES = [
  { value: 'RISK', label: 'Risk' },
  { value: 'FINANCIAL', label: 'Financial' },
  { value: 'KYC', label: 'KYC' },
  { value: 'SYSTEM', label: 'System' },
];

const STATUSES = [
  { value: 'SUCCESS', label: 'Success' },
  { value: 'FAILURE', label: 'Failure' },
];

const ACTIONS = [
  { value: 'CREATE', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
  { value: 'VIEW', label: 'View' },
  { value: 'APPROVE', label: 'Approve' },
  { value: 'REJECT', label: 'Reject' },
];

const SELECT_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 0.5rem center',
  backgroundSize: '1.25em 1.25em',
  paddingRight: '1.75rem',
};

const SelectFilter: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
}> = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-2xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="w-full px-3 py-2 bg-white border border-gray-100 rounded text-xs font-bold text-gray-900 outline-none focus:ring-1 focus:ring-redtab transition-all shadow-sm appearance-none cursor-pointer"
      style={SELECT_STYLE}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  traits,
  onTraitsChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  action,
  onActionChange,
}) => {
  return (
    <div className="space-y-4 p-4 border-b border-gray-50 bg-gray-50/20">
      {/* Search Bar */}
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search audit traces..."
      />

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <SelectFilter
          label="Category"
          value={category}
          onChange={onCategoryChange}
          options={CATEGORIES}
          placeholder="All Categories"
        />
        <SelectFilter
          label="Status"
          value={status}
          onChange={onStatusChange}
          options={STATUSES}
          placeholder="All Statuses"
        />
        <SelectFilter
          label="Action"
          value={action}
          onChange={onActionChange}
          options={ACTIONS}
          placeholder="All Actions"
        />

        {/* Traits Filter */}
        <div>
          <label className="block text-2xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
            Traits
          </label>
          <input
            type="text"
            value={traits || ''}
            onChange={(e) => onTraitsChange(e.target.value || undefined)}
            placeholder="Filter by traits"
            className="w-full px-3 py-2 bg-white border border-gray-100 rounded text-xs font-bold text-gray-900 outline-none focus:ring-1 focus:ring-redtab transition-all shadow-sm"
          />
        </div>

        {/* Start Date Filter */}
        <Suspense fallback={
          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
            <Spinner size="sm" variant="secondary" />
          </div>
        }>
          <DateTimePickerField
            label="From"
            value={startDate}
            onChange={onStartDateChange}
            dateFormat="yyyy-MM-dd"
            variant="compact"
          />
        </Suspense>

        {/* End Date Filter */}
        <Suspense fallback={
          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
            <Spinner size="sm" variant="secondary" />
          </div>
        }>
          <DateTimePickerField
            label="To"
            value={endDate}
            onChange={onEndDateChange}
            dateFormat="yyyy-MM-dd"
            variant="compact"
          />
        </Suspense>
      </div>

      {/* Active Filters Display & Clear Buttons */}
      {(category || status || action || traits || startDate || endDate) && (
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
          <span className="text-2xs font-black text-gray-400 uppercase tracking-widest">Active filters:</span>
          <div className="flex gap-2 flex-wrap">
            {category && (
              <button
                onClick={() => onCategoryChange(undefined)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 border border-indigo-200 rounded text-2xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                Category: {category}
                <X size={12} />
              </button>
            )}
            {status && (
              <button
                onClick={() => onStatusChange(undefined)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-2xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Status: {status}
                <X size={12} />
              </button>
            )}
            {action && (
              <button
                onClick={() => onActionChange(undefined)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded text-2xs font-bold text-green-700 hover:bg-green-100 transition-colors"
              >
                Action: {action}
                <X size={12} />
              </button>
            )}
            {traits && (
              <button
                onClick={() => onTraitsChange(undefined)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 border border-rose-200 rounded text-2xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                Traits: {traits}
                <X size={12} />
              </button>
            )}
            {startDate && (
              <button
                onClick={() => onStartDateChange(undefined)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 border border-purple-200 rounded text-2xs font-bold text-purple-700 hover:bg-purple-100 transition-colors"
              >
                From: {startDate}
                <X size={12} />
              </button>
            )}
            {endDate && (
              <button
                onClick={() => onEndDateChange(undefined)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded text-2xs font-bold text-orange-700 hover:bg-orange-100 transition-colors"
              >
                To: {endDate}
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
