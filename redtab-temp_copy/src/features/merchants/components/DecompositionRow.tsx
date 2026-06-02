import React from 'react';

interface DecompositionRowProps {
  label: string;
  score?: number | null;
}

export const DecompositionRow: React.FC<DecompositionRowProps> = ({ label, score }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-2xs font-bold uppercase">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900">{score != null ? `${score}%` : '-'}</span>
    </div>
    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
      {score != null && <div className="h-full bg-gray-900" style={{ width: `${score}%` }} />}
    </div>
  </div>
);
