import React from 'react';
import { GlobalGuardrails } from '@/features/contracts/components/GlobalGuardrails';
import { CurrencyContextInfo } from '@/features/contracts/components/CurrencyContextInfo';

export const RegionalSidebar: React.FC = () => {
  return (
    <div className="space-y-8">
      <GlobalGuardrails />
      <CurrencyContextInfo />
    </div>
  );
};
