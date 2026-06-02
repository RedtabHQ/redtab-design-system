import React from 'react';
import { NavLink } from 'react-router-dom';
import { History, FileText } from 'lucide-react';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import AuditLogsTab from './AuditLogsTab';
import { PageHeader } from '@/components/common/PageHeader';

const AuditLogsView: React.FC = () => {
  const { selectedSegment, isGlobalView } = useMarketSegment();

  const heading = isGlobalView
    ? 'Global Audit Trails'
    : `${selectedSegment?.name ?? 'Segment'} Event Log`;

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        icon={<History className="text-redtab" size={28} />}
        title={heading}
        subtitle="Immutable trace of all system events and changes."
      />

      <div className="flex gap-2 border-b border-gray-200">
        <NavLink
          to="/audit/logs"
          end
          className={({ isActive }) =>
            `px-4 py-3 font-semibold text-sm transition-colors flex items-center gap-2 ${
              isActive ? 'text-redtab border-b-2 border-redtab' : 'text-gray-600 hover:text-gray-900'
            }`
          }
        >
          <History size={16} />
          Audit Logs
        </NavLink>
        <NavLink
          to="/audit/contracts"
          className={({ isActive }) =>
            `px-4 py-3 font-semibold text-sm transition-colors flex items-center gap-2 ${
              isActive ? 'text-redtab border-b-2 border-redtab' : 'text-gray-600 hover:text-gray-900'
            }`
          }
        >
          <FileText size={16} />
          Contracts
        </NavLink>
      </div>

      <AuditLogsTab />
    </div>
  );
};

export default AuditLogsView;
