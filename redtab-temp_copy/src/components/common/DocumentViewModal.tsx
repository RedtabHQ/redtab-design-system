import React from 'react';
import { X, FileText } from 'lucide-react';

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentLabel: string;
  documentUrl?: string;
}

const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  isOpen,
  onClose,
  documentLabel,
  documentUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-redtab/10 text-redtab rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                {documentLabel}
              </h3>
              <p className="text-2xs font-bold text-gray-400 uppercase mt-0.5">
                Document Preview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-redtab transition-colors rounded-xl hover:bg-gray-50 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {documentUrl ? (
            <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-gray-50 rounded-2xl">
              <iframe
                src={documentUrl}
                className="w-full h-full min-h-[500px] rounded-2xl"
                title={documentLabel}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center">
              <div className="p-4 bg-gray-100 text-gray-400 rounded-full mb-4">
                <FileText size={48} />
              </div>
              <p className="text-sm font-bold text-gray-900 mb-2">
                Document Preview Not Available
              </p>
              <p className="text-xs text-gray-400 max-w-md">
                This document is still being processed or the preview is not available at this time.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close
          </button>
          {documentUrl && (
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-redtab text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              Open in New Tab
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewModal;
