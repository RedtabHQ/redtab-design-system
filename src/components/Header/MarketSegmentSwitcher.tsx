import React, { useState } from 'react';
import { Globe, CheckCircle, ChevronDown } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

export const MarketSegmentSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setIsOpen(false));

  const handleSelectSegment = (segment: string | null) => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg hover:bg-white hover:shadow-md transition-all flex-shrink-0"
      >
        <div className="p-1.5 rounded-lg bg-gray-900 text-white">
          <Globe size={16} className="sm:w-[18px] sm:h-[18px]" />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-2xs font-black text-gray-400 uppercase tracking-widest leading-none">Market Segment</p>
          <p className="text-sm font-black text-gray-900 mt-1 flex items-center gap-1.5">
            Global / HQ
            <ChevronDown size={14} className="text-gray-400" />
          </p>
        </div>
        <div className="sm:hidden flex items-center gap-1">
          <span className="text-xs font-bold text-gray-900">USD</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-screen sm:w-80 max-w-[calc(100vw-2rem)] sm:max-w-none bg-white border border-gray-100 rounded-lg shadow-2xl z-[70] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <p className="text-2xs font-black text-gray-400 uppercase tracking-widest">Select Operational Region</p>
          </div>
          <div>
            <button
              onClick={() => handleSelectSegment(null)}
              className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left transition-all bg-red-50 text-redtab font-bold"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                <Globe size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm">Global Oversight</p>
                <p className="text-3xs uppercase font-bold opacity-50">Consolidated HQ View</p>
              </div>
              <CheckCircle size={14} />
            </button>
            <div className="h-px bg-gray-50 mx-4" />
            <button
              onClick={() => handleSelectSegment('nepal')}
              className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-gray-50 text-gray-600"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-900 font-black text-xs">
                रू
              </div>
              <div className="flex-1">
                <p className="text-sm">Nepal Region</p>
                <p className="text-3xs uppercase font-bold opacity-50">NPR Local Tender</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
