import React from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Tag,
  Calendar,
  Activity,
  Shield
} from 'lucide-react';
import { Merchant, MarketSegment } from '@/types';
import { formatDateTime } from '@/utils/dateFormatter';
import { getCategoryName } from '../../utils/merchantHelpers';
import { InfoRow } from '@/components/common';

interface OperationalIdentityProps {
  merchant: Merchant;
}

const OperationalIdentity: React.FC<OperationalIdentityProps> = ({ merchant }) => {
  return (
    <div className="bg-white py-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
      <h3 className="px-10 text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Globe size={16} className="text-indigo-500" /> Operational Context
      </h3>
      <div className="space-y-4">
        <InfoRow label="Market Segment" value={`${merchant.marketSegment?.name || 'Global'} (${merchant.marketSegment?.currency || 'USD'})`} icon={Globe} />
        <InfoRow label="Industry Category" value={getCategoryName(merchant.category) || 'N/A'} icon={Tag} />
        <InfoRow label="Onboarding Date" value={merchant.onboardingDate ? formatDateTime(merchant.onboardingDate) : 'N/A'} icon={Calendar} />
        <InfoRow label="Lifecycle Status" value={merchant.status} icon={Activity} highlight />
      </div>
    </div>
  );
};

export default OperationalIdentity;
