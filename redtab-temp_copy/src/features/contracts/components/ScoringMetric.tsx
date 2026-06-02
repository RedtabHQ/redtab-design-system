import React from 'react';

interface ScoringMetricProps {
  label: string;
  weight: string;
  score: number;
  subs: string[];
}

const ScoringMetric: React.FC<ScoringMetricProps> = ({ label, weight, score, subs }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-end">
      <div>
         <p className="text-2xs font-black text-gray-900 uppercase tracking-widest">{label}</p>
         <p className="text-3xs font-bold text-gray-400 uppercase mt-1">Impact: {weight}</p>
      </div>
      <div className="text-right">
         <p className="text-lg font-black text-redtab">{score}/100</p>
         <p className="text-[8px] font-black text-green-600 uppercase">Above Sector Avg</p>
      </div>
    </div>
    <div className="space-y-3 pt-2">
       {subs.map(s => (
          <div key={s} className="flex items-center justify-between">
             <span className="text-2xs font-bold text-gray-500">{s.replace('_', ' ')}</span>
             <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                   <div className="bg-gray-900 h-full" style={{ width: '85%' }} />
                </div>
                <span className="text-3xs font-black text-gray-900 uppercase">High</span>
             </div>
          </div>
       ))}
    </div>
  </div>
);

export default ScoringMetric;
