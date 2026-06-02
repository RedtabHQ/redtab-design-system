import React from 'react';
import { Target, ShieldCheck } from 'lucide-react';
import SummaryRow from '@/features/contracts/components/SummaryRow';
import { useActiveMarketSegments } from '@/hooks/useMarketSegments';

interface Region {
  id: string;
  name: string;
  currency: string;
}

interface OnboardingSummarySidebarProps {
  activeRegion?: Region;
  marketSegmentId?: string;
  completedSteps: Set<number>;
  step: number;
  className?: string;
}

const OnboardingSummarySidebar: React.FC<OnboardingSummarySidebarProps> = ({
  activeRegion,
  marketSegmentId,
  completedSteps,
  step,
  className = ''
}) => {
  const { data: marketSegments = [] } = useActiveMarketSegments();
  const selectedMarketSegment = marketSegments.find(s => s.id === marketSegmentId);

  // Use marketSegment data if provided, otherwise fall back to activeRegion
  const displayName = selectedMarketSegment?.name || activeRegion?.name || '...';
  const displayCurrency = selectedMarketSegment?.currency || activeRegion?.currency || '';
  return (
    <div className={`lg:col-span-4 space-y-8 lg:sticky lg:top-24 ${className}`}>
      {/* Onboarding Summary Card */}
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">
        <div className="flex items-center gap-3 text-gray-400">
          <Target size={18} />
          <h3 className="text-2xs font-black uppercase tracking-widest">Onboarding Summary</h3>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-2xs font-black text-gray-400 uppercase tracking-widest leading-none">Partner Segment</p>
            <p className="text-xl font-black text-gray-900 mt-2">{displayName}</p>
            <p className="text-2xs font-bold text-gray-400 uppercase mt-1">{displayCurrency} Local Tender</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-50">
            <SummaryRow label="Entity Identity" checked={completedSteps.has(1)} />
            <SummaryRow label="Bank Details" checked={completedSteps.has(2)} />
            <SummaryRow label="Commercial Terms" checked={step > 2} />
          </div>
        </div>
      </div>

      {/* Compliance Policy Card */}
      <div className="bg-gray-900 p-8 rounded-xl text-white space-y-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-redtab" />
          <h4 className="font-bold text-sm tracking-tight">Compliance Policy</h4>
        </div>
        <p className="text-xs+ text-gray-400 leading-relaxed font-medium">
          Partners in the {displayName} market must undergo a KYC document audit before the first real-time settlement rail can be enabled.
        </p>
      </div>
    </div>
  );
};

export default OnboardingSummarySidebar;