import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RiskFactors {
  ageMonths?: number;
  fraudDetected?: boolean;
}

interface RiskEngineSentinelProps {
  riskFactors?: RiskFactors | null;
}

export const RiskEngineSentinel: React.FC<RiskEngineSentinelProps> = ({ riskFactors }) => {
  const ageMonths = riskFactors?.ageMonths;
  const fraudDetected = riskFactors?.fraudDetected;

  return (
    <div className="bg-amber-50 p-8 rounded-xl border border-amber-100 flex items-start gap-4">
      <AlertTriangle size={24} className="text-amber-600 shrink-0" />
      <div className="space-y-1">
        <h4 className="text-sm font-black text-amber-900 uppercase">Risk Engine Sentinel</h4>
        <p className="text-xs text-amber-800 leading-relaxed font-medium">
          {ageMonths != null ? (
            <>
              Merchant has <strong>{ageMonths} months</strong> operational history, applying a{' '}
              <strong>{ageMonths > 12 ? '1.05x Proven' : '0.9x Early'}</strong> lifecycle multiplier to
              the base score.
            </>
          ) : (
            <>Operational history data not available.</>
          )}{' '}
          {fraudDetected === false
            ? 'No fraud signals detected in current audit window.'
            : fraudDetected === true
              ? 'Fraud signals detected - review required.'
              : ''}
        </p>
      </div>
    </div>
  );
};
