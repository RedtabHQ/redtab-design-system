import React from 'react';
import { Target, Clock, BrainCircuit } from 'lucide-react';
import { PolicySlider } from '../PolicyConfig';

interface ThresholdSectionProps {
  minScore: number;
  maxScore: number;
  gracePeriod: number;
  maxSelectableScore: number;
  isFinalTier: boolean;
  onMaxScoreChange: (value: number) => void;
  onGracePeriodChange: (value: number) => void;
}

export const ThresholdSection: React.FC<ThresholdSectionProps> = ({
  minScore,
  maxScore,
  gracePeriod,
  maxSelectableScore,
  isFinalTier,
  onMaxScoreChange,
  onGracePeriodChange,
}) => {
  return (
    <div className="space-y-6">
      <p className="text-2xs font-black text-indigo-500 uppercase tracking-widest border-b border-indigo-50 pb-2">
        Automatic Assignment Threshold
      </p>
      <div className="space-y-6">
        <PolicySlider
          label={isFinalTier ? 'Tier Ceiling (Locked at 100)' : 'Tier Ceiling Score'}
          icon={Target}
          value={isFinalTier ? 100 : maxScore}
          min={minScore}
          max={isFinalTier ? 100 : maxSelectableScore}
          step={1}
          format={(v: number) => `${v} Points`}
          onChange={onMaxScoreChange}
          accentColor="accent-indigo-600"
          disabled={isFinalTier}
        />
        <div className="p-5 bg-indigo-50 border border-indigo-100 space-y-3">
          <div className="flex items-center gap-2 text-indigo-900">
            <BrainCircuit size={16} />
            <p className="text-2xs font-black uppercase tracking-widest">Engine Logic</p>
          </div>
          <p className="text-xs+ text-indigo-700 leading-relaxed font-medium">
            Merchants with a Trust Score between <strong>{minScore}</strong> and{' '}
            <strong>{isFinalTier ? 100 : maxScore}</strong> will be automatically routed to this tier in the Decision
            Workbench.
          </p>
        </div>
        <PolicySlider
          label="Grace Period"
          icon={Clock}
          value={gracePeriod}
          min={0}
          max={14}
          step={1}
          format={(v: number) => `${v} Days`}
          onChange={onGracePeriodChange}
          accentColor="accent-amber-500"
        />
      </div>
    </div>
  );
};

export default ThresholdSection;
