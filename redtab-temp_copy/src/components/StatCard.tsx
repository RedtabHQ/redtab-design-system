import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  change,
  icon,
  trend,
  onClick,
}) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const trendIcon = trend === 'up' ? <TrendingUp size={16} /> : trend === 'down' ? <TrendingDown size={16} /> : null;

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all ${
        onClick ? 'hover:shadow-lg hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        </div>
        {icon && <div className="text-redtab opacity-60">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {unit && <span className="text-sm text-gray-500 font-medium">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          {trendIcon}
          <span>{Math.abs(change)}% from last period</span>
        </div>
      )}
    </div>
  );
};
