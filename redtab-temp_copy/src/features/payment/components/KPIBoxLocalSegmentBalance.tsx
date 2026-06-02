import React from 'react';
import { Globe } from 'lucide-react';
import { usePaymentStatistics } from '@/features/payment/hooks/usePayments';
import { useCurrency } from '@/hooks/useCurrency';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';
import { Amount } from '@/components/common/Amount';
import { Skeleton } from '@/components';

export const KPIBoxLocalSegmentBalance: React.FC = () => {
  const { data: statsData, isLoading } = usePaymentStatistics();
  const { currency } = useCurrency();

  return (
    <div className="bg-gray-900 p-8 rounded-xl text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
        <Globe size={80} />
      </div>
      <p className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">
        Local Segment Balance
      </p>
      {isLoading ? (
        <Skeleton variant="text" />
      ) : (
        <Amount pretty mainClassName="text-3xl text-white font-black relative z-10" value={statsData?.totalAmount || 0} currency={currency} showUSD />
      )}
      <div className="flex items-center gap-2 mt-4 relative z-10">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <p className="text-3xs text-green-400 font-bold uppercase tracking-widest">Rail Integrity Confirmed</p>
      </div>
    </div>
  );
};
