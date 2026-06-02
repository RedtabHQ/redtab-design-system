import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Supplier } from '../types';
import { usePatchSupplier } from '../hooks/useSuppliers';
import { useToastContext } from '@/components/common/ToastContainer';
import { Spinner } from '@/components/common';

interface SupplierStatusControlProps {
  supplier: Supplier;
  noLabel?: boolean;
}

type SupplierLifecycleStatus = 'ACTIVE' | 'BLOCKED';

export const SupplierStatusControl: React.FC<SupplierStatusControlProps> = ({ supplier, noLabel }) => {
  const { t } = useTranslation('suppliers');
  const { show } = useToastContext();
  const patchSupplier = usePatchSupplier();
  const [status, setStatus] = useState<SupplierLifecycleStatus>((supplier.status as SupplierLifecycleStatus) ?? 'ACTIVE');

  useEffect(() => {
    setStatus((supplier.status as SupplierLifecycleStatus) ?? 'ACTIVE');
  }, [supplier.status]);

  const statusOptions = useMemo(
    () => [
      { value: 'ACTIVE' as SupplierLifecycleStatus, label: t('active') },
      { value: 'BLOCKED' as SupplierLifecycleStatus, label: t('blocked', 'Blocked') },
    ],
    [t]
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = event.target.value as SupplierLifecycleStatus;
    setStatus(nextStatus);

    patchSupplier.mutate(
      { id: supplier.id, data: { status: nextStatus } },
      {
        onSuccess: () => {
          show({
            type: 'SUCCESS',
            title: t('statusUpdateSuccessTitle'),
            message: t('statusUpdateSuccess', { status: t(nextStatus === 'ACTIVE' ? 'active' : 'blocked', nextStatus) }),
          });
        },
        onError: (error) => {
          show({
            type: 'DANGER',
            title: t('statusUpdateErrorTitle'),
            message: error instanceof Error ? error.message : t('statusUpdateError'),
          });
          setStatus((supplier.status as SupplierLifecycleStatus) ?? 'ACTIVE');
        },
      }
    );
  };

  return (
    <label className="flex flex-col text-2xs font-black text-gray-400 uppercase tracking-[0.2em]">
      { !noLabel && t('status')}
      <div className="relative">
        <select
          aria-label={t('status')}
          className="appearance-none font-bold btn bg-white border border-gray-200 px-8 py-2.5 text-xs uppercase text-gray-900 pr-10 focus:outline-none focus:ring-2 focus:ring-redtab"
          value={status}
          disabled={patchSupplier.isPending}
          onChange={handleChange}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          {patchSupplier.isPending ? <Spinner size="sm" variant="secondary" /> : '▾'}
        </span>
      </div>
    </label>
  );
};
