import React from 'react';

interface PolicySliderProps {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
  accentColor?: string;
  disabled?: boolean;
}

export const PolicySlider: React.FC<PolicySliderProps> = ({ 
  label, 
  icon: Icon, 
  value, 
  min, 
  max, 
  step, 
  format, 
  onChange, 
  accentColor = "accent-redtab",
  disabled = false,
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-gray-400" />
        <span className="text-xs font-bold text-gray-600">{label}</span>
      </div>
      <span className="text-xs font-black text-gray-900">{format(value)}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      disabled={disabled}
      className={`w-full h-1.5 rounded-lg appearance-none transition-all ${accentColor} ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-200' : 'cursor-pointer bg-gray-100'}`}
    />
  </div>
);
