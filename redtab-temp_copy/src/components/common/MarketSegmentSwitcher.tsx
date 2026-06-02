import React, { useState } from 'react';
import { Globe, CheckCircle, ChevronDown } from 'lucide-react';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import { MarketSegment } from '@/types';
import { DEFAULT_GLOBAL_CURRENCY_SYMBOL } from '@/constants/currency';
import { useExchangeRate } from '@/contexts';
import { useCurrency, useCurrencyByCode } from '@/hooks/useCurrency';

export const MarketSegmentSwitcher: React.FC = () => {
  const { selectedSegment, setSelectedSegment, availableSegments, isGlobalView } = useMarketSegment();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useClickOutside(() => setIsOpen(false), isOpen);

  const handleSelectSegment = (segment: MarketSegment | null) => {
    setSelectedSegment(segment);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg hover:bg-white hover:shadow-md transition-all flex-shrink-0"
      >
        <div className={`p-1.5 rounded-lg ${isGlobalView ? 'bg-gray-900 text-white' : 'bg-redtab text-white'}`}>
          <Globe size={16} className="sm:w-[18px] sm:h-[18px]" />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-2xs font-black text-gray-400 uppercase tracking-widest leading-none">Market Segment</p>
          <p className="text-sm font-black text-gray-900 mt-1 flex items-center gap-1.5">
            {isGlobalView ? 'Global / HQ' : selectedSegment?.name}
            <ChevronDown size={14} className="text-gray-400" />
          </p>
        </div>
        <div className="sm:hidden flex items-center gap-1">
          <span className="text-xs font-bold text-gray-900">
            {isGlobalView ? 'HQ' : selectedSegment?.currency || 'NPR'}
          </span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-screen sm:w-80 max-w-[calc(100vw-2rem)] sm:max-w-none bg-white border border-gray-100 rounded-lg shadow-2xl z-[70] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <p className="text-2xs font-black text-gray-400 uppercase tracking-widest">Select Operational Region</p>
          </div>
          <div>
            <button
              onClick={() => handleSelectSegment(null)}
              className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${isGlobalView ? 'bg-red-50 text-redtab font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white"><Globe size={16} /></div>
              <div className="flex-1">
                <p className="text-sm">Global Oversight</p>
                <p className="text-3xs uppercase font-bold opacity-50">Consolidated HQ View</p>
              </div>
              {isGlobalView && <CheckCircle size={14} />}
            </button>
            <div className="h-px bg-gray-50 mx-4" />
            {(availableSegments as MarketSegment[]).map(segment => (
              <MarketSegmentItem selectedSegment={selectedSegment} segment={segment} onSegmentClick={handleSelectSegment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


interface MarketSegmentItemProps {
  segment: MarketSegment;
  selectedSegment?: MarketSegment | null;
  onSegmentClick: (item: MarketSegment) => void;
}

const MarketSegmentItem = ({ selectedSegment, segment, onSegmentClick }: MarketSegmentItemProps) => {

  const { data, isFetching } = useCurrencyByCode(segment.currency);

  const rate = data?.exchangeRate;

  return (
    <button
      key={segment.id}
      onClick={() => onSegmentClick(segment)}
      className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${selectedSegment?.id === segment.id ? 'bg-red-50 text-redtab font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
    >
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-900 font-black text-xs">{data?.symbol ?? data?.symbol ?? ''}</div>
      <div className="flex-1">
        <p className="text-sm">{segment.name}</p>
        <p className="text-3xs uppercase font-bold opacity-50">{segment.currency} Local Tender</p>
        {isFetching ? (
          <p className="text-3xs uppercase font-bold opacity-50">-- {segment.currency}/{DEFAULT_GLOBAL_CURRENCY_SYMBOL}</p>
        ) : (
          <p className="text-3xs uppercase font-bold opacity-50">{rate} {segment?.code}/{DEFAULT_GLOBAL_CURRENCY_SYMBOL}</p>
        )}
      </div>
      {selectedSegment?.id === segment.id && <CheckCircle size={14} />}
    </button>
  );
}