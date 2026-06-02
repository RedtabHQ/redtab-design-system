import React from 'react';
import { Globe, Save } from 'lucide-react';
import { Button } from '@/components';

interface RegionalHeaderProps {
  onDeployPolicy: () => void;
}

export const RegionalHeader: React.FC<RegionalHeaderProps> = ({ onDeployPolicy }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2 text-gray-900">
          <Globe className="text-redtab" /> Global Market Orchestrator
        </h1>
        <p className="text-gray-500 font-medium">Configure active currencies, regional thresholds, and FX bridges.</p>
      </div>
      <Button
        variant="primary" 
        onClick={onDeployPolicy}
        className="uppercase"
      >
        <Save size={16} /> Deploy Global Policy
      </Button>
    </div>
  );
};
