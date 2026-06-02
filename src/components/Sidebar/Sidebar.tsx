import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Zap,
  Settings2,
  Gavel,
  Banknote,
  Truck,
  History,
  FileStack,
  PieChart,
  Globe
} from 'lucide-react';

export interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const { t } = useTranslation('navigation');

  const sections = [
    {
      title: t('overview'),
      items: [
        { icon: LayoutDashboard, label: t('globalDashboard'), path: '/' },
      ]
    },
    {
      title: t('management'),
      items: [
        { icon: Truck, label: t('suppliers'), path: '/suppliers' },
        { icon: Users, label: t('merchants'), path: '/merchants' },
        { icon: FileStack, label: t('contracts'), path: '/contracts' },
      ]
    },
    {
      title: t('creditRisk'),
      items: [
        { icon: Gavel, label: t('underwriting'), path: '/decisioning-workbench' },
        { icon: PieChart, label: t('portfolioAnalytics'), path: '/portfolio' },
      ]
    },
    {
      title: t('finance'),
      items: [
        { icon: Banknote, label: t('treasuryLiquidity'), path: '/payments' },
      ]
    },
    {
      title: t('systemControl'),
      items: [
        { icon: Settings2, label: t('scoringEngine'), path: '/scoring-config' },
        { icon: ShieldAlert, label: t('policyEngine'), path: '/policy' },
        { icon: History, label: t('auditTrails'), path: '/audit' },
        { icon: Globe, label: t('regionalControls'), path: '/regional' },
      ]
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside
      className="flex flex-col bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto z-40 transition-all duration-300"
      style={{ width: '17.5rem' }}
    >
      <div className="p-6 flex items-center gap-3 justify-center">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-redtab flex items-center justify-center">
            <span className="text-white font-bold text-sm">RT</span>
          </div>
        </div>
        <div className="hidden md:flex flex-col min-w-0">
          <span className="text-lg font-bold tracking-tight leading-none text-gray-900">Redtab</span>
          <span className="text-2xs font-black text-redtab uppercase tracking-widest mt-0.5">Credit</span>
        </div>
      </div>

      <nav className="flex-1 space-y-8 pb-10 mt-4">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2 md:space-y-1">
            <h3 className="hidden md:block px-8 mb-2 text-2xs font-black text-gray-400 uppercase tracking-widest">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-8 py-2.5 transition-all duration-200 group/tooltip ${
                    isActive(item.path)
                      ? 'text-red-50 bg-redtab font-bold shadow-sm'
                      : 'text-gray-500 hover:text-red-900 hover:bg-red-50'
                  } justify-center md:justify-start px-2 md:px-8`}
                  title={undefined}
                >
                  <item.icon size={18} strokeWidth={isActive(item.path) ? 2.5 : 2} className="flex-shrink-0" />
                  <span className="hidden md:inline text-sm">{item.label}</span>
                </Link>

                {/* Tooltip - Show on mobile */}
                <div className="md:hidden absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg whitespace-nowrap z-50 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-opacity duration-200 pointer-events-none">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-50 flex justify-center md:block">
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:block">
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>All Bridges Active</span>
          </div>
          <div className="md:hidden w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" title="All Bridges Active" />
        </div>
      </div>
    </aside>
  );
};
