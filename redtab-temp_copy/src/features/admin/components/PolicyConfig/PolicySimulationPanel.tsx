import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface PolicySimulationPanelProps {
  isAnalyzing: boolean;
  analysis: string | null;
  segmentName: string;
  isGlobal: boolean;
  onAnalyze: () => void;
}

const PolicySimulationPanel: React.FC<PolicySimulationPanelProps> = ({
  isAnalyzing,
  analysis,
  segmentName,
  isGlobal,
  onAnalyze,
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-10 rounded-xl text-white shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-2xl">
          <BrainCircuit size={28} className="text-indigo-300" />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight">Policy Simulation</h3>
          <p className="text-2xs text-indigo-400 font-bold uppercase tracking-widest">AI Impact Assessment</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-indigo-100/80 leading-relaxed">
        Analyzing how score-threshold adjustments will impact approval rates for the{' '}
        {isGlobal ? 'Global SME' : `${segmentName}`} segment.
      </p>

      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-black text-xs uppercase tracking-widest transition-all shadow-xl"
      >
        {isAnalyzing ? 'Simulating Yield...' : 'Run Strategy Simulation'}
      </button>

      {/* Analysis Result */}
      {analysis && (
        <div className="bg-white/5 border border-white/10 p-6 rounded animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-xs text-indigo-100/90 leading-relaxed italic">{analysis}</div>
        </div>
      )}
    </div>
  );
};

export default PolicySimulationPanel;
