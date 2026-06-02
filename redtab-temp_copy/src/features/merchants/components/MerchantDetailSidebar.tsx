import React from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { Merchant } from '@/types';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';
import { getCreditScorePercent, MAX_CREDIT_SCORE } from '@/utils/creditScore';
import Markdown from 'react-markdown';

interface MerchantDetailSidebarProps {
  merchant: Merchant;
  aiSummary: string | null;
  isLoadingAi: boolean;
}

export const MerchantDetailSidebar: React.FC<MerchantDetailSidebarProps> = ({
  merchant,
  aiSummary,
  isLoadingAi,
}) => {
  const creditScore = merchant.creditScore ?? 0;
  const creditScorePercent = getCreditScorePercent(creditScore);
  const scoreBarWidth = Math.min(creditScorePercent, 100);

  return (
    <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:gap-8">
      {/* Credit Score Card */}
      <div className="w-full mb-8 lg:mb-0 lg:w-1/3 bg-white mb-0 p-10 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-red-50 text-redtab rounded-2xl shadow-sm">
              <BrainCircuit size={24} />
            </div>
            <span className="text-2xs font-black text-gray-400 uppercase tracking-widest">Final Score</span>
          </div>
          <p className="text-6xl font-black text-gray-900 mb-2">
            {creditScore.toLocaleString(DEFAULT_CURRENCY_LOCALE, { maximumFractionDigits: 0 })}
            <span className="text-base font-bold text-gray-400"> / {MAX_CREDIT_SCORE}</span>
          </p>
          <div className="flex items-center gap-2 mb-8">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${creditScorePercent >= 90 ? 'bg-green-500' : creditScorePercent >= 75 ? 'bg-blue-500' : 'bg-redtab'
                  }`}
                style={{ width: `${scoreBarWidth}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center text-xs font-black text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-6">
            <span>Tier Banding</span>
            <span className="text-gray-900">{merchant.tier}</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 opacity-50" />
      </div>

      {/* AI Insight Card */}
      <div className="w-full mb-8 lg:mb-0 lg:w-2/3 bg-gray-900 p-10 rounded-xl text-white shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles size={20} className="text-indigo-300" />
          <h3 className="font-bold tracking-tight text-indigo-50">AI Strategic Insight</h3>
        </div>
        <div className="max-h-42 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {isLoadingAi ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-full"></div>
              <div className="h-3 bg-white/10 rounded w-5/6"></div>
            </div>
          ) : (
            <Markdown
              components={{ p: ({ children }) => <p className="text-sm text-indigo-100/80 leading-relaxed italic border-l-2 border-indigo-500 pl-6 pr-2">{children}</p> }}>
              {aiSummary}
            </Markdown>
          )}
        </div>
      </div>
    </div>
  );
};
