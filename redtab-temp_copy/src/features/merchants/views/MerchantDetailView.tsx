import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useActiveMarketSegments } from '@/hooks';
import { useMerchant, useRiskExplanation } from '../hooks';
import {
  MerchantOverviewTab,
  MerchantTransactionsTab,
  MerchantBusinessInfoTab,
  MerchantTrustScoreTab,
  MerchantKycTab,
  MerchantDetailHeader,
  MerchantDetailSidebar,
} from '../components';
import { Goback } from '@/components/common/Goback';
import { TabNavigation, type Tab } from '@/components/common';

const MERCHANT_TABS_LIST: Tab[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'business-info', label: 'Business Info' },
  { key: 'trust-score', label: 'Trust Score' },
  { key: 'kyc', label: 'Kyc' },
];
const MERCHANT_TAB_KEYS = MERCHANT_TABS_LIST.map((t) => t.key);

const MerchantDetailView: React.FC = () => {
  const { merchantId, tab } = useParams<{ merchantId: string; tab?: string }>();
  const navigate = useNavigate();

  const { data: merchant, isLoading, error } = useMerchant(merchantId ?? '');
  const { data: marketSegments = [] } = useActiveMarketSegments();
  const { data: aiSummary, isLoading: isLoadingAi } = useRiskExplanation(merchant);

  const normalizedTab = tab && MERCHANT_TAB_KEYS.includes(tab) ? tab : null;
  const activeTab: string = normalizedTab ?? 'overview';

  useEffect(() => {
    if (tab && !normalizedTab && merchantId) {
      navigate(`/merchants/${merchantId}`, { replace: true });
    }
  }, [tab, normalizedTab, merchantId, navigate]);

  const handleTabChange = (nextTab: string) => {
    if (!merchantId || nextTab === activeTab) return;
    navigate(nextTab === 'overview' ? `/merchants/${merchantId}` : `/merchants/${merchantId}/${nextTab}`);
  };

  // Validate merchantId early
  if (!merchantId) {
    return (
      <div className="mx-auto space-y-8 pb-20">
        <Goback link='/merchants' />
        <div className="flex items-center justify-center min-h-96 bg-amber-50 rounded-xl border border-amber-200">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-amber-900">Invalid Merchant ID</h2>
            <p className="text-amber-700 text-sm mt-2">No merchant ID provided in URL</p>
            <button
              onClick={() => navigate('/merchants')}
              className="mt-6 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Back to Merchants
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto space-y-8 pb-20">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !merchant) {
    return (
      <div className="mx-auto space-y-8 pb-20">
        <Goback link='/merchants' />
        <div className="flex items-center justify-center min-h-96 bg-red-50 rounded-xl border border-red-200">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-900">Failed to load merchant</h2>
            <p className="text-red-700 text-sm mt-2">
              {error instanceof Error ? error.message : 'Merchant not found'}
            </p>
            <button
              onClick={() => navigate('/merchants')}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Merchants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <MerchantDetailHeader merchant={merchant} />

      {/* Tabs Navigation */}
      <TabNavigation tabs={MERCHANT_TABS_LIST} activeTab={activeTab} onTabChange={handleTabChange} />

      <MerchantDetailSidebar merchant={merchant} aiSummary={aiSummary?.content || null} isLoadingAi={isLoadingAi} />

      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'overview' && <MerchantOverviewTab merchant={merchant} merchantId={merchantId} />}
        {activeTab === 'transactions' && <MerchantTransactionsTab merchantId={merchantId} />}
        {activeTab === 'business-info' && <MerchantBusinessInfoTab merchant={merchant} />}
        {activeTab === 'trust-score' && <MerchantTrustScoreTab merchant={merchant} />}
        {activeTab === 'kyc' && <MerchantKycTab merchant={merchant} />}
      </div>
    </div>
  );
};

export default MerchantDetailView;
