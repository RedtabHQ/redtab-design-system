import React from 'react';
import { Plus, Key } from 'lucide-react';

interface ApiKeysEmptyProps {
  onCreate: () => void;
}

export default function ApiKeysEmpty({ onCreate }: ApiKeysEmptyProps) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Key className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No API keys configured</h3>
      <p className="text-sm text-gray-500 mb-6">Get started by creating your first API key</p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-6 py-3 bg-redtab text-white rounded-xl hover:bg-red-700 transition-all shadow-lg font-bold text-sm"
      >
        <Plus className="h-5 w-5" />
        Create Your First API Key
      </button>
    </div>
  );
}
