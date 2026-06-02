import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useToastContext } from '@/components/common/ToastContainer';

export const POLICY_CHECKLIST_TEMPLATE: Record<string, boolean> = {
  purpose: false,
  owner_id: false,
  reg_val: false,
  vat_pan: false,
  pep_check: false,
};

const createDefaultChecklist = () => ({ ...POLICY_CHECKLIST_TEMPLATE });

const getStorageKey = (providerId: string) => `policy-checklist-${providerId}`;

interface PolicyChecklistResponse {
  merchantId: string;
  providerId: string;
  policyChecklist: Record<string, boolean>;
  updatedAt?: string;
}

export interface UsePolicyChecklistResult {
  checklist: Record<string, boolean>;
  isLoading: boolean;
  error: Error | null;
  updatedAt: string | null;
  providerId: string | null;
  toggleItem: (key: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const usePolicyChecklist = (providerId?: string): UsePolicyChecklistResult => {
  const fallbackProviderId = useAuthStore((state) => state.user?.id);
  const effectiveProviderId = useMemo(
    () => providerId ?? fallbackProviderId ?? null,
    [providerId, fallbackProviderId]
  );
  const storageKey = useMemo(
    () => (effectiveProviderId ? getStorageKey(effectiveProviderId) : null),
    [effectiveProviderId]
  );

  const { show: showToast } = useToastContext();
  const isMountedRef = useRef(true);

  const [checklist, setChecklist] = useState<Record<string, boolean>>(createDefaultChecklist);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const checklistRef = useRef<Record<string, boolean>>(createDefaultChecklist());

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    checklistRef.current = checklist;
  }, [checklist]);

  const loadChecklistFromCache = useCallback(() => {
    const defaults = createDefaultChecklist();
    if (!storageKey || typeof window === 'undefined') {
      return defaults;
    }

    try {
      const cached = window.localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...defaults, ...parsed };
      }
    } catch (err) {
      console.warn('Failed to load cached policy checklist', err);
      window.localStorage.removeItem(storageKey);
    }

    window.localStorage.setItem(storageKey, JSON.stringify(defaults));
    return defaults;
  }, [storageKey]);

  const persistChecklist = useCallback(
    (data: Record<string, boolean>) => {
      if (!storageKey || typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (err) {
        console.warn('Failed to persist policy checklist cache', err);
      }
    },
    [storageKey]
  );

  const fetchChecklist = useCallback(async () => {
    if (!effectiveProviderId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<PolicyChecklistResponse>(
        `/merchants/${effectiveProviderId}/policy-checklist`
      );

      if (!isMountedRef.current) return;

      const normalized =
        response?.policyChecklist && typeof response.policyChecklist === 'object'
          ? response.policyChecklist
          : {};
      const merged = { ...createDefaultChecklist(), ...normalized };

      setChecklist(merged);
      setUpdatedAt(response?.updatedAt ?? null);
      persistChecklist(merged);
    } catch (err) {
      if (!isMountedRef.current) return;

      const fetchError = err instanceof Error ? err : new Error('Failed to load policy checklist');
      setError(fetchError);
      showToast({
        type: 'WARNING',
        title: 'Checklist Offline',
        message: 'Unable to sync the latest policy checklist. Showing cached values.',
      });
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [effectiveProviderId, persistChecklist, showToast]);

  useEffect(() => {
    const cached = loadChecklistFromCache();
    setChecklist(cached);
    setUpdatedAt(null);

    if (!effectiveProviderId) {
      setError(new Error('A provider ID is required to load the policy checklist.'));
      return;
    }

    fetchChecklist();
  }, [effectiveProviderId, loadChecklistFromCache, fetchChecklist]);

  const toggleItem = useCallback(
    async (key: string) => {
      const nextChecklist = {
        ...checklistRef.current,
        [key]: !checklistRef.current[key],
      };
      setChecklist(nextChecklist);
      checklistRef.current = nextChecklist;
      persistChecklist(nextChecklist);

      if (!effectiveProviderId) {
        showToast({
          type: 'INFO',
          title: 'Checklist saved locally',
          message: 'Connect to a merchant profile to sync these changes.',
        });
        return;
      }

      try {
        await apiClient.patch(`/merchants/${effectiveProviderId}/policy-checklist`, {
          policyChecklist: nextChecklist,
        });
        setUpdatedAt(new Date().toISOString());
      } catch (err) {
        console.error('Failed to update policy checklist', err);
        showToast({
          type: 'WARNING',
          title: 'Sync delayed',
          message: 'Checklist updated locally; backend sync will retry automatically.',
        });
      }
    },
    [effectiveProviderId, persistChecklist, showToast]
  );

  return {
    checklist,
    isLoading,
    error,
    updatedAt,
    providerId: effectiveProviderId,
    toggleItem,
    refresh: fetchChecklist,
  };
};
