/**
 * Reusable TextInput component for onboarding forms
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  icon,
}: TextInputProps) => (
  <div className="space-y-2 group">
    <label className="text-2xs font-black text-gray-400 uppercase tracking-widest px-1 group-focus-within:text-redtab transition-colors">
      {label}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-6 py-4 bg-gray-50 border ${
          error ? 'border-red-300' : 'border-gray-100'
        } rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-50/50 transition-all shadow-inner ${
          icon ? 'pl-12' : ''
        }`}
      />
      {error && (
        <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-600 text-xs">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  </div>
);
