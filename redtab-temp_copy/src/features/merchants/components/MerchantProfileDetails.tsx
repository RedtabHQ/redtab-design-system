import React from 'react';
import { User, CheckCircle } from 'lucide-react';
import { formatDate } from '@/utils/dateFormatter';
import { Link } from 'react-router-dom';

interface DirectorInfo {
  name: string;
  shareholding: string;
}

interface BoardStatus {
  status: string;
  description: string;
}

interface MerchantProfileDetailsProps {
  merchantId: string;
  contactPerson: string;
  onboardingDate: string;
  vatPan: string;
  directorInfo: DirectorInfo;
  boardStatus: BoardStatus;
}

const ProfileField = ({ label, value, verified, link }: { link?: string, label: string, value: string, verified?: boolean }) => (
  <div className="space-y-1">
    <p className="text-3xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <div className="flex items-center gap-2">
      <p className="text-sm font-black text-gray-900">
        {link ? <Link className="hover:underline" to={link}>{value}</Link> :value}
      </p>
      {verified && <CheckCircle size={12} className="text-green-500/30" />}
    </div>
  </div>
);

const MerchantProfileDetails: React.FC<MerchantProfileDetailsProps> = ({
  merchantId,
  contactPerson,
  onboardingDate,
  vatPan,
  directorInfo,
  boardStatus
}) => {
  return (
    <div className="border-t border-b py-8 border-gray-100 space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        <ProfileField label="LEGAL ENTITY ID" value={merchantId} verified link={`/merchants/${merchantId}`} />
        <ProfileField label="CONTACT PRIMARY" value={contactPerson} />
        <ProfileField label="REGISTRATION DATE" value={onboardingDate ? formatDate(onboardingDate) : 'N/A'} />
        <ProfileField label="VAT/PAN NUMBER" value={vatPan} />
      </div>

      <div className="pt-6 md:pt-8 border-t border-gray-100">
        <p className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <User size={12} /> OWNERSHIP & GOVERNANCE
        </p>
        <div className="flex gap-4 flex-col">
          <div className="hover:bg-gray-50 p-4 bg-white rounded border border-gray-100">
            <p className="text-3xs font-bold text-gray-400 uppercase">PRINCIPAL DIRECTOR</p>
            <p className="text-sm font-black text-gray-900 mt-1">{directorInfo.name}</p>
            <p className="text-[8px] text-gray-400 mt-0.5 font-bold uppercase">Shareholding: {directorInfo.shareholding}</p>
          </div>
          <div className="hover:bg-gray-50 p-4 bg-white rounded border border-gray-100">
            <p className="text-3xs font-bold text-gray-400 uppercase">BOARD STATUS</p>
            <p className="text-sm font-black text-green-600 mt-1 flex items-center gap-1.5">
              <CheckCircle size={14} /> {boardStatus.status}
            </p>
            <p className="text-[8px] text-gray-400 mt-0.5 font-bold uppercase">{boardStatus.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantProfileDetails;
