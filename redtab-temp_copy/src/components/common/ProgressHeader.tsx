import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  phaseLabel?: string;
  variant?: 'bar' | 'circles';
  completedSteps?: Set<number>;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  step,
  totalSteps,
  title,
  subtitle,
  phaseLabel = 'Phase Status',
  variant = 'bar',
  completedSteps = new Set(),
}) => {
  if (variant === 'circles') {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <div
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Onboarding step ${step} of ${totalSteps}`}
          className="flex items-center justify-between mb-12 relative"
        >
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all ${
                completedSteps.has(s) || step >= s
                  ? 'bg-redtab text-white shadow-lg'
                  : 'bg-white border-2 border-gray-100 text-gray-400'
              }`}
            >
              {completedSteps.has(s) && step > s ? <CheckCircle size={20} /> : s}
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          {/* Content will be rendered by parent */}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
          <p className="text-gray-500 font-medium italic mt-1 text-sm">{subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-2xs font-black text-gray-400 uppercase tracking-[0.2em]">{phaseLabel}</span>
          <p className="text-xl font-black text-redtab">{step} / {totalSteps}</p>
        </div>
      </div>

      <div className="flex gap-2 h-1.5 w-full">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(i => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-500 ${
              step >= i ? 'bg-redtab shadow-[0_0_10px_rgba(230,30,42,0.3)]' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressHeader;
