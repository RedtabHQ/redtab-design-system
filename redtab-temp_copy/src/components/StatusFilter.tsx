import React from 'react';

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  value,
  onChange,
  options = ['ALL', 'VERIFIED', 'PENDING', 'SUSPENDED'],
  className = ""
}) => {
  return (
    <div className={`flex bg-white p-1 rounded border border-gray-100 shadow-sm overflow-x-auto gap-1 ${className}`}>
      {options.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-4 py-1.5 text-2xs font-black uppercase tracking-tight rounded transition-all whitespace-nowrap cursor-pointer ${
            value === f ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};