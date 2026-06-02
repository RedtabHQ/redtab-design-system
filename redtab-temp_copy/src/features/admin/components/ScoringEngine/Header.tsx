import React from 'react';
import { Settings2, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components';

interface HeaderProps {
  isValidGlobal: boolean;
  onCommit: () => void;
  onRestore: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isValidGlobal, onCommit, onRestore }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <Settings2 className="text-redtab" size={32} /> Scoring Engine
        </h1>
        <p className="text-gray-500 font-medium italic">Deterministic parameter-based framework with administrative target tuning.</p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={onRestore}
          className="flex items-center gap-2 uppercase hover:bg-gray-50 transition-all"
        >
          <RotateCcw size={18} /> Restore Defaults
        </Button>
        <Button
          disabled={!isValidGlobal}
          onClick={onCommit}
          className={`flex items-center gap-2 uppercase transition-all`}
        >
          <Save size={18} /> Commit Configuration
        </Button>
      </div>
    </div>
  );
};
