import React from 'react';
import { Info } from 'lucide-react';
import { DecompositionRow } from './DecompositionRow';

interface CapacityIndicators {
  bankCashFlow?: number;
  posConsistency?: number;
  inventoryTurnover?: number;
  operationalTenure?: number;
  profitabilityMargins?: number;
}

interface IntentionIndicators {
  paymentHistory?: number;
  paymentRatio?: number;
  dpdControls?: number;
  commResponsiveness?: number;
  socialReputation?: number;
}

interface ScoreDecompositionProps {
  capacityScore?: number | null;
  intentionScore?: number | null;
  capacityIndicators?: CapacityIndicators | null;
  intentionIndicators?: IntentionIndicators | null;
}

export const ScoreDecomposition: React.FC<ScoreDecompositionProps> = ({
  capacityScore,
  intentionScore,
  capacityIndicators,
  intentionIndicators,
}) => {
  const hasScoreData = capacityScore != null || intentionScore != null;

  return (
    <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Sub-Score Decomposition</h3>
        {!hasScoreData && (
          <div className="flex items-center gap-2 text-amber-600">
            <Info size={14} />
            <span className="text-2xs font-bold">Score data not available</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <p className="text-2xs font-black text-redtab uppercase tracking-widest border-b border-red-50 pb-2">
            Capacity Indicators
            {capacityScore != null && (
              <span className="ml-2 text-gray-400">({capacityScore}%)</span>
            )}
          </p>
          <DecompositionRow label="Bank Cash Flow" score={capacityIndicators?.bankCashFlow} />
          <DecompositionRow label="POS Consistency" score={capacityIndicators?.posConsistency} />
          <DecompositionRow label="Inventory Turnover" score={capacityIndicators?.inventoryTurnover} />
          <DecompositionRow label="Operational Tenure" score={capacityIndicators?.operationalTenure} />
          <DecompositionRow label="Profitability Margins" score={capacityIndicators?.profitabilityMargins} />
        </div>
        <div className="space-y-6">
          <p className="text-2xs font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">
            Intention Indicators
            {intentionScore != null && (
              <span className="ml-2 text-gray-400">({intentionScore}%)</span>
            )}
          </p>
          <DecompositionRow label="Payment History" score={intentionIndicators?.paymentHistory} />
          <DecompositionRow label="Payment Ratio" score={intentionIndicators?.paymentRatio} />
          <DecompositionRow label="DPD Controls" score={intentionIndicators?.dpdControls} />
          <DecompositionRow label="Comm Responsiveness" score={intentionIndicators?.commResponsiveness} />
          <DecompositionRow label="Social Reputation" score={intentionIndicators?.socialReputation} />
        </div>
      </div>
    </div>
  );
};
