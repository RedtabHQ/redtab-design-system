import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Menu } from 'lucide-react';
import { UserDropdown } from '../UserDropdown';
import { MarketSegmentSwitcher } from './MarketSegmentSwitcher';

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-40 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-1 min-w-0">
          {/* Sidebar Toggle Button - Visible only on desktop */}
          <button
            className="inline-flex flex-shrink-0 items-center justify-center w-10 h-10 hover:bg-gray-50 rounded-lg transition-colors duration-200 group cursor-pointer"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <Menu
              size={20}
              className="text-gray-600 group-hover:text-gray-900 transition-colors"
              strokeWidth={2}
            />
          </button>

          {/* Market Switcher */}
          <div className="flex-shrink-0">
            <MarketSegmentSwitcher />
          </div>

          <div className="hidden sm:block h-10 w-px bg-gray-100 flex-shrink-0" />

          {/* Search Bar - Responsive width */}
          <div className="relative flex-1 min-w-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0" size={18} />
            <input
              type="text"
              placeholder={t('search')}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50/50 border border-transparent rounded-lg text-sm font-medium focus:bg-white focus:border-red-100 outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="hidden sm:block h-8 w-px bg-gray-100" />
          <UserDropdown />
        </div>
      </header>
    </>
  );
};
