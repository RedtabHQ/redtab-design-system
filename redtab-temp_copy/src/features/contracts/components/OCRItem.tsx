import React from 'react';
import { FileText, Eye } from 'lucide-react';

interface OCRItemProps {
  label: string;
  onView?: () => void;
}

const OCRItem: React.FC<OCRItemProps> = ({ label, onView }) => (
  <div className="p-6 bg-white border border-gray-100 rounded flex items-center justify-between hover:border-red-100 transition-all shadow-sm">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-red-50 group-hover:text-redtab transition-colors">
        <FileText size={20} />
      </div>
      <div>
        <p className="text-xs+ font-black text-gray-900 uppercase tracking-tight">{label}</p>
        <p className="text-3xs font-bold text-gray-400 uppercase mt-0.5">Confidence: 99.2%</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
       <button
         onClick={onView}
         className="p-2 text-gray-300 hover:text-redtab transition-colors cursor-pointer"
       >
         <Eye size={18} />
       </button>
       <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
    </div>
  </div>
);

export default OCRItem;
