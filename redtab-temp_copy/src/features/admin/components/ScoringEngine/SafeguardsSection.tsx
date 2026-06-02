import React from 'react';
import { History } from 'lucide-react';

export const SafeguardsSection: React.FC = () => {
  return (
    <div className="p-10 bg-amber-50 rounded-xl border border-amber-100 space-y-4">
      <div className="flex items-center gap-2 text-amber-700">
        <History size={20} />
        <h4 className="font-black text-sm uppercase tracking-widest">Global Engine Safeguards</h4>
      </div>
      <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
        Deterministic edge-rules apply <strong>after</strong> weighted calculation: DPD &gt; 30 caps final score at <strong>59</strong>. Utilization &gt; 80% reduces score by <strong>15%</strong>. Fraud Detection immediately resets score to <strong>0</strong> and initiates a Tier D suspension.
      </p>
    </div>
  );
};
