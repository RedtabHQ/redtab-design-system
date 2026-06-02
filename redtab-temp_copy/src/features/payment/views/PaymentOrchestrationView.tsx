import React, { useState, useMemo, useCallback } from 'react';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useForecastContext } from '@/contexts/ForecastContext';
import {
  ErrorDisplay,
  TransactionSection,
  ChartDataSection,
  KPIBoxSegmentOutbound,
  KPIBoxSegmentInbound,
  KPIBoxRepaymentRate,
  KPIBoxLocalSegmentBalance,
  TransactionViewModeToggle,
} from '@/features/payment/components';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Banknote, CloudSun, RotateCcw } from 'lucide-react';
import TransactionBoxSection from '@/features/payment/components/TransactionBoxSection';
import ForecastSection from '@/features/payment/components/ForecastSection';
import { Transaction, type TransactionFilterType } from '@/types';

type TransactionViewMode = 'table' | 'cards';

const PaymentOrchestrationView: React.FC = () => {
  const { selectedSegment, segmentId } = useMarketSegment();
  const { isForecastMode, isForecasting, handleRunForecast } = useForecastContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [kpiTxFilter, setKpiTxFilter] = useState<TransactionFilterType>('ALL');
  const [viewMode, setViewMode] = useState<TransactionViewMode>('table');
  const [transactionsError, setTransactionsError] = useState<{ message?: string } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txFilter, setTxFilter] = useState<TransactionFilterType>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleTransactionError = useMemo(
    () => (error: { message?: string } | null) => setTransactionsError(error),
    []
  );

  const handleRunForecastWithSegment = useCallback(
    () => {
      handleRunForecast(transactions, segmentId);
    },
    [transactions, segmentId, handleRunForecast]
  );

  const title = selectedSegment
    ? `${selectedSegment.name} Liquidity Cockpit`
    : 'Global Treasury Orchestrator';

  return (
    <div className="mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header Cockpit */}
      <PageHeader
        title={title}
        subtitle="Real-time movement and predictive working capital management."
        icon={<Banknote className="text-redtab" size={32} strokeWidth={2.5} />}
        actions={
          <Button
            variant={isForecastMode ? "secondary" : "primary"}
            onClick={handleRunForecastWithSegment}
            disabled={isForecasting}
            className="flex items-center uppercase gap-3 font-black tracking-widest transition-all shadow-xl"
          >
            {isForecasting ? <RotateCcw size={16} className="animate-spin" /> : <CloudSun size={18} />}
            {isForecastMode ? 'Regenerate Strategy' : 'Predictive Outlook'}
          </Button>
        }
      />

      {/* Error States */}
      <ErrorDisplay error={transactionsError} />

      {/* KPI Layer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPIBoxSegmentOutbound  />
        <KPIBoxSegmentInbound />
        <KPIBoxRepaymentRate />
        <KPIBoxLocalSegmentBalance />
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Column */}
        <div className="lg:col-span-8 space-y-8">
          <ChartDataSection isForecastMode={isForecastMode} />
        </div>

        {/* Treasury Sidebar Column */}
        <div className="lg:col-span-4">
          <ForecastSection transactions={transactions} />
        </div>
      </div>

      <div className="grid bg-white grid-cols-1 gap-8">
        {/* Transaction View Toggle */}
        <div className="flex justify-end">
          <TransactionViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {/* Conditional Transaction View */}
        {viewMode === 'table' ? (
          <TransactionSection />
        ) : (
          <TransactionBoxSection />
        )}
      </div>
    </div>
  );
};

export default PaymentOrchestrationView;
