import React from 'react';
import { TrendingDown } from 'lucide-react';

interface GlobalGuardrailsSectionProps {
  maxPortfolioExposure: number;
  delinquencyThreshold: number;
  currency: string;
  onMaxPortfolioExposureChange: (value: number) => void;
  onDelinquencyThresholdChange: (value: number) => void;
}

const GlobalGuardrailsSection: React.FC<GlobalGuardrailsSectionProps> = ({
  maxPortfolioExposure,
  delinquencyThreshold,
  currency,
  onMaxPortfolioExposureChange,
  onDelinquencyThresholdChange,
}) => {
  return (
    <section className="space-y-6">
      <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <TrendingDown size={18} /> Global System Guardrails
      </h3>
      <div className="bg-gray-900 p-10 rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-10 text-white border border-gray-800">
        {/* Portfolio Exposure Cap */}
        <div className="space-y-4">
          <label className="text-2xs font-black text-gray-500 uppercase tracking-widest">
            Portfolio Exposure Cap ({currency})
          </label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 font-black">
              {currency}
            </span>
            <input
              type="number"
              value={maxPortfolioExposure}
              onChange={(e) => onMaxPortfolioExposureChange(parseInt(e.target.value))}
              className="w-full pl-20 pr-6 py-5 bg-white/5 border border-white/10 rounded font-black text-2xl focus:ring-2 focus:ring-redtab outline-none transition-all"
            />
          </div>
        </div>

        {/* NPL Threshold */}
        <div className="space-y-4">
          <label className="text-2xs font-black text-gray-500 uppercase tracking-widest">
            NPL Threshold (Auto-Suspend)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={delinquencyThreshold * 100}
              onChange={(e) => onDelinquencyThresholdChange(parseFloat(e.target.value) / 100)}
              className="w-full px-6 pr-12 py-5 bg-white/5 border border-white/10 rounded font-black text-2xl focus:ring-2 focus:ring-redtab outline-none transition-all"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-600">%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalGuardrailsSection;
