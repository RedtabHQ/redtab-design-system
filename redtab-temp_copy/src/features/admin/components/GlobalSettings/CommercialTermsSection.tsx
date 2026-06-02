import React from 'react';
import { DollarSign, Zap, CalendarDays } from 'lucide-react';
import { PolicySlider } from '../PolicyConfig/PolicySlider';
import { formatCurrencyAbbreviated } from '@/utils/currencyFormatter';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';

interface CommercialTermsSectionProps {
  maxLimit: number;
  feeRate: number;
  maxTenure: number;
  currency: string;
  currencySymbol: string;
  isGlobal: boolean;
  onMaxLimitChange: (value: number) => void;
  onFeeRateChange: (value: number) => void;
  onMaxTenureChange: (value: number) => void;
}

const CommercialTermsSection: React.FC<CommercialTermsSectionProps> = ({
  maxLimit,
  feeRate,
  maxTenure,
  currency,
  currencySymbol,
  isGlobal,
  onMaxLimitChange,
  onFeeRateChange,
  onMaxTenureChange,
}) => {

  return (
    <div className="space-y-6">
      <p className="text-2xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">
        Commercial Terms
      </p>
      <div className="space-y-6">
        <PolicySlider
          label="Maximum Credit Limit"
          icon={DollarSign}
          value={maxLimit}
          min={0}
          max={isGlobal ? 5000 : 500000}
          step={isGlobal ? 100 : 10000}
          format={(v: number) => formatCurrencyAbbreviated(v, currency, currencySymbol)}
          onChange={onMaxLimitChange}
        />
        <PolicySlider
          label="Base Processing Fee"
          icon={Zap}
          value={feeRate * 100}
          min={0}
          max={10}
          step={0.1}
          format={(v: number) => `${v.toLocaleString(DEFAULT_CURRENCY_LOCALE, { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%`}
          onChange={(val: number) => onFeeRateChange(val / 100)}
        />
        <PolicySlider
          label="Standard Repayment Tenure"
          icon={CalendarDays}
          value={maxTenure}
          min={7}
          max={90}
          step={1}
          format={(v: number) => `${v} Days`}
          onChange={onMaxTenureChange}
          accentColor="accent-indigo-500"
        />
      </div>
    </div>
  );
};

export default CommercialTermsSection;
