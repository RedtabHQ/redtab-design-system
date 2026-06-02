import React from 'react';
import { TrendingUp } from 'lucide-react';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';

interface LifecycleMultipliersProps {
  multipliers: Record<string, number>;
}

export const LifecycleMultipliers: React.FC<LifecycleMultipliersProps> = ({ multipliers }) => {
  return (
    <div className="bg-gray-900 p-8 rounded-xl text-white shadow-2xl space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="text-redtab" size={24} />
        <h3 className="font-bold">Lifecycle Multipliers</h3>
      </div>
      <div className="space-y-4">
        {Object.entries(multipliers).map(([key, val]: [string, any]) => (
          <div key={key} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-2xs font-black uppercase tracking-widest text-gray-400">{key.replace('_', ' ')}</span>
            <span className="text-sm font-black text-redtab">x{val.toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
