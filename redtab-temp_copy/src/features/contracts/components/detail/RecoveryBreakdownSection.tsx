import React from 'react';
import { Banknote } from 'lucide-react';
import type { Contract } from '@/types';
import { formatDateTime } from '@/utils';
import { Amount } from '@/components/common/Amount';

interface RecoveryBreakdownSectionProps {
  contract: Contract;
}

/**
 * Displays contract recovery breakdown with principal, fees, and penalties
 */
export const RecoveryBreakdownSection: React.FC<RecoveryBreakdownSectionProps> = ({ contract }) => {
  const cur = contract.currency?.code || contract.marketSegment?.currency || 'USD';

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">
      <h3 className="text-2xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Banknote size={16} /> Recovery Breakdown ({cur})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase">Outstanding Principal</p>
          
          <Amount
            value={contract.principalDue || 0}
            currency={contract.currency?.code}
            showUSD
            mainClassName="text-3xl font-black text-gray-900"
            subClassName="text-sm text-gray-400 font-medium"
          />
          <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
            {contract.drawdownAmount ? (
              <div
                className="bg-gray-900 h-full"
                style={{
                  width: `${Math.min(100, (contract.principalDue / contract.drawdownAmount) * 100)}%`,
                }}
              />
            ) : null}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase">Accrued Fees</p>
          <Amount
            value={contract.feesDue || 0}
            currency={contract.currency?.code}
            showUSD
            mainClassName="text-3xl font-black text-indigo-600"
            subClassName="text-sm text-gray-400 font-medium"
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase">Segment Penalties</p>
          <Amount
            value={contract.currentPenalty || 0}
            currency={contract.currency?.code}
            showUSD
            mainClassName="text-3xl font-black text-red-600"
            subClassName="text-sm text-gray-400 font-medium"
          />
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded flex items-center justify-between">
        <div>
          <p className="text-2xs font-black text-gray-400 uppercase tracking-widest">Total Recovery Value</p>
          <Amount
            value={(contract.principalDue || 0) + (contract.feesDue || 0) + (contract.currentPenalty || 0)}
            currency={contract.currency?.code}
            showUSD
            mainClassName="text-2xl font-black text-gray-900"
            subClassName="text-sm text-gray-400 font-medium"
          />
        </div>
        <div className="text-right">
          <p className="text-2xs font-black text-gray-400 uppercase tracking-widest">Scheduled Due Date</p>
          <p className="text-sm font-bold text-red-600">{formatDateTime(contract.dueDate)}</p>
        </div>
      </div>
    </div>
  );
};
