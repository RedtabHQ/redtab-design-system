import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Merchant, MerchantStatus } from '@/types';
import { calculatePlatformMonths } from '@/utils/dateFormatter';
import { getCategoryName } from '../utils/merchantHelpers';
import { Goback } from '@/components/common/Goback';
import { getCreditScorePercent } from '@/utils/creditScore';
import { MerchantStatusControl } from './MerchantStatusControl';
import { Button } from '@/components';

interface MerchantDetailHeaderProps {
  merchant: Merchant;
}

export const MerchantDetailHeader: React.FC<MerchantDetailHeaderProps> = ({ merchant }) => {
  const navigate = useNavigate();
  const creditScore = merchant.creditScore ?? 0;
  const creditScorePercent = getCreditScorePercent(creditScore);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Goback link='/merchants' />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black flex items-center gap-2">
              {merchant.name}
              <ShieldCheck
                className={merchant.status === MerchantStatus.VERIFIED ? 'text-green-500' : 'text-gray-300'}
                size={24}
              />
            </h1>
            <span
              className={`px-3 py-1 rounded-xl text-2xs font-black text-white shadow-lg ${
                creditScorePercent >= 90
                  ? 'bg-green-500'
                  : creditScorePercent >= 75
                    ? 'bg-blue-500'
                    : creditScorePercent >= 60
                      ? 'bg-amber-500'
                      : 'bg-red-500'
              }`}
            >
              TIER {merchant.tier}
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">
            {getCategoryName(merchant.category) || 'Uncategorized'} • {calculatePlatformMonths(merchant.verifiedAt, merchant.onboardingDate) ?? 0} months on platform
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <MerchantStatusControl merchant={merchant} noLabel />
        <div className="flex gap-3">
          <Button variant="secondary" className="px-6 py-2.5 uppercase font-bold hover:bg-gray-50">
            Audit Trace
          </Button>
          <Button variant="primary" className="px-6 py-2.5 uppercase font-black shadow-lg transition-all">
            Adjust Policy
          </Button>
        </div>
      </div>
    </div>
  );
};
