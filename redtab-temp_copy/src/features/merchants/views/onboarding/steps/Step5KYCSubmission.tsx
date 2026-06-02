/**
 * Step 5: KYC & Compliance submission
 */

import React from 'react';
import { Upload, CheckCircle2, AlertCircle, ShieldCheck, FileSearch } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useToastContext } from '@/components/common/ToastContainer';
import type { OnboardingFormData } from '../utils/onboardingValidation';

interface Step5KYCSubmissionProps {
  uploadedFile: File | null;
  fileError: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Step5KYCSubmission = ({
  uploadedFile,
  fileError,
  onFileUpload,
}: Step5KYCSubmissionProps) => {
  const { getValues } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 text-gray-900">
        <ShieldCheck size={32} className="text-green-600" />
        <h2 className="text-2xl font-black tracking-tight uppercase">KYC & Compliance Vault</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="border-4 border-dashed border-gray-100 rounded-xl p-16 text-center space-y-6 hover:border-red-100 hover:bg-red-50/20 transition-all cursor-pointer group">
          <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto text-gray-400 group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner">
            <Upload size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-gray-900">Upload Registration Dossier</h4>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">PDF, PNG, JPG (MAX 25MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            id="kyc-file-upload"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={onFileUpload}
          />
          <label
            htmlFor="kyc-file-upload"
            className="inline-block px-8 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all cursor-pointer"
          >
            Browse Vault
          </label>
        </div>

        {uploadedFile && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
            <CheckCircle2 className="text-green-600" size={20} />
            <div>
              <p className="text-sm font-bold text-green-800">Document uploaded successfully</p>
              <p className="text-xs text-green-600">{uploadedFile.name}</p>
            </div>
          </div>
        )}

        {fileError && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-red-600 font-semibold">{fileError}</p>
          </div>
        )}

        <div className="p-8 bg-gray-900 rounded-xl text-white space-y-6">
          <div className="flex items-center gap-3">
            <FileSearch size={24} className="text-red-600" />
            <h3 className="font-bold">Automated Integrity Check</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            By proceeding, the platform will initiate a background check across regulatory databases for{' '}
            <span className="text-white font-black">{getValues('name') || 'the entity'}</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
