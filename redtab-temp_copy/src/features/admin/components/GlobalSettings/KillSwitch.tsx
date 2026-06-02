import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { KillSwitchConfirmModal } from '@/components/common/KillSwitchConfirmModal';
import { useKillSwitch } from '../../hooks/useKillSwitch';

export const KillSwitch: React.FC = () => {
  const { killSwitchActive, toggleKillSwitch, isLoading } = useKillSwitch();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleConfirm = async (reason?: string) => {
    const success = await toggleKillSwitch(!killSwitchActive, reason);
    if (success) {
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`flex items-center cursor-pointer gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 ${
          killSwitchActive
            ? 'bg-red-600 text-white animate-pulse hover:bg-red-700'
            : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
        }`}
      >
        <ShieldAlert size={16} /> {killSwitchActive ? 'System Frozen' : 'Kill Switch'}
      </button>

      <KillSwitchConfirmModal
        isOpen={showModal}
        isLoading={isLoading}
        willEnable={!killSwitchActive}
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
};