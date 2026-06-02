import React from 'react';
import { Sparkles } from 'lucide-react';

export const CurrencyContextInfo: React.FC = () => {
  return (
    <div className="p-8 bg-white border border-gray-100 rounded-xl shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-redtab">
        <Sparkles size={18} />
        <h4 className="text-2xs font-black uppercase tracking-widest">Currency Context Aware</h4>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed font-medium">
        Redtab Pay Later automatically formats all Merchant Portal interactions into the merchant's local legal tender based on their assigned region.
      </p>
    </div>
  );
};
