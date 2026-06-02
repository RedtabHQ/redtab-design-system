import { Layers } from 'lucide-react';
import React, { useState } from 'react';
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useTransactionFlowDynamics, type TransactionFlowRange } from '@/hooks/useTransactions';
import { useCurrency } from '@/hooks/useCurrency';
import { useTimezone } from '@/hooks/useTimezone';
import { Spinner } from '@/components/common';

interface ChartDataSectionProps {
  isForecastMode: boolean;
}

export const ChartDataSection: React.FC<ChartDataSectionProps> = ({ isForecastMode }) => {
  const [selectedDateRange, setSelectedDateRange] = useState<TransactionFlowRange>('30D');
  const { selectedSegment, isGlobalView } = useMarketSegment();
  const { symbol: currencySymbol } = useCurrency();
  const { timezone } = useTimezone();

  const { data: stats, isLoading, error, refetch } = useTransactionFlowDynamics(
    {
      ...(isGlobalView ? {} : { marketSegmentId: selectedSegment?.id }),
      range: selectedDateRange,
      status: 'COMPLETED',
      timezone,
    },
    {
      refetchInterval: isForecastMode ? 10000 : false,
      staleTime: 30000,
    }
  );

  const dateRangeOptions: { value: TransactionFlowRange; label: string }[] = [
    { value: '7D', label: '7D' },
    { value: '30D', label: '30D' },
    { value: '90D', label: '90D' },
    { value: 'YTD', label: 'YTD' },
    { value: 'ALL', label: 'ALL' },
  ];

  if (isLoading && !stats) {
    return (
      <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm h-[400px] flex items-center justify-center">
        <Spinner size="md" variant="primary" label="Loading transaction stats..." />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm h-[400px] space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center justify-between gap-4">
          <p className="text-red-700 text-sm font-semibold">
            Failed to load transaction stats. {error?.message || 'Please try again.'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const chartData = stats?.points ?? [];

  return (
    <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-2xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Layers size={18} className="text-redtab" /> Operational Flow Dynamics
        </h3>

        <div className="flex gap-1">
          {dateRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedDateRange(option.value)}
              disabled={isLoading}
              className={`px-4 py-1.5 rounded text-3xs font-black uppercase transition-all ${
                selectedDateRange === option.value
                  ? 'bg-redtab text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1 bg-red-50 text-red-600 text-3xs font-black rounded-full border border-red-100 uppercase">
            Payouts
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-600 text-3xs font-black rounded-full border border-green-100 uppercase">
            Collections
          </span>
        </div>
      </div>

      <div className="h-80">
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  borderRadius: '24px',
                  border: 'none',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
                itemStyle={{
                  fontSize: '11px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                }}
                formatter={(value: number | undefined) => {
                  if (value === undefined) return '';
                  return `${currencySymbol}${value.toLocaleString()}`;
                }}
                labelFormatter={(_label, payload) => {
                  const point = payload?.[0]?.payload as
                    | { bucketStart?: string; total?: number; net?: number }
                    | undefined;
                  if (!point?.bucketStart) return '';
                  const date = new Date(point.bucketStart);
                  return `${date.toLocaleDateString()} | Total ${currencySymbol}${(point.total || 0).toLocaleString()} | Net ${currencySymbol}${(point.net || 0).toLocaleString()}`;
                }}
              />
              <Area
                type="monotone"
                dataKey="outbound"
                stroke="#ef4444"
                strokeWidth={3}
                fillOpacity={0.05}
                fill="#ef4444"
                name="Payouts"
                dot={{ r: 2 }}
              />
              <Area
                type="monotone"
                dataKey="inbound"
                stroke="#22c55e"
                strokeWidth={3}
                fillOpacity={0.05}
                fill="#22c55e"
                name="Collections"
                dot={{ r: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm text-gray-400">
              {stats === null ? 'No transactions in this period' : 'No data available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartDataSection;
