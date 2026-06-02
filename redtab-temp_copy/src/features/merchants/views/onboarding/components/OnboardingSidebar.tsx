/**
 * Sidebar summary component for onboarding
 */

import { PieChart, Zap, Info, CheckCircle2 } from 'lucide-react';

interface OnboardingSidebarProps {
  predictedScore: number;
  completedSteps: Set<number>;
  merchantName: string;
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
  completedSteps,
  merchantName,
}: OnboardingSidebarProps) => {
  const tier = predictedScore >= 90 ? 'A' : predictedScore >= 75 ? 'B' : 'C';

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
                predictedScore >= 75 ? 'bg-green-500' : 'bg-amber-500'
              }`}
            >
              Tier {tier}
            </div>
          </div>

          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="bg-red-600 h-full transition-all duration-1000" style={{ width: `${predictedScore}%` }} />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-50">
          <p className="text-2xs font-black text-gray-400 uppercase tracking-widest">Captured Inputs</p>
          <div className="space-y-3">
            <SummaryRow label="Entity Data" checked={completedSteps.has(1)} />
            <SummaryRow label="Financials" checked={completedSteps.has(2)} />
            <SummaryRow label="Liability Profile" checked={completedSteps.has(3)} />
            <SummaryRow label="Behavioral Pts" checked={completedSteps.has(4)} />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-8 rounded-xl text-white space-y-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-red-600" />
          <h4 className="font-bold text-sm tracking-tight">Merchant Policy</h4>
        </div>
        <p className="text-xs+ text-gray-400 leading-relaxed font-medium">
          Minimum <span className="text-white font-bold">USD 50,000</span> monthly transaction volume required for{' '}
          <span className="text-white font-bold">Tier A</span> approval.{' '}
          <span className="text-white font-bold">0.95x</span> processing multiplier applies to qualified merchants.
        </p>
      </div>

      <div className="p-8 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
        <Info size={20} className="text-amber-600 shrink-0" />
        <p className="text-2xs text-amber-800 font-medium leading-relaxed italic">
          All data provided is subject to automated verification with payment networks and regulatory databases.
          Discrepancies will trigger manual review.
        </p>
      </div>
    </div>
  );
};
