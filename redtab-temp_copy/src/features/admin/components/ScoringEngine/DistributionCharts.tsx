import React from 'react';
import { Globe, DollarSign, TrendingUp, Users, Building } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface CategoryBreakdown {
  title: string;
  subtitle: string;
  data: ChartDataItem[];
  icon: React.ComponentType<{ size: number }>;
}

interface DistributionChartsProps {
  globalData: ChartDataItem[];
  categoryBreakdowns: CategoryBreakdown[];
}

interface DistributionChartProps {
  title: string;
  subtitle: string;
  data: ChartDataItem[];
  icon: React.ComponentType<{ size: number }>;
}

const DistributionChart = ({ title, subtitle, data, icon: Icon }: DistributionChartProps) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
    <div className="w-full flex items-center gap-3 mb-4">
      <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
        <Icon size={18} />
      </div>
      <div>
        <h4 className="text-sm font-black text-gray-900 leading-none">{title}</h4>
        <p className="text-3xs font-bold text-gray-400 uppercase tracking-widest mt-1">{subtitle}</p>
      </div>
    </div>
    <div className="h-48 w-full">
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-xs text-gray-400 font-medium">No data available</p>
        </div>
      )}
    </div>
    {data && data.length > 0 && (
      <div className="w-full mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.slice(0, 3).map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }} />
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter truncate max-w-[80px]">{d.name}</span>
          </div>
        ))}
        {data.length > 3 && <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">+{data.length - 3} MORE</span>}
      </div>
    )}
  </div>
);

export const DistributionCharts: React.FC<DistributionChartsProps> = ({
  globalData,
  categoryBreakdowns,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <DistributionChart
          title="Global Distribution"
          subtitle="Primary Category Weights"
          data={globalData}
          icon={Globe}
        />
      </div>
      {categoryBreakdowns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryBreakdowns.map((breakdown) => (
            <DistributionChart
              key={breakdown.title}
              title={breakdown.title}
              subtitle={breakdown.subtitle}
              data={breakdown.data}
              icon={breakdown.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
};
