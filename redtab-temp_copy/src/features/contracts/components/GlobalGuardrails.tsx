import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const GlobalGuardrails: React.FC = () => {
  return (
    <div className="bg-gray-900 p-8 rounded-xl text-white shadow-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-600/20 rounded-2xl text-red-500">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="font-black">Global Guardrails</h3>
          <p className="text-3xs font-black text-gray-500 uppercase tracking-widest">Cross-Region Liquidity</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
          <p className="text-2xs font-black text-gray-400 uppercase tracking-widest leading-none">Base Currency</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-black">USD</span>
            <span className="px-2 py-0.5 bg-indigo-500 text-2xs font-black rounded uppercase">Anchor</span>
          </div>
        </div>

        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
          <p className="text-2xs font-black text-gray-400 uppercase tracking-widest leading-none">Auto-Hedge Threshold</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-black">2.5%</span>
            <span className="text-2xs font-black text-amber-400">Swing Alert</span>
          </div>
        </div>
      </div>

      <p className="text-xs+ text-gray-500 italic leading-relaxed">
        When the local currency exchange rate fluctuates beyond the hedge threshold, the platform will automatically pause limit increases in that region.
      </p>
    </div>
  );
};
