import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProfileFieldProps {
  label: string;
  value: string;
  verified?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, verified }) => (
  <div className="space-y-1">
    <p className="text-3xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <div className="flex items-center gap-2">
       <p className="text-sm font-black text-gray-900">{value}</p>
       {verified && <CheckCircle size={12} className="text-green-500/30" />}
    </div>
  </div>
);

export default ProfileField;
