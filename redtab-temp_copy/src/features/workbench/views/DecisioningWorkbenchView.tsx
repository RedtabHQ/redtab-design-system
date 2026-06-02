import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gavel,
  Search,
  ArrowRight,
  Clock,
  MapPin
} from 'lucide-react';
import { useMerchants, usePolicyConfig } from '@/features/merchants/hooks';
import { CreditTier } from '@/types';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import FilterTierButtons from '@/components/FilterTierButtons';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getCategoryName } from '@/features/merchants/utils/merchantHelpers';
import { getCreditScorePercent } from '@/utils/creditScore';
import { PageHeader } from '@/components/common/PageHeader';

const DecisioningWorkbenchView: React.FC = () => {
  const navigate = useNavigate();
  const [filterTier, setFilterTier] = useState<'ALL' | 'T1' | 'T2' | 'T3' | 'NONE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const { selectedSegment } = useMarketSegment();
  const { data: filteredQueue, isLoading: isMerchantsLoading } = useMerchants({
    status: 'PENDING',
    tier: filterTier === 'ALL' || filterTier === 'NONE' ? undefined : filterTier,
    marketSegmentId: selectedSegment?.id
  });

  const { data: policyConfig } = usePolicyConfig();

  const getEngineRating = (score: number): 'A' | 'B' | 'C' | 'D' => {
    const normalizedScore = getCreditScorePercent(score);
    if (!policyConfig) return 'D';
    if (normalizedScore >= policyConfig.TIERS[CreditTier.T1]?.minScore) return 'A';
    if (normalizedScore >= policyConfig.TIERS[CreditTier.T2]?.minScore) return 'B';
    if (normalizedScore >= policyConfig.TIERS[CreditTier.T3]?.minScore) return 'C';
    return 'D';
  };

  const getRecommendedTier = (score: number): CreditTier => {
    const rating = getEngineRating(score);
    const mapping = { A: CreditTier.T1, B: CreditTier.T2, C: CreditTier.T3, D: CreditTier.NONE };
    return mapping[rating];
  };

  // Filter merchants by search term
  const filteredMerchants = (filteredQueue?.items ?? []).filter((merchant) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      merchant.name.toLowerCase().includes(searchLower) ||
      (merchant.email && merchant.email.toLowerCase().includes(searchLower)) ||
      (merchant.businessName && merchant.businessName.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <PageHeader
        icon={<Gavel className="text-redtab" size={40} strokeWidth={2.5} />}
        title={!selectedSegment ? 'Underwriting Workbench' : `${selectedSegment.name} Underwriting`}
        subtitle={`${filteredQueue?.meta?.total || 0} applications awaiting regional risk determination.`}
        actions={
          <div className="bg-white px-6 py-4 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-2.5 bg-red-50 text-redtab rounded">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-2xs font-black text-gray-400 uppercase tracking-widest leading-none">Avg. Decision Time</p>
              <p className="text-xl font-black text-gray-900 mt-1">42m</p>
            </div>
          </div>
        }
      />


      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-redtab transition-colors" size={20} />
          <input
            type="text"
            placeholder="Filter application queue..."
            className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-transparent rounded-lg text-sm font-medium outline-none focus:bg-white focus:border-red-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <FilterTierButtons filterTier={filterTier} onTierChange={setFilterTier} />
      </div>

      <div className="space-y-4">
        {isMerchantsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden animate-pulse"
              >
                <div className="flex items-center gap-6 flex-1 min-w-0 w-full">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="flex items-center gap-4">
                      <div className="h-4 bg-gray-100 rounded w-1/4" />
                      <div className="w-1 h-1 bg-gray-300 rounded-full" />
                      <div className="h-4 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12 shrink-0 w-full md:w-auto md:justify-end">
                  <div className="text-right min-w-[120px]">
                    <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                    <div className="h-6 bg-gray-200 rounded w-full" />
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredMerchants.length > 0 ? filteredMerchants.map((merchant) => {
          const creditScore = merchant.creditScore ?? 0;
          const normalizedScore = getCreditScorePercent(creditScore);
          const reco = getRecommendedTier(normalizedScore);
          const rating = getEngineRating(normalizedScore);
          return (
            <div
              key={merchant.id}
              onClick={() => {
                navigate(`/decisioning-workbench/${merchant.id}`);
              }}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all group cursor-pointer flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
            >
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="w-16 h-16 rounded bg-gray-900 text-white flex items-center justify-center font-black text-xl shadow-lg group-hover:bg-redtab transition-colors shrink-0">
                  {merchant.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-gray-900 truncate tracking-tight">{merchant.name}</h3>
                    <StatusBadge type="credit" status={rating} />
                  </div>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><MapPin size={12} /> {getCategoryName(merchant.category) || 'Uncategorized'}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-2xs font-black text-gray-400 uppercase tracking-widest">{merchant.currency?.code} Segment</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12 shrink-0">
                <div className="text-right min-w-[120px]">
                  <p className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-1">Policy Recommendation</p>
                  <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-xs+ font-black uppercase tracking-widest border ${reco === CreditTier.NONE ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-900 text-white border-gray-900 shadow-lg'
                    }`}>
                    {reco === CreditTier.NONE ? 'REJECT' : reco}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded text-gray-400 group-hover:bg-redtab group-hover:text-white transition-all">
                  <ArrowRight size={24} strokeWidth={3} />
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="py-32 text-center bg-white rounded-xl border border-gray-100 border-dashed">
            <Search size={40} className="mx-auto mb-6 text-gray-200" />
            <h4 className="text-xl font-black text-gray-900">Application Queue Clear</h4>
            <p className="text-gray-400 font-medium">No pending regional reviews found for current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisioningWorkbenchView;
