import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Card } from '@/components/common';
import { AIPartnerHealthCard } from '../AIPartnerHealthCard';
import type { Supplier } from '@/types';

type SidebarInfoProps = {
  supplier: Supplier;
};

export const SidebarInfo: React.FC<SidebarInfoProps> = ({ supplier }) => (
  <div className="col-span-4 space-y-8">
    {/* Primary Contact Card */}
    <Card variant="surface" padding="lg" className="space-y-6">
      <h3 className="text-2xs font-black text-gray-400 uppercase tracking-widest">Primary Contact</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-redtab flex items-center justify-center font-bold text-lg">
            {supplier.contactPerson.charAt(0)}
          </div>
          <div>
            <p className="font-black text-gray-900">{supplier.contactPerson}</p>
            <p className="text-xs text-gray-400 font-medium">Head of Operations</p>
          </div>
        </div>
        <div className="pt-4 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate" title={supplier.email}>{supplier.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Phone size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate" title={supplier.phone}>{supplier.phone}</span>
          </div>
        </div>
      </div>
    </Card>

    {/* AI Partner Health Card - Self-contained with data fetching */}
    <AIPartnerHealthCard supplier={supplier} />
  </div>
);
