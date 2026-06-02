import React from 'react';
import { Merchant, MarketSegment } from '@/types';
import { InfrastructureMetadata } from '@/components/common';
import IdentityContact from './IdentityContact';
import OperationalIdentity from './OperationalIdentity';

interface MerchantBusinessInfoProps {
  merchant: Merchant;
}

export const MerchantBusinessInfoTab: React.FC<MerchantBusinessInfoProps> = ({ merchant }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <IdentityContact merchant={merchant} />
        <OperationalIdentity merchant={merchant} />
      </div>

      <InfrastructureMetadata
        providerId={merchant.id}
        fields={[
          { label: 'PAN Number', value: merchant.panNumber || 'Not registered' },
          { label: 'Credit Tier', value: merchant.tier || 'Not assigned', highlight: true },
        ]}
      />
    </div>
  );
};

export default MerchantBusinessInfoTab;
