import React from 'react';
import { Target } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell
} from 'recharts';
import RegionalPurchaseLedgerTable from '@/components/RegionalPurchaseLedgerTable';
import { Merchant } from '@/types';
import { MerchantBalanceCard } from './MerchantBalanceCard';

interface MerchantOverviewTabProps {
  merchant: Merchant;
  merchantId: string;
}

const PolicyMetric = ({ label, value, sub, color = 'text-gray-900' }: { label: string; value?: string; sub: string; color?: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <div>
      <p className="text-2xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xs font-bold text-gray-300 uppercase">{sub}</p>
    </div>
    <span className={`text-xl font-black ${color}`}>{value ?? '-'}</span>
  </div>
);

export const MerchantOverviewTab: React.FC<MerchantOverviewTabProps> = ({ merchant, merchantId }) => {
  const scoreData = [
    { name: 'Capacity', score: merchant.capacityScore, weight: 60 },
    { name: 'Intention', score: merchant.intentionScore, weight: 40 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <MerchantBalanceCard merchant={merchant} merchantId={merchantId} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Target size={16} /> Dimension Performance
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} layout="vertical">
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fontSize: 10, fontWeight: 800, fill: '#6b7280'}} />
                <RechartsTooltip />
                <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={24}>
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Capacity' ? '#E61E2A' : '#4F46E5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Policy Summary</h3>
          <div className="space-y-4">
            <PolicyMetric label="Months Active" value={merchant.ageMonths?.toString() || '-'} sub="Lifecycle Status" />
            <PolicyMetric label="Owner Boost" value={merchant.ownerCreditBoost ? `+${merchant.ownerCreditBoost}%` : ''} sub="Intention Signal" />
            <PolicyMetric label="Max DPD" value={merchant.maxDPD?.toString()} sub="Risk Performance" color={(merchant.maxDPD || 0) > 7 ? 'text-red-500' : 'text-green-600'} />
          </div>
        </div>
      </div>

      <RegionalPurchaseLedgerTable merchantId={merchantId || ''} />
    </div>
  );
};
