import React from 'react';
import { getCreditScorePercent } from '@/utils/creditScore';

interface CreditScoreBarProps {
  score: number;
  className?: string;
}

export const CreditScoreBar: React.FC<CreditScoreBarProps> = ({ score, className = "" }) => {
  const progress = Math.min(getCreditScorePercent(score), 100);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 w-20 bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50">
        <div className="bg-redtab h-full shadow-[0_0_8px_rgba(230,30,42,0.4)]" style={{ width: `${progress}%` }} />
      </div>
      <span className="text-xs font-black text-gray-900 font-mono">{score}</span>
    </div>
  );
};
