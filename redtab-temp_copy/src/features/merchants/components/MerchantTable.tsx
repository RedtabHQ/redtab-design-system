import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { Merchant, MerchantStatus, CreditTier } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CreditScoreBar } from '@/features/credit/components/CreditScoreBar';
import { Table } from '@/components/common/Table';
import { getCategoryName } from '../utils/merchantHelpers';
import { useExchangeRateContext } from '@/contexts/ExchangeRateContext';
import { DEFAULT_CURRENCY_LOCALE, DEFAULT_GLOBAL_CURRENCY_SYMBOL } from '@/constants/currency';
import { Amount } from '@/components/common/Amount';

interface MerchantTableProps {
  merchants: Merchant[];
  regions: { id: string; name: string; currency: string }[];
  onMerchantClick: (merchantId: string) => void;
  emptyMessage?: React.ReactNode;
}

export const MerchantTable: React.FC<MerchantTableProps> = ({
  merchants,
  onMerchantClick,
  emptyMessage
}) => {
  const { t } = useTranslation('merchants');

  const columns = [
    {
      key: 'name' as keyof Merchant,
      label: t('table.merchantEntity'),
      render: (_value: unknown, merchant: Merchant) => (
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded bg-gray-900 text-white flex items-center justify-center font-black text-xs hover:bg-redtab transition-colors shadow-lg">
            {merchant?.name?.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 hover:text-redtab transition-colors">{merchant?.name}</p>
            <p className="text-2xs text-gray-400 font-mono mt-0.5">{getCategoryName(merchant?.category) || t('table.uncategorized')}</p>
          </div>
        </div>
      ),
      width: 'px-8 py-5'
    },
    {
      key: 'status' as keyof Merchant,
      label: t('table.lifecycleStatus'),
      render: (_value: unknown, merchant: Merchant) => <StatusBadge type="merchant" status={merchant.status as MerchantStatus} />,
      width: 'px-6 py-5'
    },
    {
      key: 'tier' as keyof Merchant,
      label: t('table.riskTier'),
      render: (_value: unknown, merchant: Merchant) => <StatusBadge type="tier" status={merchant.tier as string} />,
      width: 'px-6 py-5'
    },
    {
      key: 'creditScore' as keyof Merchant,
      label: t('table.creditConfidence'),
      render: (_value: unknown, merchant: Merchant) => <CreditScoreBar score={merchant.creditScore as number} />,
      width: 'px-6 py-5'
    },
    {
      key: 'currency' as keyof Merchant,
      label: t('table.region'),
      render: (_value: unknown, merchant: Merchant) => {
        const { marketSegment } = merchant;
        return (
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-indigo-100 flex items-center justify-center text-[8px] font-black text-indigo-600 uppercase">{marketSegment?.currency}</span>
            <span className="text-xs font-bold text-indigo-600">{marketSegment?.name}</span>
          </div>
        );
      },
      width: 'px-6 py-5'
    },
    {
      key: 'id' as keyof Merchant,
      label: t('table.outstandingLoanAmount'),
      render: (_value: unknown, merchant: Merchant) => {
        const nativeAmount = merchant.outstandingLoanAmount ?? 0;

        return (
          <Amount value={nativeAmount} currency={merchant.marketSegment?.currency} symbol={merchant.marketSegment?.currencySymbol} showUSD />
        );
      },
      width: 'px-6 py-5'
    },
    {
      key: 'actions' as keyof Merchant,
      label: t('table.drillDown'),
      render: (_value: unknown, merchant: Merchant) => (
        <button
          className="p-2 cursor-pointer text-gray-300 hover:text-redtab hover:bg-red-50 rounded-xl transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onMerchantClick(merchant.id);
          }}
        >
          <Eye size={20} />
        </button>
      ),
      width: 'px-8 py-5 text-right'
    }
  ];

  // Filter out any undefined/null items to prevent render errors
  const validMerchants = merchants.filter((m): m is Merchant => m != null && typeof m === 'object');

  return (
    <Table<Merchant>
      columns={columns}
      data={validMerchants}
      keyExtractor={(merchant) => merchant.id}
      emptyMessage={emptyMessage || t('table.noRecordsFound')}
      onRowClick={(merchant) => onMerchantClick(merchant.id)}
      headerClassName="bg-gray-50/50 text-gray-400 text-2xs uppercase tracking-widest font-black border-b border-gray-100"
      rowClassName="hover:bg-gray-50/50 transition-colors group"
      containerClassName="overflow-x-auto"
    />
  );
};
