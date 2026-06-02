import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useTransactionKPIs } from '@/hooks/useTransactions';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrencyAbbreviated } from '@/utils/currencyFormatter';
import { type TransactionFilterType } from '@/types';
import { StatsCard } from '@/components/common';
import { useSegmentKPIFilters } from '@/features/payment/hooks/useSegmentKPIFilters';

interface KPIBoxSegmentInboundProps {
  searchTerm?: string;
  txFilter?: TransactionFilterType;
}

export const KPIBoxSegmentInbound: React.FC<KPIBoxSegmentInboundProps> = ({
  searchTerm = '',
  txFilter = 'ALL'
}) => {
  const { symbol: currencySymbol, currency } = useCurrency();
  const kpiFilters = useSegmentKPIFilters(searchTerm);

  // Only show inbound when not filtering for OUTBOUND only
  const shouldShow = txFilter !== 'OUTBOUND';

  const { data: kpiData, isLoading } = useTransactionKPIs(kpiFilters, {
    enabled: shouldShow,
  });

  return (
    <StatsCard
      label="Segment Inbound"
      value={isLoading ? '...' : formatCurrencyAbbreviated(kpiData?.inbound ?? 0, currency, currencySymbol)}
      icon={TrendingUp}
      secondaryValue="Recovery Velocity"
      variant="kpi"
      color="green"
    />
  );
};
