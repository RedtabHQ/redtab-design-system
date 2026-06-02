import { Layers } from 'lucide-react';
import React from 'react';
import { 
  ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line
} from 'recharts';

interface ChartSectionProps {
  chartData: Array<{
    date: string;
    out: number;
    in: number;
    pred?: number;
  }>;
  isForecastMode: boolean;
  currencySymbol: string;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ 
  chartData, 
  isForecastMode, 
  currencySymbol 
}) => {
  return (
    <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-2xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Layers size={18} className="text-redtab" /> Operational Flow Dynamics
        </h3>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-red-50 text-red-600 text-3xs font-black rounded-full border border-red-100 uppercase">Payouts</span>
           <span className="px-3 py-1 bg-green-50 text-green-600 text-3xs font-black rounded-full border border-green-100 uppercase">Collections</span>
        </div>
      </div>
      <div className="h-80">
         {chartData && chartData.length > 0 ? (
           <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
               <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
               <YAxis hide />
               <Tooltip 
                 contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}
                 itemStyle={{fontSize: '11px', fontWeight: '900', textTransform: 'uppercase'}}
               />
               <Area type="monotone" dataKey="out" stroke="#ef4444" strokeWidth={3} fillOpacity={0.05} fill="#ef4444" name="Outbound" />
               <Area type="monotone" dataKey="in" stroke="#22c55e" strokeWidth={3} fillOpacity={0.05} fill="#22c55e" name="Inbound" />
               {isForecastMode && (
                 <Line type="monotone" dataKey="pred" stroke="#6366f1" strokeWidth={4} strokeDasharray="8 8" dot={false} name="AI Projection" />
               )}
            </ComposedChart>
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