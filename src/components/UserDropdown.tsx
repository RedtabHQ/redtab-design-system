import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Settings, LogOut, ChevronDown, Code } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

export const UserDropdown: React.FC = () => {
  const { t } = useTranslation('navigation');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLogout = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-2 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-black text-gray-900 leading-none">Global Admin</p>
          <p className="text-3xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            Multi-Region Control
          </p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-redtab to-red-700 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg relative">
          <span>GA</span>
          <ChevronDown
            size={12}
            className={`absolute -bottom-1 -right-1 bg-white text-redtab rounded-full p-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-screen max-w-xs sm:w-56 bg-white border border-gray-100 rounded shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
            <p className="text-sm font-bold text-gray-900 truncate">Global Admin</p>
            <p className="text-xs+ text-gray-500 truncate mt-0.5">
              admin@redtab.xyz
            </p>
          </div>

          <div className="py-2">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-gray-700 hover:text-gray-900 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-redtab group-hover:text-white transition-all">
                <User size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t('profile')}</p>
                <p className="text-2xs text-gray-400 uppercase tracking-wide">{t('viewAndEdit')}</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-gray-700 hover:text-gray-900 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-redtab group-hover:text-white transition-all">
                <Settings size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t('settings')}</p>
                <p className="text-2xs text-gray-400 uppercase tracking-wide">{t('preferences')}</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-gray-700 hover:text-gray-900 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-redtab group-hover:text-white transition-all">
                <Code size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t('developer')}</p>
                <p className="text-2xs text-gray-400 uppercase tracking-wide">{t('apiAndWebhooks')}</p>
              </div>
            </button>

            <div className="h-px bg-gray-100 my-2 mx-4" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-gray-700 hover:text-red-600 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                <LogOut size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t('logout')}</p>
                <p className="text-2xs text-gray-400 uppercase tracking-wide">{t('signOut')}</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-2 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-black text-gray-900 leading-none">Global Admin</p>
          <p className="text-3xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            Multi-Region Control
          </p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-redtab to-red-700 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg relative">
          <span>GA</span>
          <ChevronDown
            size={12}
            className={`absolute -bottom-1 -right-1 bg-white text-redtab rounded-full p-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-screen max-w-xs sm:w-56 bg-white border border-gray-100 rounded shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
            <p className="text-sm font-bold text-gray-900 truncate">Global Admin</p>
            <p className="text-xs+ text-gray-500 truncate mt-0.5">
              admin@redtab.xyz
            </p>
          </div>

          <div className="py-2">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-gray-700 hover:text-gray-900 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-redtab group-hover:text-white transition-all">
                <User size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t('profile')}</p>
                <p className="text-2xs text-gray-400 uppercase tracking-wide">{t('viewAndEdit')}</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-gray-700 hover:text-gray-900 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-redtab group-hover:text-white transition-all">
                <Settings size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t('settings')}</p>
                <p className="text-2xs text-gray-400 uppercase tracking-wide">{t('preferences')}</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-gray-700 hover:text-gray-900 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-redtab group-hover:text-white transition-all">
                <Code size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t('developer')}</p>
                <p className="text-2xs text-gray-400 uppercase tracking-wide">{t('apiAndWebhooks')}</p>
              </div>
            </button>

            <div className="h-px bg-gray-100 my-2 mx-4" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-gray-700 hover:text-red-600 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                <LogOut size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t('logout')}</p>
                <p className="text-2xs text-gray-400 uppercase tracking-wide">{t('signOut')}</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
