import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, History } from 'lucide-react';
import AuditContractsTab from './AuditContractsTab';

const AuditContractsView: React.FC = () => {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-3 text-gray-900">
            <FileText className="text-redtab" size={28} /> Contracts Management
          </h1>
          <p className="text-gray-500 font-medium">View and manage all loan contracts.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <NavLink
          to="/audit/logs"
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
          end
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

      <AuditContractsTab />
    </div>
  );
};

export default AuditContractsView;
