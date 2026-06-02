import React from 'react';
import { Shield } from 'lucide-react';

export interface MetadataField {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  highlight?: boolean;
}

interface InfrastructureMetadataProps {
  providerId: string;
  fields: MetadataField[];
}

export const InfrastructureMetadata: React.FC<InfrastructureMetadataProps> = ({ providerId, fields }) => (
  <div className="bg-gray-900 p-10 rounded-xl text-white shadow-2xl space-y-6">
    <div className="flex items-center gap-3">
      <Shield className="text-redtab" size={24} />
      <h3 className="font-bold text-lg">Infrastructure Metadata</h3>
    </div>
    <div className="text-sm text-gray-300 space-y-4">
      <div className="space-y-1">
        <p className="text-2xs font-black text-gray-500 uppercase tracking-widest">Provider ID</p>
        <p className="text-sm font-mono text-gray-300 text-ellipsis overflow-hidden whitespace-nowrap">{providerId || 'N/A'}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {fields.map((field) => (
        <div key={field.label} className="space-y-1">
          <p className="text-2xs font-black text-gray-500 uppercase tracking-widest">{field.label}</p>
          <p className={`text-sm font-bold ${field.mono ? 'font-mono text-gray-300' : ''} ${field.highlight ? 'text-green-500' : 'text-gray-300'}`}>
            {field.value}
          </p>
        </div>
      ))}
    </div>
  </div>
);
