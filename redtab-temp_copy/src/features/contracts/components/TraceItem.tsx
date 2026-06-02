import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface TraceItemProps {
  label: string;
  time: string;
}

const TraceItem: React.FC<TraceItemProps> = ({ label, time }) => (
   <div className="flex items-center justify-between border-b border-gray-100/50 pb-3 last:border-0 last:pb-0">
      <p className="text-2xs font-bold text-gray-500 uppercase">{label}</p>
      <div className="flex items-center gap-2">
         <span className="text-3xs font-black text-gray-400 uppercase">{time}</span>
         <CheckCircle2 size={12} className="text-green-500" />
      </div>
   </div>
);

export default TraceItem;
