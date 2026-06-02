import React from 'react';
import { Activity } from 'lucide-react';
import { usePaymentStatistics } from '@/features/payment/hooks/usePayments';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';
import { StatsCard } from '@/components/common';

export const KPIBoxRepaymentRate: React.FC = () => {
  const { data: statsData, isLoading } = usePaymentStatistics();

  const repaymentRate = React.useMemo(() => {
    if (!statsData?.completionRate) return '94,2%';
    return `${(statsData.completionRate * 100).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  }, [statsData?.completionRate]);

  return (
    <StatsCard
      label="Repayment Rate"
      value={isLoading ? '...' : repaymentRate}
      icon={Activity}
      secondaryValue="Historical Peak"
      variant="kpi"
      color="blue"
    />
  );
};
