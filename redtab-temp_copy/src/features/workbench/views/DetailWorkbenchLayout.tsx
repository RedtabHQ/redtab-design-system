import React, { useState, useEffect } from 'react';
import { Building2, Search, Route as RouteIcon, FileText } from 'lucide-react';
import { Spinner } from '@/components/common';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import { useMerchant, usePolicyConfig, useMerchantLinkedSuppliers, usePatchMerchant } from '@/features/merchants/hooks';
import { getCreditScorePercent } from '@/utils/creditScore';
import DecisionBar from '../components/DecisionBar';
import AIMemoCard from '../components/AIMemoCard';
import ExposureColumn from '../components/ExposureColumn';
import TabButton from '@/features/contracts/components/TabButton';
import { useEngineRating } from '../hooks/useEngineRating';
import { useWorkbenchTabs } from '../hooks/useWorkbenchTabs';
import { useMerchantApproval } from '../hooks/useMerchantApproval';
import { useAIMemo } from '../hooks/useAIMemo';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { useToastContext } from '@/components/common/ToastContainer';

const DetailWorkbenchLayout: React.FC = () => {
  const { merchantId } = useParams<{ merchantId: string }>();
  const { show: showToast } = useToastContext();
  const [customTenure, setCustomTenure] = useState<number>(30);
  const [initialTenure, setInitialTenure] = useState<number>(30);
  const [pendingTenure, setPendingTenure] = useState<number | null>(null);
  const [showTenureConfirm, setShowTenureConfirm] = useState(false);

  // Data hooks - query merchant directly by ID
  const { data: selectedMerchant, isLoading: isMerchantLoading } = useMerchant(merchantId!, { enabled: !!merchantId });
  const { data: suppliersData, isLoading: isSuppliersLoading, error: suppliersError } = useMerchantLinkedSuppliers(merchantId, { pageSize: 100 });
  const { data: policyConfig, isLoading: isPolicyLoading } = usePolicyConfig();

  const suppliers = suppliersData?.items || [];

  // Mutation hook for updating tenure
  const patchMerchant = usePatchMerchant();

  // Handle tenure change - update UI immediately (while dragging)
  const handleTenureChange = (newTenure: number) => {
    setCustomTenure(newTenure);
  };

  // Handle tenure change end - show confirmation dialog when user releases slider
  const handleTenureChangeEnd = (newTenure: number) => {
    if (newTenure !== initialTenure) {
      setPendingTenure(newTenure);
      setShowTenureConfirm(true);
    }
  };

  // Confirm tenure update and call API
  const handleConfirmTenureUpdate = async () => {
    if (!merchantId || pendingTenure === null) return;

    try {
      await patchMerchant.mutateAsync({
        id: merchantId,
        data: { tenureDays: pendingTenure }
      });

      setInitialTenure(pendingTenure);
      setShowTenureConfirm(false);
      setPendingTenure(null);

      showToast({
        type: 'SUCCESS',
        title: 'Tenure Updated',
        message: `Tenure adjustment has been updated to ${pendingTenure} days.`
      });
    } catch {
      // Revert UI state on failure
      setCustomTenure(initialTenure);
      setShowTenureConfirm(false);
      setPendingTenure(null);

      showToast({
        type: 'DANGER',
        title: 'Update Failed',
        message: 'Failed to update tenure adjustment. Please try again.'
      });
    }
  };

  // Cancel tenure update - revert to initial value
  const handleCancelTenureUpdate = () => {
    setCustomTenure(initialTenure);
    setShowTenureConfirm(false);
    setPendingTenure(null);
  };

  // Custom hooks
  const { getEngineRating, getRecommendedTier } = useEngineRating();
  const { getActiveTab, handleTabClick } = useWorkbenchTabs(merchantId);
  const { approveMerchant, isApproving } = useMerchantApproval({
    merchantId,
    selectedMerchant,
    policyConfig
  });
  const { handleAIDecision, isAnalyzing, memo } = useAIMemo({ selectedMerchant });

  // Sync tenure state with merchant data when loaded
  useEffect(() => {
    if (selectedMerchant?.tenureDays) {
      setCustomTenure(selectedMerchant.tenureDays);
      setInitialTenure(selectedMerchant.tenureDays);
    }
  }, [selectedMerchant?.id, selectedMerchant?.tenureDays]);

  // Auto-trigger AI Memo when merchant data is loaded (only once per merchant)
  useEffect(() => {
    if (selectedMerchant && !memo && !isAnalyzing) {
      handleAIDecision();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only trigger once when merchant changes
  }, [selectedMerchant?.id]);

  // Validation checks
  if (!merchantId) {
    return <Navigate to="/decisioning-workbench" replace />;
  }

  if (isPolicyLoading || isMerchantLoading || !selectedMerchant || !policyConfig) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Spinner size="lg" variant="primary" />
          <p className="text-gray-600 font-medium">Loading underwriting data...</p>
        </div>
      </div>
    );
  }

  const normalizedScore = getCreditScorePercent(selectedMerchant.creditScore ?? 0);
  const recoTier = getRecommendedTier(normalizedScore);
  const activeTab = getActiveTab();

  return (
    <div className="mx-auto space-y-8 animate-in zoom-in-95 fade-in duration-500 pb-24">
      {/* Decision Bar */}
      <DecisionBar
        merchant={selectedMerchant}
        recoTier={recoTier}
        customTenure={customTenure}
        onTenureChange={handleTenureChange}
        onTenureChangeEnd={handleTenureChangeEnd}
        onApprove={approveMerchant}
        getEngineRating={getEngineRating}
        policyConfig={policyConfig}
        isApproving={isApproving}
      />

      {/* AI Memo Card */}
      <AIMemoCard memo={memo} isAnalyzing={isAnalyzing} onRefresh={handleAIDecision} />


      {/* Right Column / Exposure */}
      <ExposureColumn merchant={selectedMerchant} />


      <div className="grid grid-cols-1 gap-8 items-start">
        {/* Left/Main Column */}
        <div className="lg:col-span-8 space-y-8">

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex bg-gray-50/50 border-b border-gray-100">
              <TabButton id="profile" label="Entity Profile" icon={Building2} activeTab={activeTab} onClick={handleTabClick} />
              <TabButton id="scoring" label="Trust Signals" icon={Search} activeTab={activeTab} onClick={handleTabClick} />
              <TabButton id="suppliers" label="Supply Health" icon={RouteIcon} activeTab={activeTab} onClick={handleTabClick} />
              <TabButton id="kyc" label="Policy Vault" icon={FileText} activeTab={activeTab} onClick={handleTabClick} />
            </div>

            <div className="p-10">
              <Outlet context={{ merchant: selectedMerchant, suppliers, isSuppliersLoading, suppliersError }} />
            </div>
          </div>
        </div>

      </div>

      {/* Tenure Update Confirmation Modal */}
      <ConfirmationModal
        isOpen={showTenureConfirm}
        title="Update Tenure Adjustment"
        message={`Are you sure you want to update the specific tenure adjustment from ${initialTenure} days to ${pendingTenure} days for ${selectedMerchant.name}?`}
        confirmText="Update Tenure"
        cancelText="Cancel"
        isLoading={patchMerchant.isPending}
        onConfirm={handleConfirmTenureUpdate}
        onCancel={handleCancelTenureUpdate}
      />
    </div>
  );
};

export default DetailWorkbenchLayout;
