import React from 'react';

type WorkbenchTab = 'profile' | 'scoring' | 'suppliers' | 'kyc';

interface TabButtonProps {
  id: WorkbenchTab;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  activeTab: string;
  onClick: (id: WorkbenchTab) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon, activeTab, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`cursor-pointer flex-1 flex items-center justify-center gap-3 py-5 text-xs font-black uppercase tracking-widest transition-all ${
      activeTab === id ? 'bg-white text-redtab shadow-sm ring-1 ring-gray-100 border-b-2 border-redtab' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

export default TabButton;
export type { WorkbenchTab };
