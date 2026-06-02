import React from 'react';
import { X } from 'lucide-react';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (e: React.FormEvent<HTMLFormElement>) => void;
  selectAllScopes: boolean;
  setSelectAllScopes: (v: boolean) => void;
};

export default function ApiKeyCreateModal({
  visible,
  onClose,
  onCreate,
  selectAllScopes,
  setSelectAllScopes,
}: Props) {
  if (!visible) return null;

  const handleSelectAllScopes = (checked: boolean) => {
    setSelectAllScopes(checked);
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"][name^="contracts-"], input[type="checkbox"][name^="repayments-"], input[type="checkbox"][name^="lines-"], input[type="checkbox"][name^="decisions-"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checked;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Create API Key</h3>
          <button
            onClick={() => {
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={onCreate}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-redtab focus:border-redtab"
                placeholder="Production API Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-redtab focus:border-redtab"
                placeholder="Used for production server"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Environment *
              </label>
              <select
                name="environment"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-redtab focus:border-redtab"
              >
                <option value="development">Development</option>
                <option value="production">Production</option>
                <option value="test">Test</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scopes *
              </label>
              <div className="space-y-2">
                <label className="flex items-center border-b border-gray-200 pb-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectAllScopes}
                    onChange={(e) => handleSelectAllScopes(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-900">Select All</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="contracts-read" className="mr-2 rounded" />
                  <span className="text-sm">contracts:read</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="contracts-create" className="mr-2 rounded" />
                  <span className="text-sm">contracts:create</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="repayments-post" className="mr-2 rounded" />
                  <span className="text-sm">repayments:post</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="lines-read" className="mr-2 rounded" />
                  <span className="text-sm">lines:read</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="decisions-read" className="mr-2 rounded" />
                  <span className="text-sm">decisions:read</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-bold text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-redtab text-white rounded-xl hover:bg-red-700 transition-all shadow-lg font-bold text-sm cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
