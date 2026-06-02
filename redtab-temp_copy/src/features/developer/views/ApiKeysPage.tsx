import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { developerService } from '@/features/developer/services/developerService';
import { ApiKey, ApiKeyCreation } from '@/types/developer';
import { Plus, Key, Trash2 } from 'lucide-react';
import ApiKeysEmpty from '../components/ApiKeysEmpty';
import ApiKeyCreateModal from '../components/ApiKeyCreateModal';
import ApiKeyModal from '../components/ApiKeyModal';
import { Table } from '@/components/common/Table';
import EnvironmentBadge from '@/components/common/EnvironmentBadge';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';
import { ConfirmationModal } from '@/components/common';
import { formatLocalized } from '@/utils/dateFormatter';

export default function ApiKeysPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [createdKey, setCreatedKey] = useState<ApiKeyCreation | null>(null);
  const [selectAllScopes, setSelectAllScopes] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState<{ id: string; name: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: apiKeys = [], isLoading } = useQuery<ApiKey[]>({
    queryKey: ['developer', 'api-keys', { isActive: true }],
    queryFn: async () => {
      const response = await developerService.listApiKeys({ isActive: true });
      const keys = (response as { items?: ApiKey[] }).items || response;
      return Array.isArray(keys) ? keys : [];
    },
  });

  const createApiKeyMutation = useMutation({
    mutationFn: (data: { name: string; scopes: string[]; environment: 'production' | 'development' | 'test' }) =>
      developerService.createApiKey(data),
    onSuccess: (result) => {
      setCreatedKey(result as ApiKeyCreation);
      setShowCreateModal(false);
      setShowKeyModal(true);
      queryClient.invalidateQueries({ queryKey: ['developer', 'api-keys'] });
    },
    onError: (error: Error) => {
      const err = error as unknown as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || 'Failed to create API key';
      alert(message);
    },
  });

  const revokeApiKeyMutation = useMutation({
    mutationFn: (id: string) => developerService.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer', 'api-keys'] });
      setConfirmRevoke(null);
    },
    onError: (error: Error) => {
      const err = error as unknown as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || 'Failed to revoke API key';
      alert(message);
      setConfirmRevoke(null);
    },
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const scopes = [];
    if (formData.get('contracts-read')) scopes.push('contracts:read');
    if (formData.get('contracts-create')) scopes.push('contracts:create');
    if (formData.get('repayments-post')) scopes.push('repayments:post');
    if (formData.get('lines-read')) scopes.push('lines:read');
    if (formData.get('decisions-read')) scopes.push('decisions:read');

    try {
      const name = formData.get('name');
      const environment = formData.get('environment') as 'production' | 'development' | 'test';
      if (typeof name !== 'string' || !name.trim()) {
        return;
      }

      await createApiKeyMutation.mutateAsync({
        name: name.trim(),
        scopes,
        environment,
      });
    } catch {
      // Errors are handled in mutation onError
    }
  };

  const handleRevoke = async () => {
    if (!confirmRevoke) return;

    try {
      await revokeApiKeyMutation.mutateAsync(confirmRevoke.id);
    } catch {
      // Errors are handled in mutation onError
    }
  };

  const handleSelectAllScopes = (checked: boolean) => {
    setSelectAllScopes(checked);
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"][name^="contracts-"], input[type="checkbox"][name^="repayments-"], input[type="checkbox"][name^="lines-"], input[type="checkbox"][name^="decisions-"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = checked;
    });
  };

  const columns = [
    {
      key: 'name' as keyof ApiKey,
      label: 'API Key Name',
      render: (_value: unknown, key: ApiKey) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <Key className="h-5 w-5 text-redtab" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{key.name}</p>
            <p className="text-xs text-gray-500 font-mono">{key.keyPrefix}</p>
          </div>
        </div>
      ),
      width: 'px-8 py-5'
    },
    {
      key: 'environment' as keyof ApiKey,
      label: 'Environment',
      render: (_value: unknown, key: ApiKey) => <EnvironmentBadge environment={key.environment} />,
      width: 'px-6 py-5'
    },
    {
      key: 'scopes' as keyof ApiKey,
      label: 'Scopes',
      render: (_value: unknown, key: ApiKey) => (
        <div className="flex flex-wrap gap-1">
          {(key.scopes || []).map((scope) => (
            <span
              key={scope}
              className="px-2 py-0.5 text-xs bg-red-50 text-redtab rounded border border-red-200"
            >
              {scope}
            </span>
          ))}
        </div>
      ),
      width: 'px-6 py-5'
    },
    {
      key: 'requestCount' as keyof ApiKey,
      label: 'Requests',
      render: (_value: unknown, key: ApiKey) => (
        <span className="text-sm font-medium text-gray-900">
          {parseInt(key.requestCount || '0').toLocaleString(DEFAULT_CURRENCY_LOCALE)}
        </span>
      ),
      width: 'px-6 py-5'
    },
    {
      key: 'lastUsedAt' as keyof ApiKey,
      label: 'Last Used',
      render: (_value: unknown, key: ApiKey) => (
        <span className="text-xs text-gray-500">
          {key.lastUsedAt ? formatLocalized(key.lastUsedAt, 'PP') : 'Never'}
        </span>
      ),
      width: 'px-6 py-5'
    },
    {
      key: 'id' as keyof ApiKey,
      label: 'Actions',
      render: (_value: unknown, key: ApiKey) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setConfirmRevoke({ id: key.id, name: key.name });
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Revoke
        </button>
      ),
      width: 'px-6 py-5'
    },
  ];

  return (
    <div className="mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">API Keys</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            Create and manage API keys for programmatic access
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-redtab text-white rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl font-bold text-sm"
        >
          <Plus className="h-5 w-5" />
          Create API Key
        </button>
      </div>

      {/* API Keys Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          data={apiKeys}
          keyExtractor={(key) => key.id}
          loading={isLoading}
          emptyMessage={<ApiKeysEmpty onCreate={() => setShowCreateModal(true)} />}
        />
      </div>

      {/* Create Modal */}
      <ApiKeyCreateModal
        visible={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectAllScopes(false);
        }}
        onCreate={handleCreate}
        selectAllScopes={selectAllScopes}
        setSelectAllScopes={setSelectAllScopes}
      />

      {/* Show Key Modal */}
      {showKeyModal && createdKey && (
        <ApiKeyModal createdKey={createdKey} onClose={() => setShowKeyModal(false)} />
      )}

      {/* Confirm Revoke Modal */}
      <ConfirmationModal
        isOpen={!!confirmRevoke}
        onCancel={() => setConfirmRevoke(null)}
        onConfirm={handleRevoke}
        title="Revoke API Key"
        message={`Are you sure you want to revoke "${confirmRevoke?.name}"? This action cannot be undone and will immediately invalidate this API key.`}
        confirmText="Revoke Key"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
}
