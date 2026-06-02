import React from 'react';
import type { Supplier } from '@/types';
import { VolumeCard } from './VolumeCard';
import { NetworkCard } from './NetworkCard';
import { SidebarInfo } from './SidebarInfo';
import { DisbursementsSection } from '../DisbursementsSection';

// Export sub-components for direct use
export { NetworkCard } from './NetworkCard';
export { VolumeCard } from './VolumeCard';
export { SidebarInfo } from './SidebarInfo';

type OverviewSectionProps = {
  supplier: Supplier;
};

/**
 * OverviewSection - Main orchestrator component for supplier overview
 * Composes all child components: VolumeCard, NetworkCard, DisbursementsSection, and SidebarInfo
 * Layout: 8 columns for main content (left), 4 columns for sidebar (right)
 */
export const OverviewSection: React.FC<OverviewSectionProps> = ({ supplier }) => {
  return (
    <div className="gap-8 grid grid-cols-12">
      <div className="space-y-8 col-span-8 animate-in fade-in slide-in-from-left-4 duration-500">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VolumeCard supplier={supplier} />
          <NetworkCard supplier={supplier} />
        </div>

        {/* Disbursements Section */}
        <DisbursementsSection supplierId={supplier.id} />
      </div>

      {/* Sidebar Info */}
      <SidebarInfo supplier={supplier} />
    </div>
  );
};
