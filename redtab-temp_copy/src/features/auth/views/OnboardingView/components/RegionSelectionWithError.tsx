/**
 * RegionSelection wrapper with error handling
 */

import { AlertCircle } from 'lucide-react';
import RegionSelection from '@/features/admin/components/RegionSelection';

interface RegionSelectionWithErrorProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export const RegionSelectionWithError = ({ value, onChange, error }: RegionSelectionWithErrorProps) => (
  <div className="space-y-2">
    <label className="text-2xs font-black text-gray-400 uppercase tracking-widest px-1">Region</label>
    <RegionSelection value={value} onChange={onChange} />
    {error && (
      <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
        <AlertCircle size={12} />
        <span>{error}</span>
      </div>
    )}
  </div>
);
