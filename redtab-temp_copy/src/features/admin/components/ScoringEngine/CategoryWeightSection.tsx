import React from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { SubMetricRow } from './SubMetricRow';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';

interface SubMetricMeta {
  weight: number;
  targetValue: number;
  unit: string;
  logic: string;
  description: string;
}

interface Category {
  weight: number;
  subMetrics: Record<string, SubMetricMeta>;
}

const ICON_STYLES: Record<string, string> = {
  CAPACITY: 'bg-red-50 text-redtab',
  INTENTION: 'bg-indigo-50 text-indigo-600',
  DYNAMIC_FACTORS: 'bg-emerald-50 text-emerald-600',
};

const formatCategoryLabel = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim()
    .toUpperCase();

interface CategoryWeightSectionProps {
  categoryKey: string;
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
  onWeightChange: (value: number) => void;
  onSubMetricWeightChange: (subKey: string, value: number) => void;
  onSubMetricTargetValueChange: (subKey: string, value: number) => void;
}

export const CategoryWeightSection: React.FC<CategoryWeightSectionProps> = ({
  categoryKey,
  category,
  isExpanded,
  onToggle,
  onWeightChange,
  onSubMetricWeightChange,
  onSubMetricTargetValueChange,
}) => {
  const normalizedKey = categoryKey?.toUpperCase() ?? '';
  const iconClass = ICON_STYLES[normalizedKey] ?? 'bg-gray-100 text-gray-600';
  const subMetrics = category?.subMetrics ?? {};
  const weightValue = category?.weight ?? 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded ${iconClass}`}>
            <Layers size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
              {formatCategoryLabel(categoryKey)} Dimension
            </h3>
            <p className="text-2xs text-gray-400 font-bold uppercase tracking-widest">
              Global Weighting:{' '}
              {(weightValue * 100).toLocaleString(DEFAULT_CURRENCY_LOCALE, {
                maximumFractionDigits: 0,
              })}
              %
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={weightValue}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onWeightChange(parseFloat(e.target.value))}
            className="w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-redtab"
          />
          <ChevronDown className={`text-gray-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-12">
          {Object.entries(subMetrics).map(([subKey, meta]) => (
            <SubMetricRow
              key={subKey}
              subKey={subKey}
              meta={meta}
              onWeightChange={(value) => onSubMetricWeightChange(subKey, value)}
              onTargetValueChange={(value) => onSubMetricTargetValueChange(subKey, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
