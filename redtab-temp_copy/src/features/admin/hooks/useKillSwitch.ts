import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { systemApi } from '@/features/admin/services/systemApi';
import { useSystemConfig, systemKeys } from '@/features/admin/hooks/useSystem';
import { useToastContext } from '@/components/common/ToastContainer';

export const useKillSwitch = () => {
  const { data: systemConfig, isLoading: isConfigLoading } = useSystemConfig();
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { show: showToast } = useToastContext();

  useEffect(() => {
    if (systemConfig) {
      setKillSwitchActive(systemConfig.killSwitchEnabled);
    }
  }, [systemConfig]);

  const mutation = useMutation({
    mutationFn: (enabled: boolean) => systemApi.toggleKillSwitch(enabled),
    onSuccess: (data, enabled) => {
      setKillSwitchActive(data.killSwitchEnabled ?? enabled);
      queryClient.invalidateQueries({ queryKey: systemKeys.config() });
      showToast({
        type: 'SUCCESS',
        title: 'Kill Switch Updated',
        message: enabled ? 'System freeze enabled.' : 'System freeze disabled.',
      });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to toggle kill switch';
      setError(message);
      showToast({
        type: 'DANGER',
        title: 'Update Failed',
        message,
      });
    },
  });

  const toggleKillSwitch = async (enabled: boolean, _reason?: string) => {
    setError(null);
    try {
      await mutation.mutateAsync(enabled);
      return true;
    } catch {
      return false;
    }
  };

  return {
    killSwitchActive,
    toggleKillSwitch,
    isLoading: isConfigLoading || mutation.isPending,
    error,
  };
};
