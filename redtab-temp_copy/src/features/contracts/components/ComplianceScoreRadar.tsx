import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

interface ComplianceScoreRadarProps {
  data?: RadarData[];
}

export const ComplianceScoreRadar: React.FC<ComplianceScoreRadarProps> = ({
  data = [
    { subject: 'PURCHASE', A: 85, fullMark: 100 },
    { subject: 'POS', A: 70, fullMark: 100 },
    { subject: 'CASH', A: 75, fullMark: 100 },
    { subject: 'BUSINESS', A: 90, fullMark: 100 },
    { subject: 'SOCIAL', A: 65, fullMark: 100 },
  ]
}) => {
  return (
    <div className="bg-gray-900 p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-8">
      <h4 className="text-2xs font-black text-gray-400 uppercase tracking-widest">MULTIDIMENSIONAL TRUST RADAR</h4>
      <div className="h-64 w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} />
              <Radar name="Score" dataKey="A" stroke="#E61E2A" fill="#E61E2A" fillOpacity={0.6} />
            </RadarChart>
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
