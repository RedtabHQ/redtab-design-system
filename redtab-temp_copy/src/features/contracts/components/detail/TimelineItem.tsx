import React from 'react';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  date: string;
  icon: React.ComponentType<{ size?: number }>;
  active: boolean;
}

/**
 * Timeline event item for lifecycle and communication tracking
 */
export const TimelineItem: React.FC<TimelineItemProps> = ({ title, subtitle, date, icon: Icon, active }) => (
  <div className="flex gap-6 relative group">
    <div className="flex flex-col items-center">
      <div className={`p-3 rounded-full z-10 ${active ? 'bg-redtab text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
        <Icon size={18} />
      </div>
      <div className="w-0.5 flex-1 bg-gray-100 group-last:hidden" />
    </div>
    <div className="pb-8">
      <div className="flex items-center gap-2">
        <h4 className={`text-sm font-black uppercase tracking-tight ${active ? 'text-gray-900' : 'text-gray-400'}`}>
          {title}
        </h4>
      </div>
      <p className="text-xs text-gray-500 mt-1 max-w-sm">{subtitle}</p>
      <span className="text-2xs font-mono text-gray-400">{date}</span>
    </div>
  </div>
);
