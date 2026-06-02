import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { developerService } from '@/features/developer/services/developerService';
import { WebhookConfig, WebhookEventType } from '@/types/developer';
import { Plus, Webhook, X } from 'lucide-react';
import WebhookCard from '../components/WebhookCard';
import { ConfirmationModal } from '@/components/common';

const EVENT_TYPES = Object.values(WebhookEventType);

export default function WebhookConfigsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<WebhookConfig | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; url: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery<WebhookConfig[]>({
    queryKey: ['developer', 'webhook-configs'],
    queryFn: async () => {
      const response = await developerService.listWebhookConfigs();
      const data = (response as { items?: WebhookConfig[] }).items || response;
      return Array.isArray(data) ? data : [];
    },
  });

  const createWebhookMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => developerService.createWebhookConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer', 'webhook-configs'] });
      setShowCreateModal(false);
    },
    onError: (error: Error) => {
      const message = (error as unknown as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create webhook';
      alert(message);
    },
  });

  const updateWebhookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      developerService.updateWebhookConfig(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer', 'webhook-configs'] });
      setShowEditModal(false);
      setEditingConfig(null);
    },
    onError: (error: Error) => {
      const message = (error as unknown as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update webhook';
      alert(message);
    },
  });

  const deleteWebhookMutation = useMutation({
    mutationFn: (id: string) => developerService.deleteWebhookConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer', 'webhook-configs'] });
      setConfirmDelete(null);
    },
    onError: (error: Error) => {
      const message = (error as unknown as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete webhook';
      alert(message);
      setConfirmDelete(null);
    },
  });

  const toggleWebhookMutation = useMutation({
    mutationFn: (config: WebhookConfig) =>
      developerService.updateWebhookConfig(config.id, {
        ...config,
        isActive: !config.isActive,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer', 'webhook-configs'] });
    },
    onError: (error: Error) => {
      const message = (error as unknown as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to toggle webhook';
      alert(message);
    },
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const data: Record<string, unknown> = {
        url: formData.get('url'),
        eventType: formData.get('eventType'),
        description: formData.get('description'),
        secret: formData.get('secret'),
        maxRetries: parseInt(formData.get('maxRetries') as string) || 3,
        timeoutMs: parseInt(formData.get('timeoutMs') as string) || 10000,
      };

      await createWebhookMutation.mutateAsync(data);
    } catch {
      // Errors are handled in mutation onError
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingConfig) return;

    const formData = new FormData(e.currentTarget);

    try {
      const data: Record<string, unknown> = {
        url: formData.get('url'),
        eventType: formData.get('eventType'),
        description: formData.get('description'),
        secret: formData.get('secret'),
        isActive: formData.get('isActive') === 'true',
        maxRetries: parseInt(formData.get('maxRetries') as string) || 3,
        timeoutMs: parseInt(formData.get('timeoutMs') as string) || 10000,
      };

      await updateWebhookMutation.mutateAsync({ id: editingConfig.id, data });
    } catch {
      // Errors are handled in mutation onError
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await deleteWebhookMutation.mutateAsync(confirmDelete.id);
    } catch {
      // Errors are handled in mutation onError
    }
  };

  const handleToggleActive = async (config: WebhookConfig) => {
    try {
      await toggleWebhookMutation.mutateAsync(config);
    } catch {
      // Errors are handled in mutation onError
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Webhook Configurations</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure webhooks to receive real-time event notifications
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-redtab text-white rounded-lg hover:bg-red-700 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Webhook
        </button>
      </div>

      {/* Webhooks Grid */}
      <div className="grid grid-cols-1 gap-4">
        {configs.map((config) => (
          <WebhookCard
            key={config.id}
            config={config}
            onToggleActive={handleToggleActive}
            onEdit={(cfg) => {
              setEditingConfig(cfg);
              setShowEditModal(true);
            }}
            onDelete={(cfg) => setConfirmDelete({ id: cfg.id, url: cfg.url })}
          />
        ))}

        {configs.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first webhook configuration
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-redtab text-white rounded-lg hover:bg-red-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Webhook
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create Webhook</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL *
                  </label>
                  <input
                    type="url"
                    name="url"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://your-domain.com/webhook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secret (for HMAC signature)
                  </label>
                  <input
                    type="text"
                    name="secret"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Optional webhook secret"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Retries
                    </label>
                    <input
                      type="number"
                      name="maxRetries"
                      defaultValue={3}
                      min={0}
                      max={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timeout (ms)
                    </label>
                    <input
                      type="number"
                      name="timeoutMs"
                      defaultValue={10000}
                      min={1000}
                      max={60000}
                      step={1000}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-redtab text-white rounded-md hover:bg-red-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Webhook</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingConfig(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL *
                  </label>
                  <input
                    type="url"
                    name="url"
                    required
                    defaultValue={editingConfig.url}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    required
                    defaultValue={editingConfig.eventType}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="*" className="font-bold">* (All Events)</option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingConfig.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secret
                  </label>
                  <input
                    type="text"
                    name="secret"
                    defaultValue={editingConfig.secret || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="isActive"
                    defaultValue={editingConfig.isActive.toString()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Retries
                    </label>
                    <input
                      type="number"
                      name="maxRetries"
                      defaultValue={editingConfig.maxRetries}
                      min={0}
                      max={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timeout (ms)
                    </label>
                    <input
                      type="number"
                      name="timeoutMs"
                      defaultValue={editingConfig.timeoutMs}
                      min={1000}
                      max={60000}
                      step={1000}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingConfig(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-redtab text-white rounded-md hover:bg-red-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Webhook"
        message={`Are you sure you want to delete the webhook for "${confirmDelete?.url}"? This action cannot be undone.`}
        confirmText="Delete Webhook"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
}
