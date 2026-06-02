import React from 'react';
import { User, Globe, ShieldCheck, Mail, Phone, Building2, Calendar, Tag } from 'lucide-react';
import { InfoRow, InfrastructureMetadata } from '@/components/common';
import { formatDateTime } from '@/utils/dateFormatter';
import { MarketSegment, Supplier, SupplierCategory } from '@/types';
import { getCategoryName } from '@/features/merchants/utils/merchantHelpers';

type BusinessInfoSectionProps = {
  supplier: Supplier;
  activeRegion?: MarketSegment;
};

export const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({
  supplier,
  activeRegion,
}) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="px-10 text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 p-2">
          <User size={16} className="text-redtab" /> Identity & Contact
        </h3>
        <div className="space-y-4">
          <InfoRow label="Liaison Manager" value={supplier.contactPerson} icon={User} />
          <InfoRow label="Operational Email" value={supplier.email} icon={Mail} />
          <InfoRow label="Direct Phone" value={supplier.phone} icon={Phone} />
          <InfoRow label="Legal Partner Name" value={supplier.name} icon={Building2} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 p-2">
          <Globe size={16} className="text-indigo-500" /> Commercial Identity
        </h3>
        <div className="space-y-4">
          <InfoRow label="Market Presence" value={activeRegion && `${activeRegion?.name || 'Global'} (${activeRegion.currency})`} icon={Globe} />
          <InfoRow label="Supply Category" value={getCategoryName(supplier.category) || 'Not assigned'} icon={Tag} />
          <InfoRow label="Onboarding Date" value={formatDateTime(supplier.onboardingDate)} icon={Calendar} />
          <InfoRow label="Verification Status" value={supplier.isVerified ? 'VERIFIED' : 'PENDING'} icon={ShieldCheck} highlight />
        </div>
      </div>
    </div>

    <InfrastructureMetadata
      providerId={supplier.id}
      fields={[
        { label: 'Registered Bank Acc', value: supplier.banking?.bankAccount || 'Not set' },
        { label: 'Payment Integrity', value: '100% SUCCESS RATE', highlight: true },
      ]}
    />
  </div>
);