import React from 'react';
import {
  User,
  Mail,
  Phone,
  Building2} from 'lucide-react';
import { Merchant, MarketSegment } from '@/types';
import { InfoRow } from '@/components/common';

interface MerchantBusinessInfoProps {
  merchant: Merchant;
  activeRegion?: MarketSegment;
}

const MerchantBusinessInfo: React.FC<MerchantBusinessInfoProps> = ({ merchant, activeRegion }) => {
  return (
    <div className="bg-white py-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
      <h3 className="px-10 text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <User size={16} className="text-redtab" /> Identity & Contact
      </h3>
      <div className="space-y-4">
        <InfoRow label="Principal Director" value={merchant.contactPerson} icon={User} />
        <InfoRow label="Direct Email" value={merchant.email} icon={Mail} />
        <InfoRow label="Phone Connection" value={merchant.phone} icon={Phone} />
        <InfoRow label="Legal Entity Name" value={merchant.name} icon={Building2} />
      </div>
    </div>
  );
};

export default MerchantBusinessInfo;
