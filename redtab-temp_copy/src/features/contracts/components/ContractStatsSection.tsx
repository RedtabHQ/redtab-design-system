import React from 'react';
import { useTranslation } from 'react-i18next';
import { StatsCard } from '@/components/common';
import { useContractKpiAggregation } from '../hooks/useContracts';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useCurrency } from '@/hooks/useCurrency';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';

interface ContractStatsSectionProps {
  searchTerm?: string;
  statusFilter?: 'ACTIVE' | 'OVERDUE' | 'PAID' | 'WRITTEN_OFF';
}

const ContractStatsSection: React.FC<ContractStatsSectionProps> = ({
  searchTerm,
  statusFilter,
}) => {
  const { t } = useTranslation('contracts');
  const { selectedSegment } = useMarketSegment();
  const { symbol: currencySymbol } = useCurrency();

  const {
    data: contractKpi,
    isLoading: isKpiLoading,
  } = useContractKpiAggregation({
    marketSegmentId: selectedSegment?.id,
    search: searchTerm || undefined,
    status: statusFilter || undefined,
  });

  const normalizePercent = (value?: number | null) => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return null;
    }
    const percent = value <= 1 ? value * 100 : value;
    return percent;
  };

  const totalDisbursed = contractKpi?.totalDisbursed;
  const formatBookValue = (amount?: number) =>
    typeof amount === 'number'
      ? `${(amount / 1000).toLocaleString(DEFAULT_CURRENCY_LOCALE, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}k`
      : undefined;

  const formattedBookValue = formatBookValue(totalDisbursed) ?? (isKpiLoading ? '...' : '--');
  const segmentRecoveryPercent = normalizePercent(contractKpi?.recoveryProgress);
  const formattedSegmentRecovery = segmentRecoveryPercent != null
    ? `${segmentRecoveryPercent.toFixed(1)}%`
    : isKpiLoading
      ? '...'
      : '--';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        label={t('segmentRecovery')}
        value={formattedSegmentRecovery}
        progress={segmentRecoveryPercent ?? undefined}
      />
      <StatsCard
        label={t('totalBookValue')}
        value={`${currencySymbol} ${formattedBookValue}`}
      />
    </div>
  );
};

export default ContractStatsSection;
