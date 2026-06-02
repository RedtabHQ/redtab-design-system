/**
 * Step 5: KYC & Compliance submission
 */

import { ShieldCheck, Upload, FileSearch } from 'lucide-react';
import type { OnboardingFormData } from '../onboardingSchema';

interface Step5Props {
  merchantName: string;
}

export const Step5KYCSubmission = ({ merchantName }: Step5Props) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
    <div className="flex items-center gap-4 text-gray-900">
      <ShieldCheck size={32} className="text-green-600" />
      <h2 className="text-2xl font-black tracking-tight uppercase">KYC & Compliance Vault</h2>
    </div>

    <div className="grid grid-cols-1 gap-6">
      <div className="border-4 border-dashed border-gray-100 rounded-xl p-16 text-center space-y-6 hover:border-red-100 hover:bg-red-50/20 transition-all cursor-pointer group">
        <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto text-gray-400 group-hover:bg-redtab group-hover:text-white transition-all shadow-inner">
          <Upload size={32} />
        </div>
        <div>
          <h4 className="text-lg font-black text-gray-900">Upload Registration Dossier</h4>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">PDF, PNG, JPG (MAX 25MB)</p>
        </div>
        <button className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">
          Browse Vault
        </button>
      </div>

      <div className="p-8 bg-gray-900 rounded-xl text-white space-y-6">
        <div className="flex items-center gap-3">
          <FileSearch size={24} className="text-redtab" />
          <h3 className="font-bold">Automated Integrity Check</h3>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed font-medium">
          By proceeding, the platform will initiate a background check across the Central Bank Blacklist, Tax Revenue Authority, and PEP databases for{' '}
          <span className="text-white font-black">{merchantName || 'the entity'}</span>.
        </p>
      </div>
    </div>
  </div>
);
