import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/common';
import SelectField from './SelectField';
import { useActiveMarketSegments } from '@/hooks/useMarketSegments';

interface RegionSelectionProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const RegionSelection: React.FC<RegionSelectionProps> = ({
  value,
  onChange,
  label = "Market Segment"
}) => {
  const { data: regions = [], isLoading, isError } = useActiveMarketSegments();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-2xs font-black text-gray-400 uppercase tracking-widest px-1">
          {label}
        </label>
        <div className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded flex items-center gap-3">
          <Spinner size="sm" variant="secondary" />
          <span className="text-sm text-gray-500">Loading segments...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-2">
        <label className="text-2xs font-black text-gray-400 uppercase tracking-widest px-1">
          {label}
        </label>
        <div className="w-full px-6 py-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-sm text-red-600">Failed to load market segments</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (regions.length === 0) {
    return (
      <div className="space-y-2">
        <label className="text-2xs font-black text-gray-400 uppercase tracking-widest px-1">
          {label}
        </label>
        <div className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded">
          <span className="text-sm text-gray-500">No market segments available</span>
        </div>
      </div>
    );
  }

  return (
    <SelectField
      label={label}
      value={value}
      onChange={onChange}
      options={regions}
    />
  );
};

export default RegionSelection;
