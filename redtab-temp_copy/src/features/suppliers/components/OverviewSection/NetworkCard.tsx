import React from 'react';
import { Users, Activity } from 'lucide-react';
import { Card } from '@/components/common';
import type { Supplier } from '@/types';
import { getCategoryName } from '@/features/merchants/utils/merchantHelpers';
import { useSupplierLinkedMerchants } from '../../hooks/useSuppliers';

type NetworkCardProps = {
  supplier: Supplier;
};

export const NetworkCard: React.FC<NetworkCardProps> = ({ supplier }) => {
  const supplierId = supplier.id;

  // Self-fetch merchants data
  const { data: linkedMerchantsData } = useSupplierLinkedMerchants(supplierId, { pageSize: 6, page: 1 });
  // Default to empty merchants if fetch fails (shows 0 clients and "Not assigned" category)
  const linkedMerchants = linkedMerchantsData ?? {
    items: [],
    meta: { page: 1, pageSize: 6, total: 0, totalPages: 1 },
  };

  return (
    <Card variant="surface" className="space-y-4">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Users size={16} /> Active Network
      </h3>
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-3xl font-black text-gray-900">{linkedMerchants.meta.total || '-'} Clients</p>
          <p className="text-xs text-gray-400 font-medium">Buying on Pay Later terms</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2 text-2xs font-bold text-blue-600">
        <Activity size={12} /> Most active category: {getCategoryName(supplier.category) || 'Not assigned'}
      </div>
    </Card>
  );
};
