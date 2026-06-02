import React, { useCallback } from 'react';

export interface Tab {
  key: string;
  label: React.ReactNode;
}

export interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export const TabNavigation = React.memo(
  ({ tabs, activeTab, onTabChange, className }: TabNavigationProps) => {
    const handleTabClick = useCallback(
      (key: string) => {
        if (key !== activeTab) {
          onTabChange(key);
        }
      },
      [activeTab, onTabChange]
    );

    return (
      <div className={`flex border-b border-gray-100 overflow-x-auto ${className ?? ''}`}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`cursor-pointer px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab.key
                ? 'border-redtab text-redtab'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }
);

TabNavigation.displayName = 'TabNavigation';
