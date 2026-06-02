import React, { useState, useMemo, useCallback } from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { Spinner } from '@/components/common';
import { useParams } from 'react-router-dom';
import { SearchInput } from '@/components/SearchInput';
import CheckItem from '@/features/contracts/components/CheckItem';
import OCRItem from '@/features/contracts/components/OCRItem';
import DocumentViewModal from '@/components/common/DocumentViewModal';
import { usePolicyChecklist } from '@/features/workbench/hooks/usePolicyChecklist';

interface ChecklistItemData {
  key: string;
  label: string;
}

interface OCRItemData {
  label: string;
}

const CHECKLIST_ITEMS: ChecklistItemData[] = [
  { key: 'purpose', label: 'Business purpose matches category' },
  { key: 'owner_id', label: 'Owner ID matches director record' },
  { key: 'reg_val', label: 'Registration number validated at source' },
  { key: 'vat_pan', label: 'VAT/PAN certificate is current' },
  { key: 'pep_check', label: 'No PEP or high-risk associations' }
];

const OCR_ITEMS_DATA: OCRItemData[] = [
  { label: "Business License (Form D)" },
  { label: "VAT/PAN Certificate" },
  { label: "Tax Compliance Certificate" },
  { label: "Owner Citizenship (KTM)" }
];

interface PolicyVaultPageProps {
  providerId?: string;
}

const PolicyVaultSyncState: React.FC<{ isLoading: boolean; updatedAt: string | null }> = ({ isLoading, updatedAt }) => {
  if (!isLoading && !updatedAt) {
    return null;
  }

  const label = updatedAt ? `Last synced ${new Date(updatedAt).toLocaleString()}` : 'Local draft only';

  return (
    <div className="flex items-center gap-2 text-xs+ text-gray-500 uppercase tracking-widest">
      {isLoading && <Spinner size="sm" variant="primary" />}
      <span>{isLoading ? 'Syncing policy checklist...' : label}</span>
    </div>
  );
};

export const PolicyVaultPage: React.FC<PolicyVaultPageProps> = ({ providerId: providerIdProp }) => {
  const { merchantId: routeProviderId } = useParams<{ merchantId: string }>();
  const providerId = providerIdProp ?? routeProviderId;
  const { checklist, isLoading, error, toggleItem, updatedAt, providerId: resolvedProviderId } = usePolicyChecklist(providerId);
  const [internalSearch, setInternalSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ label: string; url?: string } | null>(null);

  const handleToggle = useCallback((key: string) => {
    void toggleItem(key);
  }, [toggleItem]);

  const handleSearchChange = (value: string) => {
    setInternalSearch(value);
  };

  const handleViewDocument = useCallback((label: string, url?: string) => {
    setSelectedDocument({ label, url });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  }, []);

  const filteredChecklistItems = useMemo(() => {
    if (!internalSearch.trim()) return CHECKLIST_ITEMS;
    const searchLower = internalSearch.toLowerCase();
    return CHECKLIST_ITEMS.filter(item =>
      item.label.toLowerCase().includes(searchLower)
    );
  }, [internalSearch]);

  const filteredOCRItems = useMemo(() => {
    if (!internalSearch.trim()) return OCR_ITEMS_DATA;
    const searchLower = internalSearch.toLowerCase();
    return OCR_ITEMS_DATA.filter(item =>
      item.label.toLowerCase().includes(searchLower)
    );
  }, [internalSearch]);

  return (
    <div className="animate-in fade-in space-y-12">
      <div className="mb-8">
        <SearchInput
          value={internalSearch}
          onChange={handleSearchChange}
          placeholder="Filter policy items..."
          className="max-w-md"
        />
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-600" data-testid="policy-checklist-loading">
          <Spinner size="sm" variant="primary" />
          <span>Syncing the latest policy checklist…</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900" data-testid="policy-checklist-alert">
          <AlertTriangle className="h-4 w-4 mt-0.5" />
          <div>
            <p className="font-semibold uppercase tracking-widest text-2xs">Offline mode</p>
            <p className="mt-1">We could not sync the latest checklist. Showing cached values so underwriting work is uninterrupted.</p>
          </div>
        </div>
      )}

      {!resolvedProviderId && (
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-900">
          <AlertTriangle className="h-4 w-4 mt-0.5" />
          <div>
            <p className="font-semibold uppercase tracking-widest text-2xs">Select a merchant</p>
            <p className="mt-1">Policy Vault needs a merchant or provider ID to load a checklist. Choose a merchant to proceed.</p>
          </div>
        </div>
      )}

      <h4 className="text-2xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><FileText size={14} /> POLICY VERIFICATION CHECKLIST (VAULT #882)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center gap-2 text-redtab font-black text-xs uppercase tracking-widest">
            <FileText size={18} /> Underwriter Verification
          </div>
          <PolicyVaultSyncState isLoading={isLoading} updatedAt={updatedAt} />
          {filteredChecklistItems.length > 0 ? (
            <div className="space-y-5">
              {filteredChecklistItems.map((item) => (
                <CheckItem
                  key={item.key}
                  label={item.label}
                  checked={Boolean(checklist[item.key])}
                  onToggle={() => handleToggle(item.key)}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs text-gray-400">No checklist items match "{internalSearch}"</p>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <h4 className="text-2xs font-black text-gray-400 uppercase tracking-widest">OCR ARTIFACTS</h4>
          {filteredOCRItems.length > 0 ? (
            <div className="space-y-4">
              {filteredOCRItems.map((item, idx) => (
                <OCRItem
                  key={idx}
                  label={item.label}
                  onView={() => handleViewDocument(item.label)}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs text-gray-400">No OCR items match "{internalSearch}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Document View Modal */}
      <DocumentViewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        documentLabel={selectedDocument?.label || ''}
        documentUrl={selectedDocument?.url}
      />
    </div>
  );
};

export default PolicyVaultPage;
