import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Merchant } from '@/types';
import { MerchantStatus } from '@/types';
import { usePatchMerchant } from '../hooks';
import { useToastContext } from '@/components/common/ToastContainer';
import { Spinner } from '@/components/common';

interface MerchantStatusControlProps {
  merchant: Merchant;
  noLabel?: boolean;
}

export const MerchantStatusControl: React.FC<MerchantStatusControlProps> = ({ merchant, noLabel }) => {
  const { t } = useTranslation('merchants');
  const { show } = useToastContext();
  const updateMerchant = usePatchMerchant();
  const [selectedStatus, setSelectedStatus] = useState<MerchantStatus>(merchant.status ?? MerchantStatus.PENDING);

  useEffect(() => {
    setSelectedStatus(merchant.status ?? MerchantStatus.PENDING);
  }, [merchant.status]);

  const statusOptions = useMemo(
    () => [
      MerchantStatus.PENDING,
      MerchantStatus.ACTIVE,
      MerchantStatus.VERIFIED,
      MerchantStatus.SUSPENDED,
      MerchantStatus.REJECTED,
      MerchantStatus.INACTIVE,
    ],
    []
  );

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = event.target.value as MerchantStatus;
    setSelectedStatus(nextStatus);

    updateMerchant.mutate(
      { id: merchant.id, data: { status: nextStatus } },
      {
        onSuccess: () => {
          show({
            type: 'SUCCESS',
            title: t('statusUpdateSuccessTitle'),
            message: t('statusUpdateSuccess', {
              status: t(`statusOptions.${nextStatus}`, nextStatus),
            }),
          });
        },
        onError: (error) => {
          show({
            type: 'DANGER',
            title: t('statusUpdateErrorTitle'),
            message: error instanceof Error ? error.message : t('statusUpdateError'),
          });
          // revert selection if request failed
          setSelectedStatus(merchant.status ?? MerchantStatus.PENDING);
        },
      }
    );
  };

  return (
    <label className="flex flex-col text-2xs font-black text-gray-400 uppercase tracking-[0.2em]">
      { !noLabel && t('status')}
      <div className="relative mt-1">
        <select
          aria-label={t('status')}
          className="appearance-none bg-white border border-gray-200 btn px-4 py-2.5 text-xs font-bold uppercase text-gray-900 pr-10 focus:outline-none focus:ring-2 focus:ring-redtab"
          value={selectedStatus}
          disabled={updateMerchant.isPending}
          onChange={handleStatusChange}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {t(`statusOptions.${option}`, option)}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          {updateMerchant.isPending ? <Spinner size="sm" variant="secondary" /> : '▾'}
        </span>
      </div>
    </label>
  );
};
