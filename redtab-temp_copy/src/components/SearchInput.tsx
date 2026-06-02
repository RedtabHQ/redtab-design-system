import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
          isFocused ? 'text-redtab' : 'text-gray-400'
        }`}
        size={18}
      />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-redtab focus:border-redtab transition-all shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};