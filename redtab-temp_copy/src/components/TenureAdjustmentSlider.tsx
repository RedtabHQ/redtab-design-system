import React from 'react';

interface TenureAdjustmentSliderProps {
  value: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const TenureAdjustmentSlider: React.FC<TenureAdjustmentSliderProps> = ({
  value,
  onChange,
  onChangeEnd,
  label = 'Specific Tenure Adjustment',
  min = 15,
  max = 60,
  step = 5,
  unit = 'Days'
}) => {
  const handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    if (onChangeEnd) {
      onChangeEnd(parseInt((e.target as HTMLInputElement).value));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
    if (onChangeEnd) {
      onChangeEnd(parseInt((e.target as HTMLInputElement).value));
    }
  };

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <div className="flex justify-between items-center text-3xs font-black text-gray-400 uppercase tracking-widest">
        <span>{label}</span>
        <span className="ml-2 text-white bg-redtab px-1.5 py-0.5 rounded">{value} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-redtab"
      />
    </div>
  );
};

export default TenureAdjustmentSlider;
