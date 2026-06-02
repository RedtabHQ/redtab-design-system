import React from 'react';
import { Building2 } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  currency?: string;
}

interface SupplierSelectionProps {
  value: string;
  onChange: (supplierId: string) => void;
  suppliers: Supplier[];
  merchantCurrency?: string;
  disabled?: boolean;
  className?: string;
}

const SupplierSelection: React.FC<SupplierSelectionProps> = ({
  value,
  onChange,
  suppliers,
  merchantCurrency,
  disabled = false,
  className = ''
}) => {
  const filteredSuppliers = merchantCurrency
    ? suppliers.filter(s => s.currency === merchantCurrency)
    : suppliers;

  return (
    <div className={`relative ${className}`}>
      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
      <select 
        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded text-sm font-bold outline-none focus:ring-2 focus:ring-redtab appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || filteredSuppliers.length === 0}
      >
        <option value="">Select Supplier...</option>
        {filteredSuppliers.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
    </div>
  );
};

export default SupplierSelection;
