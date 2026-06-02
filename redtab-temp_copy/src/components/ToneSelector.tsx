import React from 'react';

type ToneType = 'SUPPORTIVE' | 'FORMAL' | 'URGENT';

interface ToneSelectorProps {
  value: ToneType;
  onChange: (tone: ToneType) => void;
  label?: string;
  className?: string;
}

const TONE_OPTIONS: ToneType[] = ['SUPPORTIVE', 'FORMAL', 'URGENT'];

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  value,
  onChange,
  label = 'Draft Strategy / Tone',
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="text-2xs font-black text-gray-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {TONE_OPTIONS.map((tone) => (
          <button
            key={tone}
            onClick={() => onChange(tone)}
            className={`py-3 rounded-2xl text-2xs font-black uppercase tracking-tight border transition-all cursor-pointer ${
              value === tone
                ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
            }`}
          >
            {tone}
          </button>
        ))}
      </div>
    </div>
  );
};
