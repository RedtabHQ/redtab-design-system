import React from 'react';

interface OnboardingHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  phaseLabel?: string;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  step,
  totalSteps,
  title,
  subtitle,
  phaseLabel = 'Phase Status',
}) => {
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
