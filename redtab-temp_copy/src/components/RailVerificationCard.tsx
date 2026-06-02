import React from 'react';
import { Hash } from 'lucide-react';

interface RailVerificationCardProps {
  entityName: string;
}

const RailVerificationCard: React.FC<RailVerificationCardProps> = ({ entityName }) => {
  return (
    <div className="p-8 bg-gray-900 rounded-xl text-white space-y-4">
      <div className="flex items-center gap-3">
        <Hash size={24} className="text-redtab" />
        <h3 className="font-bold">Automated Rail Verification</h3>
      </div>
      <p className="text-xs+ text-gray-400 leading-relaxed font-medium">
        Funds will be disbursed using the specified rail. Ensure the bank account matches the legal name of{' '}
        <span className="text-white font-black">{entityName || 'the entity'}</span> to prevent settlement failure.
      </p>
    </div>
  );
};

export default RailVerificationCard;
