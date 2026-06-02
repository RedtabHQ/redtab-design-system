import React from 'react';

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; name: string; currency?: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options }) => {
  return (
    <div className="space-y-2">
      <label className="text-2xs font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
      <select
        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded text-sm font-bold focus:ring-2 focus:ring-redtab outline-none transition-all"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.name} {option.currency ? `(${option.currency})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;