import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';
import { Card } from '@/components/common';
import type { Supplier } from '@/types';
import { formatCurrency } from '@/utils/currencyFormatter';
import {
  DEFAULT_GLOBAL_CURRENCY,
  DEFAULT_GLOBAL_CURRENCY_SYMBOL,
  getCurrencySymbol,
} from '@/constants/currency';
import { useSupplierPaymentStats } from '@/features/payment/hooks/usePayments';
import { Amount } from '@/components/common/Amount';
import { useCurrencyByCode } from '@/hooks/useCurrency';

type VolumeCardProps = {
  supplier: Supplier;
};

export const VolumeCard: React.FC<VolumeCardProps> = ({ supplier }) => {
  const supplierId = supplier.id;

  // Self-fetch stats data
  const { data: stats } = useSupplierPaymentStats(
    supplierId,
    { paymentType: 'SUPPLIER_SETTLEMENT' },
  );
  // Default to 0 when stats unavailable (initial load or error state)
  const totalVolume = stats?.totalVolume ?? 0;

  return (
    <Card variant="surface" className="space-y-4">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <TrendingUp size={16} /> Total Payout Volume
      </h3>

      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <Amount 
            value={totalVolume}
            currency={supplier.marketSegment?.currency}
            showUSD 
            mainClassName="text-3xl font-black text-gray-900"
            subClassName="text-xs text-gray-400 font-medium mt-0.5"
          />
          <p className="text-xs text-gray-400 font-medium">Total Redtab Payouts</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2 text-2xs font-bold text-green-600">
        <Activity size={12} /> Market Activity Signal
      </div>
    </Card>
  );
};
