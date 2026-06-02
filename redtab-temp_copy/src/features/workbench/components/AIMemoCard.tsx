import React from 'react';
import Markdown from 'react-markdown';
import { BrainCircuit, RotateCcw } from 'lucide-react';

interface AIMemoCardProps {
  memo: string | null;
  isAnalyzing: boolean;
  onRefresh: () => void;
}

const AIMemoCard: React.FC<AIMemoCardProps> = ({ memo, isAnalyzing, onRefresh }) => {
  return (
    <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-2xl text-redtab ring-4 ring-red-50/50">
            <BrainCircuit size={28} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">AI Underwriting Memo</h3>
        </div>
        <button
          onClick={onRefresh}
          disabled={isAnalyzing}
          className={`p-2.5 rounded-xl transition-all ${isAnalyzing ? 'bg-gray-100 text-gray-300' : 'bg-gray-50 text-gray-400 hover:text-gray-900'}`}
        >
          <RotateCcw size={18} className={isAnalyzing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="min-h-[100px]">
        {isAnalyzing ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded-full w-full" />
            <div className="h-4 bg-gray-100 rounded-full w-5/6" />
            <div className="h-4 bg-gray-100 rounded-full w-4/6" />
          </div>
        ) : memo ? (
          <div className="leading-2 prose prose-sm max-w-none text-gray-600 leading-relaxed border-l-4 border-redtab pl-8 py-2 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-gray-900 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-gray-800 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-700 [&_p]:text-sm [&_p]:text-gray-600 [&_ul]:text-sm [&_ol]:text-sm [&_li]:text-gray-600 [&_strong]:text-gray-800">
            <Markdown>{memo}</Markdown>
          </div>
        ) : (
          <div className="py-8 text-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
            <p className="text-sm text-gray-400 font-medium italic">
              Request a synthetic risk summary based on the merchant's data points.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMemoCard;
