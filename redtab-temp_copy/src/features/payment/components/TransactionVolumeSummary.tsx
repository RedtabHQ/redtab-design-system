import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/common';
import { Amount } from '@/components/common/Amount';
import { useTransactionVolume } from '@/hooks/useTransactions';
import type { TransactionListParams } from '@/hooks/useTransactions';

interface TransactionVolumeSummaryProps {
  filters?: Omit<TransactionListParams, 'page' | 'pageSize'>;
  transactionCount?: number;
}

export const TransactionVolumeSummary: React.FC<TransactionVolumeSummaryProps> = ({
  filters,
  transactionCount,
}) => {
  const { data: volumeData, isLoading } = useTransactionVolume(filters);
  const totalVolume = volumeData?.volume ?? 0;

  return (
    <Card variant="surface" className="p-4">
      <div className="flex items-center gap-3">
        <TrendingUp size={20} className="text-gray-600" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Volume
          </p>
          {isLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <Amount
              value={totalVolume}
              currency="NPR"
              mainClassName="text-xl font-bold text-gray-900"
            />
          )}
        </div>
        {transactionCount !== undefined && (
          <div className="text-right">
            <p className="text-xs text-gray-500">{transactionCount} transactions</p>
          </div>
        )}
      </div>
    </Card>
  );
};
