import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SummaryRowProps {
  label: string;
  checked: boolean;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, checked }) => (
  <div className="flex items-center justify-between">
    <span className={`text-xs+ font-bold ${checked ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
    <div className={`p-1 rounded-lg ${checked ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-200'}`}>
       <CheckCircle2 size={12} />
    </div>
  </div>
);

export default SummaryRow;