import React from 'react';
import { useSettlementRails } from '@/features/settlement/hooks/useSettlement';

export interface Region {
  id: string;
  name: string;
  currency: string;
}

interface PaymentRailSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
}

const PaymentRailSelector: React.FC<PaymentRailSelectorProps> = ({
  value,
  onChange,
  className = '',
  error
}) => {
  const { data: railsResponse, isLoading, error: loadError } = useSettlementRails();
  const paymentChannels = railsResponse ?? [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="text-2xs font-black text-gray-400 uppercase tracking-widest px-1">Preferred Settlement Rail</label>
      <select
        className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl text-sm font-bold outline-none focus:ring-2 transition-all ${
          error || loadError
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-100 focus:ring-redtab'
        } ${className}`}
        value={value}
        onChange={handleChange}
        disabled={isLoading}
      >
        <option value="">🤖 Automated Path Optimization</option>
        {isLoading ? (
          <option disabled>Loading channels...</option>
        ) : (
          paymentChannels
            .map((p) => (
              <option key={p.id} value={p.id}>🏛️ {p.railName}</option>
            ))
        )}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {loadError && <p className="mt-1 text-xs text-red-600">{loadError.message}</p>}
    </div>
  );
};

export default PaymentRailSelector;
