import React from 'react';
import { Shield } from 'lucide-react';

interface ComplianceItem {
  label: string;
  status: string;
  verified?: boolean;
}

interface ComplianceRadarProps {
  items: ComplianceItem[];
}

const ComplianceRadar: React.FC<ComplianceRadarProps> = ({ items }) => {
  return (
    <div className="bg-gray-900 p-8 rounded text-white space-y-6 shadow-xl">
      <h4 className="text-2xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Shield size={14} className="text-redtab" /> COMPLIANCE RADAR
      </h4>
      <div className="space-y-4">
        {items.map((item, index) => (
          <ComplianceItemRow key={index} label={item.label} status={item.status} verified={item.verified} />
        ))}
      </div>
    </div>
  );
};

const ComplianceItemRow: React.FC<{ label: string; status: string; verified?: boolean }> = ({ label, status, verified = true }) => {
  // Determine indicator color based on verification status
  const indicatorColor = verified
    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
    : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]';

  return (
    <div className="flex items-center justify-between group">
      <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-2xs font-black uppercase tracking-tighter text-gray-300">{status}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${indicatorColor}`} />
      </div>
    </div>
  );
};

export default ComplianceRadar;