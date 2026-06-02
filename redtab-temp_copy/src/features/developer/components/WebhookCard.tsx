import React from 'react';
import { Webhook, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { WebhookConfig } from '@/types/developer';
import { formatDateTime } from '@/utils/dateFormatter';

type Props = {
  config: WebhookConfig;
  onToggleActive: (config: WebhookConfig) => void;
  onEdit: (config: WebhookConfig) => void;
  onDelete: (config: WebhookConfig) => void;
};

export default function WebhookCard({ config, onToggleActive, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Webhook className="h-5 w-5 text-redtab" />
            <h3 className="text-lg font-medium text-gray-900">{config.url}</h3>
            <StatusBadge type="webhook" status={config.isActive ? 'active' : 'inactive'} />
          </div>

          {config.description && (
            <p className="text-sm text-gray-600 mb-3">{config.description}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Event:</span>
              <span className="ml-2 font-mono text-redtab">{config.eventType}</span>
            </div>
            <div>
              <span className="text-gray-500">Max Retries:</span>
              <span className="ml-2 font-medium">{config.maxRetries}</span>
            </div>
            <div>
              <span className="text-gray-500">Timeout:</span>
              <span className="ml-2 font-medium">{config.timeoutMs}ms</span>
            </div>
            <div>
              <span className="text-gray-500">Success Rate:</span>
              <span className="ml-2 font-medium">
                {config.successCount}/{parseInt(config.successCount) + parseInt(config.failureCount)}
              </span>
            </div>
          </div>

          {config.lastTriggeredAt && (
            <div className="mt-3 text-xs text-gray-500">
              Last triggered: {formatDateTime(config.lastTriggeredAt)}
            </div>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onToggleActive(config)}
            className={`p-2 rounded-lg cursor-pointer ${
              config.isActive
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-redtab hover:bg-red-50'
            }`}
            title={config.isActive ? 'Deactivate' : 'Activate'}
          >
            {config.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onEdit(config)}
            className="p-2 text-redtab hover:bg-red-50 rounded-lg cursor-pointer"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(config)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
