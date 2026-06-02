import React from 'react';
import { Flag } from 'lucide-react';
import { MarketSegment, MarketSegmentStatus } from '@/types';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';
import { useCurrencyByCode } from '@/hooks/useCurrency';

interface RegionCardProps {
  region: MarketSegment;
  volume: number;
  onToggle: (id: string, updates: { status: MarketSegmentStatus }) => void;
}

export const RegionCard: React.FC<RegionCardProps> = ({ region, volume, onToggle }) => {
  const { data: currencyDetail } = useCurrencyByCode(region.currency);
  const exchangeRate = currencyDetail?.exchangeRate ?? 1;

  return (
    <div className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all ${region.status !== 'ACTIVE' && 'opacity-50 grayscale'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-xl">
            <Flag size={20} className="text-gray-900" />
          </div>
          <div>
            <h4 className="font-black text-gray-900 leading-none">{region.name}</h4>
            <p className="text-2xs text-gray-400 font-black uppercase mt-1 tracking-widest">{region.currency}</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={region.status === MarketSegmentStatus.ACTIVE}
          onChange={() =>
            onToggle(region.id, {
              status:
                region.status === MarketSegmentStatus.ACTIVE
                  ? MarketSegmentStatus.INACTIVE
                  : MarketSegmentStatus.ACTIVE,
            })
          }
          className="w-5 h-5 rounded accent-redtab cursor-pointer"
        />
      </div>
      
      <div className="space-y-4 pt-4 border-t border-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-2xs font-black text-gray-400 uppercase">FX Rate (1 USD)</span>
          <span className="text-sm font-black text-gray-900">{region.currencySymbol} {exchangeRate.toLocaleString(DEFAULT_CURRENCY_LOCALE)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xs font-black text-gray-400 uppercase">Regional Volume</span>
          <span className="text-sm font-black text-redtab">{region.currencySymbol} {(volume / 1000).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k</span>
        </div>
      </div>
    </div>
  );
};
