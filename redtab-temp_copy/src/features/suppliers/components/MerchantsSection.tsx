import React, { useState } from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@/components/common';
import { useSupplierLinkedMerchants } from '../hooks/useSuppliers';

type MerchantsSectionProps = {
  supplierId: string;
};

export const MerchantsSection: React.FC<MerchantsSectionProps> = ({ supplierId }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: linkedMerchantsData } = useSupplierLinkedMerchants(supplierId, { pageSize: 6, page: currentPage });
  const linkedMerchants = linkedMerchantsData ?? {
    items: [],
    meta: { page: currentPage, pageSize: 6, total: 0, totalPages: 1 },
  };

  return (
    <>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {linkedMerchants?.meta?.total > 0 ? (
          linkedMerchants.items.map((m) => (
            <div
              key={m.id}
              className="bg-white p-6 rounded border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => navigate(`/merchants/${m.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
                    {m.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-redtab transition-colors">{m.name}</h4>
                    <p className="text-2xs text-gray-400 font-mono">{m.providerId}</p>
                  </div>
                </div>
                <span className="text-2xs font-black text-gray-400 uppercase tracking-widest">{m.tier}</span>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-3xs font-black text-gray-400 uppercase">Purchase Frequency</p>
                  <p className="text-xs font-bold">~4x / month</p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-300 group-hover:text-redtab transform group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-20 text-center text-gray-400">
            <Users size={40} className="mx-auto mb-2 opacity-10" />
            <p>No merchants linked to this supplier yet.</p>
          </div>
        )}
      </div>

      <Pagination
        meta={linkedMerchants?.meta || {}}
        onPageChange={setCurrentPage}
      />
    </>

  );
};
