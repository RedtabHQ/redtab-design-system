import React from 'react';

type InfoRowProps = {
  label: string;
  value?: string;
  icon: React.ComponentType<{ size?: number }>;
  highlight?: boolean;
};

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon: Icon, highlight }) => (
  <div className="flex px-8 hover:bg-red-50 items-center justify-between group p-2">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-red-50 group-hover:text-redtab transition-colors">
        <Icon size={14} />
      </div>
      <span className="text-xs font-bold text-gray-700 uppercase tracking-tight hidden sm:inline">{label}</span>
    </div>
    <span
      className={`text-sm font-black transition-all truncate max-w-[200px] ${highlight ? 'text-redtab bg-red-50 px-2.5 py-0.5 rounded-lg' : 'text-gray-900'}`}
      title={value}
    >
      {value}
    </span>
  </div>
);
