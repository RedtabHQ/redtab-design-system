import React, { useState } from 'react';
import { AlertCircle, FileText, Upload, ExternalLink, ChevronDown } from 'lucide-react';
import { Spinner } from '@/components/common';
import { useToastContext } from '@/components/common/ToastContainer';
import { Merchant, KycDocument, KycDocumentStatus, KycDocumentType } from '@/types';
import { useMerchantKycStatus, useUpdateDocumentStatus } from '../hooks';
import { formatDate } from '@/utils/dateFormatter';

interface MerchantKycTabProps {
  merchant: Merchant;
}

const DOCUMENT_LABELS: Record<KycDocumentType, string> = {
  [KycDocumentType.NATIONAL_ID]: 'National ID / CMND / CCCD',
  [KycDocumentType.PASSPORT]: 'Passport',
  [KycDocumentType.BUSINESS_LICENSE]: 'Business License',
  [KycDocumentType.TAX_REGISTRATION]: 'Tax Registration Certificate',
  [KycDocumentType.BANK_STATEMENT]: 'Bank Statement (3 months)',
  [KycDocumentType.FINANCIAL_STATEMENT]: 'Financial Statement',
  [KycDocumentType.PROOF_OF_ADDRESS]: 'Proof of Address',
  [KycDocumentType.COMPANY_REGISTRATION]: 'Company Registration',
  [KycDocumentType.DIRECTOR_ID]: 'Director ID',
  [KycDocumentType.SHAREHOLDER_AGREEMENT]: 'Shareholder Agreement',
  [KycDocumentType.CUSTOM]: 'Custom Document',
};

const STATUS_CONFIG: Record<KycDocumentStatus, { color: string; bgColor: string; icon: string; label: string }> = {
  [KycDocumentStatus.PENDING]: { color: 'text-gray-500', bgColor: 'bg-gray-100', icon: '○', label: 'Pending' },
  [KycDocumentStatus.SUBMITTED]: { color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '↑', label: 'Submitted' },
  [KycDocumentStatus.UNDER_REVIEW]: { color: 'text-amber-600', bgColor: 'bg-amber-50', icon: '⏳', label: 'Under Review' },
  [KycDocumentStatus.VERIFIED]: { color: 'text-green-600', bgColor: 'bg-green-50', icon: '✓', label: 'Verified' },
  [KycDocumentStatus.REJECTED]: { color: 'text-red-600', bgColor: 'bg-red-50', icon: '✕', label: 'Rejected' },
  [KycDocumentStatus.EXPIRED]: { color: 'text-orange-600', bgColor: 'bg-orange-50', icon: '⚠', label: 'Expired' },
};

const STATUS_OPTIONS = Object.values(KycDocumentStatus);

interface KycDocumentItemProps {
  doc: KycDocument;
  merchantId: string;
}

const KycDocumentItem = ({ doc, merchantId }: KycDocumentItemProps) => {
  const config = STATUS_CONFIG[doc.status];
  const label = doc.customLabel || DOCUMENT_LABELS[doc.type] || doc.type;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pendingStatus, setPendingStatus] = useState<KycDocumentStatus | null>(null);

  const { show } = useToastContext();
  const updateStatus = useUpdateDocumentStatus();

  const handleStatusChange = (newStatus: KycDocumentStatus) => {
    if (newStatus === doc.status) {
      setShowDropdown(false);
      return;
    }

    if (newStatus === KycDocumentStatus.REJECTED) {
      setPendingStatus(newStatus);
      setShowRejectModal(true);
      setShowDropdown(false);
      return;
    }

    updateStatus.mutate({
      merchantId,
      documentType: doc.type,
      status: newStatus,
    }, {
      onError: (error) => {
        show({
          type: 'DANGER',
          title: 'Update Failed',
          message: error instanceof Error ? error.message : 'Failed to update document status. Please try again.',
        });
      },
    });
    setShowDropdown(false);
  };

  const handleRejectConfirm = () => {
    if (!pendingStatus) return;
    updateStatus.mutate({
      merchantId,
      documentType: doc.type,
      status: pendingStatus,
      rejectionReason: rejectionReason || undefined,
    }, {
      onError: (error) => {
        show({
          type: 'DANGER',
          title: 'Update Failed',
          message: error instanceof Error ? error.message : 'Failed to reject document. Please try again.',
        });
      },
    });
    setShowRejectModal(false);
    setRejectionReason('');
    setPendingStatus(null);
  };

  return (
    <>
      <div className="flex items-start gap-4 p-6 border border-gray-100 rounded hover:bg-gray-50/30 transition-colors">
        <div className={`p-3 rounded-lg ${config.bgColor} flex-shrink-0`}>
          <span className={`text-xl font-black ${config.color}`}>{config.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-black text-gray-900 mb-1">{label}</h4>
          {doc.fileName && (
            <p className="text-xs text-gray-500 truncate flex items-center gap-1">
              <FileText size={12} />
              {doc.fileName}
            </p>
          )}
          {doc.rejectionReason && (
            <p className="text-xs text-red-600 mt-1">Reason: {doc.rejectionReason}</p>
          )}
          {doc.submittedAt && (
            <p className="text-xs text-gray-400 mt-1">
              Submitted: {formatDate(doc.submittedAt)}
            </p>
          )}
          {doc.verifiedAt && (
            <p className="text-xs text-green-600 mt-1">
              Verified: {formatDate(doc.verifiedAt)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {doc.fileUrl && (
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="View document"
            >
              <ExternalLink size={14} className="text-gray-600" />
            </a>
          )}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={updateStatus.isPending}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-2xs font-black uppercase whitespace-nowrap ${config.bgColor} ${config.color} hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50`}
            >
              {updateStatus.isPending ? (
                <Spinner size="sm" />
              ) : (
                <>
                  {config.label}
                  <ChevronDown size={12} />
                </>
              )}
            </button>
            {showDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                  {STATUS_OPTIONS.map((status) => {
                    const statusConfig = STATUS_CONFIG[status];
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`cursor-pointer w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 flex items-center gap-2 ${
                          status === doc.status ? 'bg-gray-50' : ''
                        }`}
                      >
                        <span className={statusConfig.color}>{statusConfig.icon}</span>
                        <span className="text-gray-700">{statusConfig.label}</span>
                        {status === doc.status && (
                          <span className="ml-auto text-gray-400">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl mx-4">
            <h3 className="text-sm font-black text-gray-900 uppercase mb-4">Reject Document</h3>
            <p className="text-xs text-gray-600 mb-3">
              Provide a reason for rejecting <strong>{label}</strong>:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setPendingStatus(null);
                }}
                className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const KycDocumentSkeleton = () => (
  <div className="flex items-start gap-4 p-6 border border-gray-100 rounded animate-pulse">
    <div className="p-3 rounded-lg bg-gray-200 w-12 h-12" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-24" />
    </div>
    <div className="h-6 bg-gray-200 rounded w-20" />
  </div>
);

export const MerchantKycTab: React.FC<MerchantKycTabProps> = ({ merchant }) => {
  const { data: kycStatus, isLoading, error } = useMerchantKycStatus(merchant.id);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-center gap-3 py-4">
            <Spinner size="md" variant="primary" />
            <span className="text-gray-500">Loading KYC status...</span>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-4">Documents</h3>
          {[1, 2, 3, 4].map((i) => (
            <KycDocumentSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !kycStatus) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-red-50 p-8 rounded-xl border border-red-100 flex items-start gap-4">
          <AlertCircle size={24} className="text-red-600 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-black text-red-900 uppercase">Error Loading KYC</h4>
            <p className="text-xs text-red-800 leading-relaxed font-medium">
              {error instanceof Error ? error.message : 'Failed to load KYC status. Please try again.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { verified, verifiedCount, requiredCount, progressPercentage, documents, verificationNotes } = kycStatus;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Progress Card */}
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">KYC Verification Progress</h3>
          <span className="text-2xl font-black text-redtab">{verifiedCount}/{requiredCount}</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Overall Completion</span>
            <span className="font-black text-gray-900">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${verified ? 'bg-green-500' : 'bg-redtab'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* KYC Documents */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-4">Required Documents</h3>

        {documents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Upload size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm font-medium">No documents configured yet</p>
          </div>
        ) : (
          documents.map((doc, index) => (
            <KycDocumentItem
              key={`${doc.type}-${doc.customLabel || index}`}
              doc={doc}
              merchantId={merchant.id}
            />
          ))
        )}
      </div>

      {/* Status Info */}
      <div className={`p-8 rounded-xl border flex items-start gap-4 ${
        verified
          ? 'bg-green-50 border-green-100'
          : 'bg-blue-50 border-blue-100'
      }`}>
        <AlertCircle size={24} className={verified ? 'text-green-600 shrink-0' : 'text-blue-600 shrink-0'} />
        <div className="space-y-1">
          <h4 className={`text-sm font-black uppercase ${verified ? 'text-green-900' : 'text-blue-900'}`}>
            {verified ? 'KYC Verified' : 'KYC In Progress'}
          </h4>
          <p className={`text-xs leading-relaxed font-medium ${verified ? 'text-green-800' : 'text-blue-800'}`}>
            {verified
              ? 'All KYC requirements have been completed successfully. The merchant account is fully verified and operational.'
              : 'Please submit all required documents for verification. Our team will review them and update the status.'
            }
          </p>
          {verificationNotes && (
            <p className="text-xs text-gray-600 mt-2 italic">
              Notes: {verificationNotes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
