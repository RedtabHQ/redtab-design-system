import React from 'react';
import { Zap, FileText, SlidersHorizontal } from 'lucide-react';
import { DEFAULT_CURRENCY_LOCALE, getCurrencySymbol } from '@/constants/currency';

interface SubMetricMeta {
  weight?: number;
  targetValue?: number;
  unit?: string;
  logic?: string;
  description?: string;
}

interface SubMetricRowProps {
  subKey: string;
  meta: SubMetricMeta;
  onWeightChange: (value: number) => void;
  onTargetValueChange: (value: number) => void;
}

const getFormattedLogic = (logic: string, targetValue: number): string => {
  return logic.replace('Target', targetValue.toLocaleString(DEFAULT_CURRENCY_LOCALE));
};

export const SubMetricRow: React.FC<SubMetricRowProps> = ({
  subKey,
  meta,
  onWeightChange,
  onTargetValueChange,
}) => {
  return (
    <div className="border-b border-b-4 border-gray-200 space-y-6 group animate-in slide-in-from-left-4 duration-300">
      <div className="pt-8 pl-8 pr-8">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs+ font-black text-gray-900 uppercase tracking-tight">{subKey.replace(/_/g, ' ')}</span>
            <span className="px-2 py-0.5 bg-gray-100 text-3xs font-black text-gray-400 rounded-md uppercase tracking-widest">Impact: {((meta.weight ?? 0) * 100).toLocaleString(DEFAULT_CURRENCY_LOCALE, { maximumFractionDigits: 0 })}%</span>

            {/* Hoverable Logic Badge */}
            {meta.logic && (
              <div className="relative group/logic">
                <span
                  className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-tighter border cursor-help transition-all hover:ring-2 hover:ring-offset-1 ${
                    meta.logic.includes('Inverse')
                      ? 'bg-amber-50 text-amber-700 border-amber-100 hover:ring-amber-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:ring-indigo-200'
                  }`}
                >
                  {meta.logic.split(':')[0]}
                </span>
                {/* Tooltip Content */}
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover/logic:block w-64 p-3 bg-gray-900 text-white text-2xs rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-1 font-medium leading-relaxed">
                  <div className="flex items-center gap-2 mb-1.5 text-redtab font-black uppercase tracking-widest text-[8px]">
                    <Zap size={10} /> Calculation Formula
                  </div>
                  <p className="opacity-90">{getFormattedLogic(meta.logic, meta.targetValue ?? 0)}</p>
                  <div className="absolute top-full left-4 border-[6px] border-transparent border-t-gray-900" />
                </div>
              </div>
            )}
          </div>
          <p className="text-2xs text-gray-400 font-medium leading-relaxed max-w-md">{meta.description || ''}</p>
        </div>

        <div className="flex flex-row items-center gap-8 mt-8">
          {/* Weight Config */}
          <div className="space-y-2 flex-1">
            <div className="flex justify-between items-center text-3xs font-bold text-gray-400 uppercase tracking-tighter">
              <span>Metric Weight</span>
              <span>{((meta.weight ?? 0) * 100).toLocaleString(DEFAULT_CURRENCY_LOCALE, { maximumFractionDigits: 0 })}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={meta.weight ?? 0}
              onChange={(e) => onWeightChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-redtab transition-all"
            />
          </div>

          {/* Threshold/Cap Config */}
          <div className="flex-1 p-4 bg-gray-50 rounded border border-gray-100 space-y-3 shadow-inner">
            <div className="flex justify-between items-center">
              <p className="text-3xs font-black text-redtab uppercase tracking-widest flex items-center gap-1">
                <SlidersHorizontal size={10} /> {meta.logic?.includes('Max') ? 'Ceiling' : 'Target'}
              </p>
              <p className="text-2xs font-black text-gray-900">
                {meta.unit?.includes('NPR') ? `${getCurrencySymbol('NPR')} ` : ''}
                {(meta.targetValue ?? 0).toLocaleString(DEFAULT_CURRENCY_LOCALE)}
                {meta.unit?.includes('NPR') ? '' : ` ${meta.unit ?? ''}`}
              </p>
            </div>
            <input
              type="range"
              min={0}
              max={(meta.targetValue ?? 50) * 2}
              step={(meta.targetValue ?? 0) > 1000 ? 5000 : (meta.targetValue ?? 0) > 100 ? 10 : 1}
              value={meta.targetValue ?? 0}
              onChange={(e) => onTargetValueChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900 transition-all"
            />
            <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase tracking-tighter">
              <span>Adjust full-score threshold</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex bg-gray-50 gap-4 border-t border-gray-100 py-4 px-8">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-amber-500" />
          <span className="text-3xs font-black text-gray-400 uppercase tracking-widest">Scaling Formula:</span>
          <span className="text-3xs font-bold text-gray-700 italic">{meta.logic ? getFormattedLogic(meta.logic, meta.targetValue ?? 0) : 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <FileText size={12} className="text-indigo-400" />
          <span className="text-3xs font-black text-gray-400 uppercase tracking-widest">Source:</span>
          <span className="text-3xs font-bold text-gray-700">Segment Integration</span>
        </div>
      </div>
    </div>
  );
};
