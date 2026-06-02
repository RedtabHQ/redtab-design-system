import { useState } from 'react';
import { ApiKeyCreation } from '../../../types/developer';
import { Copy, Check, X } from 'lucide-react';

type Props = {
  createdKey: ApiKeyCreation;
  onClose: () => void;
};

export default function ApiKeyModal({ createdKey, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">API Key Created</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 mb-6 rounded-r-xl">
          <p className="text-sm text-yellow-800 font-medium">{createdKey.warning}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">API Key</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={createdKey.key}
              readOnly
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 font-mono text-sm"
            />
            <button
              onClick={() => copyToClipboard(createdKey.key)}
              className="px-6 py-3 bg-redtab text-white rounded-xl hover:bg-red-700 flex items-center gap-2 transition-all shadow-lg font-bold text-sm cursor-pointer"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-bold text-sm cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
