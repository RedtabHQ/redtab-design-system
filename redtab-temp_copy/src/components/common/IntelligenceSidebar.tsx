import React from 'react';
import { BrainCircuit, Sparkles, ChevronRight, Activity, RotateCcw, CloudSun } from 'lucide-react';
import type { MarketSegment } from '@/types';

interface IntelligenceSidebarProps {
  isForecastMode: boolean;
  isForecasting: boolean;
  aiForecast: string | null;
  onRunForecast: () => void;
  currencySymbol: string;
  activeSegment: MarketSegment | null;
}

export const IntelligenceSidebar: React.FC<IntelligenceSidebarProps> = ({
  isForecastMode,
  isForecasting,
  aiForecast,
  onRunForecast,
  currencySymbol,
  activeSegment
}) => {
  return (
    <div className={`max-h-96 p-10 rounded-xl shadow-2xl transition-all duration-700 flex flex-col h-full min-h-[500px] border relative overflow-hidden ${
      isForecastMode 
        ? 'bg-indigo-900 border-indigo-800 text-white' 
        : 'bg-white border-gray-100 text-gray-900'
    }`}>
      {/* Decorative Pulse */}
      {isForecasting && (
        <div className="absolute inset-0 bg-gradient-to-t from-redtab/5 to-transparent animate-pulse" />
      )}
      
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 rounded-3xl transition-colors ${isForecastMode ? 'bg-white/10' : 'bg-red-50'}`}>
          <BrainCircuit size={32} className={isForecastMode ? 'text-indigo-300' : 'text-redtab'} />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight">Segment Narrative</h3>
          <p className={`text-2xs font-black uppercase tracking-widest ${isForecastMode ? 'text-indigo-400' : 'text-gray-400'}`}>AI Strategy Brief</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent mb-6">
        {isForecasting ? (
          <div className="space-y-6 animate-pulse">
            <div className={`h-4 rounded-full w-full ${isForecastMode ? 'bg-white/10' : 'bg-gray-100'}`} />
            <div className={`h-4 rounded-full w-5/6 ${isForecastMode ? 'bg-white/10' : 'bg-gray-100'}`} />
            <div className={`h-4 rounded-full w-4/6 ${isForecastMode ? 'bg-white/10' : 'bg-gray-100'}`} />
            <div className={`h-4 rounded-full w-full ${isForecastMode ? 'bg-white/10' : 'bg-gray-100'}`} />
          </div>
        ) : aiForecast ? (
          <div className="space-y-6">
            <p className={`text-lg leading-relaxed font-medium italic border-l-4 pl-6 py-2 ${
              isForecastMode ? 'text-indigo-50 border-indigo-500' : 'text-gray-600 border-redtab'
            }`}>
              "{aiForecast}"
            </p>
            <ConfidenceMetrics isForecastMode={isForecastMode} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-6 bg-gray-50 rounded-full text-gray-200">
              <Activity size={48} />
            </div>
            <p className="text-sm text-gray-400 font-medium italic px-8">
              Initialize predictive modeling to generate localized liquidity strategies for the {activeSegment?.name || 'global'} segment.
            </p>
          </div>
        )}
      </div>

      {!isForecastMode && !isForecasting && (
        <button
          onClick={onRunForecast}
          className="mt-8 w-full py-5 bg-gray-900 text-white rounded-lg font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer"
        >
           Boot Treasury Engine <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
};

interface ConfidenceMetricsProps {
  isForecastMode: boolean;
}

const ConfidenceMetrics: React.FC<ConfidenceMetricsProps> = ({ isForecastMode }) => {
  return (
    <div className={`p-6 rounded-3xl border ${isForecastMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
      <h4 className="text-2xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
        <Sparkles size={14} className="text-amber-400" /> Confidence Metrics
      </h4>
      <div className="space-y-4">
        <SmallProgress label="Data Reliability" value={98} dark={isForecastMode} />
        <SmallProgress label="Market Volatility" value={12} dark={isForecastMode} />
      </div>
    </div>
  );
};

interface SmallProgressProps {
  label: string;
  value: number;
  dark?: boolean;
}

const SmallProgress: React.FC<SmallProgressProps> = ({ label, value, dark }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-3xs font-black uppercase tracking-widest">
      <span className={dark ? 'text-indigo-300' : 'text-gray-400'}>{label}</span>
      <span className={dark ? 'text-white' : 'text-gray-900'}>{value}%</span>
    </div>
    <div className={`h-1 w-full rounded-full overflow-hidden ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
      <div className={`h-full transition-all duration-1000 ${dark ? 'bg-indigo-400' : 'bg-redtab'}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);