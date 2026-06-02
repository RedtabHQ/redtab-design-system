import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditTier, Merchant } from '@/types';
import { PolicyConfig } from '@/features/merchants/hooks/usePolicyConfig';
import TenureAdjustmentSlider from '@/components/TenureAdjustmentSlider';
import DecisionButtons from './DecisionButtons';
import { getCreditScorePercent } from '@/utils/creditScore';
import { DEFAULT_GLOBAL_CURRENCY, DEFAULT_GLOBAL_CURRENCY_SYMBOL } from '@/constants/currency';
import { useCurrencyByCode } from '@/hooks/useCurrency';

interface DecisionBarProps {
  merchant: Merchant;
  recoTier: CreditTier;
  customTenure: number;
  onTenureChange: (value: number) => void;
  onTenureChangeEnd?: (value: number) => void;
  onApprove: (tier: CreditTier, forceReason?: string) => void;
  getEngineRating: (score: number) => 'A' | 'B' | 'C' | 'D';
  policyConfig: PolicyConfig | null;
  isApproving?: boolean;
}

const DecisionBar: React.FC<DecisionBarProps> = ({
  merchant,
  recoTier,
  customTenure,
  onTenureChange,
  onTenureChangeEnd,
  onApprove,
  getEngineRating,
  policyConfig,
  isApproving = false
}) => {
  const navigate = useNavigate();
  const normalizedScore = getCreditScorePercent(merchant.creditScore ?? 0);
  const currencyCode = merchant.marketSegment?.currency;
  const currencyData = useCurrencyByCode(currencyCode);
  const currencySymbol = currencyData.data?.symbol;

  return (
    <div className="bg-[#0D1117] p-4 md:p-5 rounded-xl shadow-2xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 sticky top-4 z-20">
      <div className="flex items-center gap-4 md:gap-6 min-w-0">
        <button
          onClick={() => navigate('/decisioning-workbench')}
          className="p-3 cursor-pointer bg-white/5 hover:bg-white/10 rounded text-white transition-all border border-white/5 shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-black text-white leading-none tracking-tight truncate">
            {merchant.name}
          </h2>
          <div className="flex items-center gap-2 mt-1.5 mb-4">
            <Sparkles size={12} className="text-indigo-400 shrink-0" />
            <p className="text-2xs font-black text-indigo-400 uppercase tracking-widest whitespace-nowrap">
              ENGINE RATING: {getEngineRating(normalizedScore)}
            </p>
          </div>
          <TenureAdjustmentSlider value={customTenure} onChange={onTenureChange} onChangeEnd={onTenureChangeEnd} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-8 shrink-0">
        <DecisionButtons
          onChange={onApprove}
          onClose={() => navigate('/decisioning-workbench')}
          recoTier={recoTier}
          currentTier={merchant.tier}
          merchantCreditScore={merchant.creditScore ?? 0}
          policyConfig={policyConfig}
          currency={currencyCode || ''}
          currencySymbol={currencySymbol}
          isLoading={isApproving}
        />
      </div>
    </div>
  );
};

export default DecisionBar;
