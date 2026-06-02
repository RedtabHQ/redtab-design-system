/**
 * Onboarding Sidebar Component
 */

import { PieChart, Zap, Info, CheckCircle2 } from 'lucide-react';
import type { MarketSegment } from '@/types';

interface OnboardingSidebarProps {
  predictedScore: number;
  merchantName: string;
  activeRegion: MarketSegment | undefined;
}

const SummaryRow = ({ label, checked }: { label: string; checked: boolean }) => (
  <div className="flex items-center justify-between">
    <span className={`text-xs+ font-bold ${checked ? 'text-gray-900' : 'text-gray-400'}`}>
      {label}
    </span>
    <div className={`p-1 rounded-lg ${checked ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-200'}`}>
      <CheckCircle2 size={12} />
    </div>
  </div>
);

export const OnboardingSidebar = ({
  predictedScore,
  merchantName,
  activeRegion,
}: OnboardingSidebarProps) => {
  const tier = predictedScore >= 85 ? 'A' : predictedScore >= 70 ? 'B' : 'C';

  return (
    <div className="space-y-8 lg:sticky lg:top-24">
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">
        <div className="flex items-center gap-3 text-gray-400">
          <PieChart size={18} />
          <h3 className="text-2xs font-black uppercase tracking-widest">Intake Intelligence</h3>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xs font-black text-gray-400 uppercase tracking-widest leading-none">
                Predicted Score
              </p>
              <p className="text-4xl font-black text-gray-900 mt-2">{predictedScore}</p>
            </div>
            <div
              className={`px-3 py-1 rounded-lg text-2xs font-black uppercase tracking-widest text-white ${
                predictedScore >= 70 ? 'bg-green-500' : 'bg-amber-500'
              }`}
            >
              Tier {tier}
            </div>
          </div>

          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="bg-redtab h-full transition-all duration-1000"
              style={{ width: `${predictedScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-50">
          <p className="text-2xs font-black text-gray-400 uppercase tracking-widest">Captured Inputs</p>
          <div className="space-y-3">
            <SummaryRow label="Entity Data" checked={!!merchantName} />
            <SummaryRow label="Financials" checked={false} />
            <SummaryRow label="Liability Profile" checked={false} />
            <SummaryRow label="Behavioral Pts" checked={false} />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-8 rounded-xl text-white space-y-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-redtab" />
          <h4 className="font-bold text-sm tracking-tight">Onboarding Policy</h4>
        </div>
        <p className="text-xs+ text-gray-400 leading-relaxed font-medium">
          The {activeRegion?.name} segment requires a minimum of{' '}
          <span className="text-white font-bold">NPR 1,000,000</span> monthly bank flow for{' '}
          <span className="text-white font-bold">Tier A</span> eligibility. Multiplier of{' '}
          <span className="text-white font-bold">0.85x</span> applies to all new merchants for the first 3
          months.
        </p>
      </div>

      <div className="p-8 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
        <Info size={20} className="text-amber-600 shrink-0" />
        <p className="text-2xs text-amber-800 font-medium leading-relaxed italic">
          Data provided here is subject to automated cross-reference with external segment APIs. Discrepancies
          &gt; 15% will trigger manual underwriting audit.
        </p>
      </div>
    </div>
  );
};
