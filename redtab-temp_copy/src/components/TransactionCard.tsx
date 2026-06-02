import React from 'react';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { TransactionType } from '@/types';
import { formatDateTime } from '@/utils/dateFormatter';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';
import { Amount } from './common/Amount';

interface TransactionCardProps {
  id: string;
  merchantName: string;
  type: TransactionType;
  amount: number;
  currency?: string;
  timestamp: string;
  paymentChannel?: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  id,
  merchantName,
  type,
  amount,
  currency,
  timestamp,
  paymentChannel,
}) => {
  const isOutbound = type === TransactionType.DISBURSEMENT;
  const iconColor = isOutbound ? 'text-red-500' : 'text-green-500';
  const iconBgColor = isOutbound ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100';
  const amountColor = isOutbound ? 'text-gray-900' : 'text-green-600';
  const icon = isOutbound ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />;

  return (
    <div className="bg-white p-6 rounded border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
      {/* Header with Icon and Type */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded border ${iconBgColor} transition-colors group-hover:bg-redtab group-hover:text-white group-hover:border-redtab ${iconColor}`}>
          {icon}
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-xl shadow-sm">
          <CheckCircle2 size={12} className="text-green-500" />
          <span className="text-3xs font-black text-gray-400 uppercase">Settled</span>
        </div>
      </div>

      {/* Transaction ID and Timestamp */}
      <div className="mb-4">
        <p className="text-sm font-black text-gray-900">{id}</p>
        <p className="text-3xs text-gray-400 font-mono mt-1">{formatDateTime(timestamp)}</p>
      </div>

      {/* Merchant Info */}
      <div className="mb-4 pb-4 border-b border-gray-50">
        <p className="text-sm font-bold text-gray-700 mb-2">{merchantName}</p>
        <div className="flex items-center gap-2">
          <span className="text-3xs font-black text-gray-400 uppercase tracking-widest">Rail:</span>
          <span className="text-3xs font-black text-indigo-500 uppercase">{paymentChannel || 'System Internal'}</span>
        </div>
      </div>

      {/* Amount */}
      <div>
        <p className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-1">Settlement Value</p>
        <Amount mainClassName={`text-lg font-black tracking-tight ${amountColor}`} value={amount} currency={currency} showUSD />
      </div>
    </div>
  );
};
