import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TierData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface CapitalExposureChartProps {
  tierData: TierData[];
}

export const CapitalExposureChart: React.FC<CapitalExposureChartProps> = ({ tierData }) => {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
      <h3 className="font-black text-2xs uppercase tracking-widest text-gray-400 mb-8">Capital Exposure Mix</h3>
      <div className="h-64">
        {tierData && tierData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={tierData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                {tierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm text-gray-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
