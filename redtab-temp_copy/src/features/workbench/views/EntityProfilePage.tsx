import React, { useMemo } from 'react';
import { Building2, MapPin, ExternalLink } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import type { Merchant } from '@/types';
import MerchantProfileDetails from '@/features/merchants/components/MerchantProfileDetails';
import ComplianceRadar from '@/features/portfolio/components/ComplianceRadar';
import { complianceService } from '@/features/workbench/services/complianceApi';
import { getCategoryName } from '@/features/merchants/utils/merchantHelpers';

interface OutletContext {
  merchant: Merchant;
}

export const EntityProfilePage: React.FC = () => {
  const { merchant } = useOutletContext<OutletContext>();

  // Get compliance checks from merchant data
  const complianceData = useMemo(() => {
    return complianceService.getComplianceChecks(merchant);
  }, [merchant]);

  return (
    <div className="space-y-12 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-900 rounded-xl flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-2xl shrink-0">
          {merchant.name.charAt(0)}
        </div>
        <div className="space-y-2 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900">{merchant.name}</h3>
            <span className="text-xs font-bold text-gray-400">@ {merchant.providerId}</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <MapPin size={14} className="text-gray-400 shrink-0" />
              <span className="text-xs font-bold text-gray-500">{getCategoryName(merchant.category) || 'Uncategorized'} • SME Entity</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-green-50 text-green-600 text-3xs font-black uppercase rounded-lg border border-green-100">ACTIVE BUSINESS</span>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-3xs font-black uppercase rounded-lg border border-blue-100">VERIFIED ADDRESS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:gap-12">
        <MerchantProfileDetails
          merchantId={merchant.providerId || merchant.id}
          contactPerson={merchant.contactPerson || 'N/A'}
          onboardingDate={merchant.onboardingDate || merchant.createdAt || new Date().toISOString()}
          vatPan={merchant.panNumber || "609912233"}
          directorInfo={{
            name: 'Aditya Raj Khadka',
            shareholding: '100%'
          }}
          boardStatus={{
            status: 'Clean Background',
            description: 'No litigations found.'
          }}
        />

        <div className="space-y-6">
          <ComplianceRadar items={complianceData.items} />
          <div className="bg-amber-50/50 p-8 rounded border border-amber-100/50 space-y-4">
            <h4 className="text-2xs font-black text-amber-900/60 uppercase tracking-widest flex items-center gap-2"><Building2 size={14} /> PHYSICAL SITE VERIFICATION</h4>
            <p className="text-xs+ text-amber-900/70 font-medium leading-relaxed italic">
              Verification Agent visited on <span className="font-black">May 12</span>. Warehouse and storefront confirmed at registered location. Footfall observed: High.
            </p>
            <button className="text-2xs font-black text-amber-900/40 hover:text-redtab flex items-center gap-1.5 uppercase tracking-widest transition-colors">
              View Visit Photo Log <ExternalLink size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityProfilePage;
