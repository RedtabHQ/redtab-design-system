import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BrainCircuit, Maximize2, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';
import { getSupplierRiskAssessment, AiInsightResult } from '@/lib/geminiService';
import type { Supplier } from '@/types';
import { ExpandedModal } from './ExpandedModal';

interface AIPartnerHealthCardProps {
  supplier: Supplier;
}

function formatGeneratedAt(iso: string): string {
  if (!iso || iso === 'unknown') return '';
  try {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export const AIPartnerHealthCard: React.FC<AIPartnerHealthCardProps> = ({ supplier }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  const queryClient = useQueryClient();

  const { data: aiInsight, isLoading, isFetching } = useQuery<AiInsightResult>({
    queryKey: ['supplier-ai-assessment', supplier.id, forceRefresh],
    queryFn: () => getSupplierRiskAssessment(supplier, undefined, forceRefresh),
    enabled: !!supplier?.id,
  });

  const handleRegenerate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setForceRefresh(true);
    queryClient.invalidateQueries({ queryKey: ['supplier-ai-assessment', supplier.id] });
    setTimeout(() => setForceRefresh(false), 100);
  };

  const content = aiInsight?.content || '';
  const generatedAt = aiInsight?.generatedAt || '';
  const cached = aiInsight?.cached ?? false;

  return (
    <>
      <div
        className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-xl text-white shadow-xl space-y-6 cursor-pointer hover:shadow-2xl transition-shadow"
        onClick={() => !isLoading && content && setIsModalOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <BrainCircuit size={20} className="text-red-100" />
            </div>
            <h3 className="font-bold tracking-tight">AI Partner Health</h3>
          </div>
          <div className="flex items-center gap-2">
            {!isLoading && content && (
              <>
                <button
                  onClick={handleRegenerate}
                  disabled={isFetching}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
                  title="Regenerate analysis"
                >
                  <RefreshCw size={14} className={`text-white/70 ${isFetching ? 'animate-spin' : ''}`} />
                </button>
                <Maximize2 size={16} className="text-white/50" />
              </>
            )}
          </div>
        </div>
        <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-3 bg-white/20 rounded w-full"></div>
              <div className="h-3 bg-white/20 rounded w-5/6"></div>
            </div>
          ) : (
            <div className="text-sm text-red-50/90 leading-relaxed italic border-l-2 border-red-300 pl-4 pr-2">
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
        {!isLoading && generatedAt && generatedAt !== 'unknown' && (
          <div className="text-xs text-white/40 flex items-center gap-1">
            <span>Generated: {formatGeneratedAt(generatedAt)}</span>
            {cached && <span>(cached)</span>}
          </div>
        )}
      </div>

      {isModalOpen && (
        <ExpandedModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="AI Partner Health"
          description={`Detailed AI analysis for ${supplier.name}`}
        >
          {content}
        </ExpandedModal>
      )}
    </>
  );
};
