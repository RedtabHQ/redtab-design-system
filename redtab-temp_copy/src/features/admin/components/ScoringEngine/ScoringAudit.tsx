import React from 'react';
import { BrainCircuit, Info } from 'lucide-react';

interface ScoringAuditProps {
  isAnalyzing: boolean;
  analysis: string | null;
  onAnalyze: () => void;
}

export const ScoringAudit: React.FC<ScoringAuditProps> = ({ isAnalyzing, analysis, onAnalyze }) => {
  return (
    <>
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="cursor-pointer w-full py-4 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all shadow-sm"
      >
        <BrainCircuit size={18} /> {isAnalyzing ? 'Analyzing Strategy...' : 'Audit Scoring Logic'}
      </button>

      {analysis && (
        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm text-xs text-gray-600 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-indigo-600 mb-3 font-black uppercase tracking-widest">
            <Info size={14} /> AI Context Brief
          </div>
          {analysis}
        </div>
      )}
    </>
  );
};
