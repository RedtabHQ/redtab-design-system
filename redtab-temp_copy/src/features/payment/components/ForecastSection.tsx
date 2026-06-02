import React from 'react';
import { IntelligenceSidebar } from '@/components';
import { Transaction } from '@/types';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useForecastContext } from '@/contexts/ForecastContext';

interface ForecastSectionProps {
  transactions: Transaction[];
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ transactions }) => {
  const { selectedSegment, segmentId } = useMarketSegment();
  const { symbol: currencySymbol } = useCurrency();
  const { isForecastMode, isForecasting, aiForecast, handleRunForecast } = useForecastContext();

  const handleRunForecastWithSegment = () => {
    handleRunForecast(transactions, segmentId);
  };

  return (
    <IntelligenceSidebar
      isForecastMode={isForecastMode}
      isForecasting={isForecasting}
      aiForecast={aiForecast}
      onRunForecast={handleRunForecastWithSegment}
      currencySymbol={currencySymbol}
      activeSegment={selectedSegment}
    />
  );
};

export default ForecastSection;
