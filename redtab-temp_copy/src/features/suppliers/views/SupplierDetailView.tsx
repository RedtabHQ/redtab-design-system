
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  AlertCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { useSupplier, useBlockSupplier, useUnblockSupplier } from '../hooks/useSuppliers';
import {
  OverviewSection,
  DisbursementsSection,
  BusinessInfoSection,
  MerchantsSection,
  DetailsSection,
  SettlementSection,
  SupplierStatusControl,
} from '../components';
import { Button, TabNavigation } from '@/components/common';
import { BlockSupplierModal } from '@/components/common/BlockSupplierModal';

const SUPPLIER_TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'disbursements', label: 'Disbursements' },
  { key: 'merchants', label: 'Merchants' },
  { key: 'settlement', label: 'Settlement' },
  { key: 'business-info', label: 'Business Info' },
  { key: 'details', label: 'Details' },
];
import { formatDateTime } from '@/utils';
import { Goback } from '@/components/common/Goback';


const SupplierDetailView: React.FC = () => {
  const { supplierId, tab } = useParams<{ supplierId: string; tab?: string }>();
  const navigate = useNavigate();
  const normalizedSupplierId = supplierId || '';
  const validTabKeys = SUPPLIER_TABS.map((t) => t.key);
  const normalizedTab = tab && validTabKeys.includes(tab) ? tab : null;
  const activeTab: string = normalizedTab ?? 'overview';

  // Fetch supplier from API using React Query
  const { data: supplier, isLoading, error, refetch: refetchSupplier } = useSupplier(normalizedSupplierId);

  // Use supplier's market segment directly
  const activeRegion = supplier?.marketSegment;

  useEffect(() => {
    if (tab && !normalizedTab && supplierId) {
      navigate(`/suppliers/${supplierId}`, { replace: true });
    }
  }, [tab, normalizedTab, supplierId, navigate]);

  const handleTabChange = (nextTab: string) => {
    if (!supplierId || nextTab === activeTab) return;
    navigate(nextTab === 'overview' ? `/suppliers/${supplierId}` : `/suppliers/${supplierId}/${nextTab}`);
  };
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Mutation hooks for supplier operations
  const blockSupplierMutation = useBlockSupplier();
  const unblockSupplierMutation = useUnblockSupplier();

  // Validate supplierId early
  if (!supplierId) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <Goback link='/suppliers' />
        <div className="flex items-center justify-center min-h-96 bg-amber-50 rounded-xl border border-amber-200">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-amber-900">Invalid Supplier ID</h2>
            <p className="text-amber-700 text-sm mt-2">No supplier ID provided in URL</p>
            <button
              onClick={() => navigate('/suppliers')}
              className="mt-6 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Back to Suppliers
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !supplier) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <Goback link='/suppliers' />

        <div className="flex items-center justify-center min-h-96 bg-red-50 rounded-xl border border-red-200">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-900">Failed to load supplier</h2>
            <p className="text-red-700 text-sm mt-2">
              {error instanceof Error ? error.message : 'Supplier not found'}
            </p>
            <button
              onClick={() => navigate('/suppliers')}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Suppliers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBlockSupplier = async (reason: string): Promise<void> => {
    if (!supplierId || !supplier) return;

    const isCurrentlyBlocked = supplier.status === 'BLOCKED';

    try {
      if (isCurrentlyBlocked) {
        await unblockSupplierMutation.mutateAsync({ supplierId, reason });
        console.log('Supplier unblocked successfully');
      } else {
        await blockSupplierMutation.mutateAsync({ supplierId, reason });
        console.log('Supplier blocked successfully');
      }

      // Refresh supplier data
      await refetchSupplier();
      setIsBlockModalOpen(false);
    } catch (error) {
      console.error('Failed to update supplier block status:', error);
      throw error;
    }
  };

  return (
    <div className="mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Goback link='/suppliers' />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900">{supplier.name}</h1>
              {supplier.isVerified && <ShieldCheck className="text-green-500" size={24} />}
              {supplier.status === 'BLOCKED' && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg">
                  <Lock className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-semibold text-red-600">BLOCKED</span>
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm font-medium">{(typeof supplier.category === 'string' ? supplier.category : (supplier.category && 'name' in supplier.category ? supplier.category.name : null)) || 'Uncategorized'} • Partner since {formatDateTime(supplier.onboardingDate)}</p>
          </div>
        </div>
        <div className="flex flex-row sm:items-center gap-3">
          <SupplierStatusControl supplier={supplier} noLabel />
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsBlockModalOpen(true)}
              className={`flex-1 md:flex-none uppercase transition-all cursor-pointer 
                ${supplier.status === 'BLOCKED'
                  ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {supplier.status === 'BLOCKED' ? (
                <span className="whitespace-nowrap flex items-center justify-center gap-2">
                  <Unlock size={16} />
                  Unblock Supplier
                </span>
              ) : (
                <span className="whitespace-nowrap flex items-center justify-center gap-2">
                  <Lock size={16} />
                  Block Supplier
                </span>
              )}
            </Button>
            <Button className="flex-1 md:flex-none bg-gray-900 text-white uppercase hover:bg-black transition-all">
              Update Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <TabNavigation tabs={SUPPLIER_TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'overview' && (
        <OverviewSection supplier={supplier} />
      )}

      {activeTab === 'disbursements' && (
        <DisbursementsSection supplierId={normalizedSupplierId} />
      )}

      {activeTab === 'business-info' && (
        <BusinessInfoSection
          supplier={supplier}
          activeRegion={activeRegion}
        />
      )}

      {activeTab === 'merchants' && (
        <MerchantsSection supplierId={normalizedSupplierId} />
      )}

      {activeTab === 'settlement' && (
        <SettlementSection supplier={supplier} onSettlementRecorded={refetchSupplier} />
      )}

      {activeTab === 'details' && (
        <DetailsSection supplier={supplier} />
      )}

      {/* Block/Unblock Modal */}
      <BlockSupplierModal
        isOpen={isBlockModalOpen}
        supplierName={supplier.name}
        isBlocking={supplier.status !== 'BLOCKED'}
        isLoading={blockSupplierMutation.isPending || unblockSupplierMutation.isPending}
        onConfirm={handleBlockSupplier}
        onCancel={() => setIsBlockModalOpen(false)}
      />
    </div>
  );
};



export default SupplierDetailView;
