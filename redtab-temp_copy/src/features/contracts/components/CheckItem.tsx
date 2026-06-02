import React from 'react';
import { Check } from 'lucide-react';

interface CheckItemProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const CheckItem: React.FC<CheckItemProps> = ({ label, checked, onToggle }) => (
  <div className="flex items-center gap-4 cursor-pointer group" onClick={onToggle}>
     <div className={`p-1 rounded-md transition-all ${checked ? 'bg-redtab text-white' : 'bg-gray-50 text-gray-300 group-hover:bg-red-50'}`}>
        {checked ? <Check size={14} /> : <div className="w-3.5 h-3.5" />}
     </div>
     <span className={`text-xs font-bold transition-colors ${checked ? 'text-gray-900' : 'text-gray-600'}`}>{label}</span>
  </div>
);

export default CheckItem;
