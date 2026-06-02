import React from 'react';
import { TrendingDown } from 'lucide-react';
import { useTransactionKPIs } from '@/hooks/useTransactions';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrencyAbbreviated } from '@/utils/currencyFormatter';
import { type TransactionFilterType } from '@/types';
import { StatsCard } from '@/components/common';
import { useSegmentKPIFilters } from '@/features/payment/hooks/useSegmentKPIFilters';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';

interface KPIBoxSegmentOutboundProps {
}

export const KPIBoxSegmentOutbound: React.FC<KPIBoxSegmentOutboundProps> = (props) => {
  const { symbol: currencySymbol, currency } = useCurrency();
  const { segmentId } = useMarketSegment();

  const { data: kpiData, isLoading } = useTransactionKPIs({
    marketSegmentId: segmentId
  });

  return (
    <StatsCard
      label="Segment Outbound"
      value={isLoading ? '...' : formatCurrencyAbbreviated(kpiData?.outbound ?? 0, currency, currencySymbol)}
      icon={TrendingDown}
      secondaryValue="Disbursement Load"
      variant="kpi"
      color="red"
    />
  );
};
