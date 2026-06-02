import React, { useMemo } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import type { MarketSegment } from '@/types';
import { useCurrencyByCode } from '@/hooks/useCurrency';
import { Skeleton } from '@/components';

interface FXBridgeItemProps {
  region: Pick<MarketSegment, 'id' | 'name' | 'currency' | 'currencySymbol' | 'updatedAt'>;
}

export const FXBridgeItem: React.FC<FXBridgeItemProps> = ({ region }) => {
  const relativeUpdatedAt = useMemo(() => {
    if (!region.updatedAt) return 'No sync recorded';
    try {
      return formatDistanceToNowStrict(new Date(region.updatedAt), { addSuffix: true });
    } catch {
      return 'No sync recorded';
    }
  }, [region.updatedAt]);

  const currencyData = useCurrencyByCode(region.currency);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 bg-gray-50/50 rounded border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-redtab text-white rounded flex items-center justify-center font-black text-gray-900 shadow-sm">
          {region.currency}
        </div>
        <div>
          <p className="text-2xs font-black text-gray-400 uppercase tracking-widest leading-none">Market Provider</p>
          <p className="text-lg font-black text-gray-900 mt-1">{region.name} ({region.currency})</p>
          <p className="text-xs+ font-semibold text-gray-500 mt-2" title={region.updatedAt ?? 'No historical data'}>
            Last rate update <span className="text-gray-800">{relativeUpdatedAt}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          {currencyData.isFetching ? (
            <Skeleton variant="text" />
          ) : (
            <input
              type="number"
              step="0.01"
              readOnly
              value={currencyData.data?.exchangeRate}
              className="pl-4 pr-14 py-3 bg-white border border-gray-100 rounded text-sm font-black outline-none focus:ring-1 focus:ring-redtab w-42 shadow-inner"
            />
          )}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xs font-black text-gray-400">{region.currency}/USD</span>
        </div>
      </div>
    </div>
  );
};
