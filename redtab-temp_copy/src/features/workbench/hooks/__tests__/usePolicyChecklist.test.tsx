import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/components/common/ToastContainer', () => ({
  useToastContext: vi.fn(),
}));

import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useToastContext } from '@/components/common/ToastContainer';
import { usePolicyChecklist } from '../usePolicyChecklist';

describe('usePolicyChecklist', () => {
  const authState = { user: { id: 'merchant-123' } };
  let showToast: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorage.clear();
    showToast = vi.fn();
    vi.clearAllMocks();

    vi.mocked(useAuthStore).mockImplementation(<T,>(selector?: (state: typeof authState) => T) => {
      if (selector) {
        return selector(authState as typeof authState);
      }
      return authState as T;
    });

    vi.mocked(useToastContext).mockReturnValue({
      show: showToast,
    } as ReturnType<typeof useToastContext>);
  });

  it('fetches checklist on mount and hydrates local storage', async () => {
    const serverResponse = {
      merchantId: 'merchant-123',
      providerId: 'merchant-123',
      policyChecklist: { purpose: true, pep_check: true },
      updatedAt: '2025-01-15T00:00:00.000Z',
    };
    vi.mocked(apiClient.get).mockResolvedValueOnce(serverResponse);

    const { result } = renderHook(() => usePolicyChecklist());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(apiClient.get).toHaveBeenCalledWith('/merchants/merchant-123/policy-checklist');
    expect(result.current.checklist.purpose).toBe(true);
    expect(result.current.checklist.pep_check).toBe(true);
    expect(result.current.updatedAt).toBe(serverResponse.updatedAt);

    const cached = localStorage.getItem('policy-checklist-merchant-123');
    expect(cached).toBeTruthy();
    expect(JSON.parse(cached as string)).toMatchObject({ purpose: true, pep_check: true });
  });

  it('optimistically toggles items and syncs with PATCH', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      merchantId: 'merchant-123',
      providerId: 'merchant-123',
      policyChecklist: { purpose: false },
    });
    vi.mocked(apiClient.patch).mockResolvedValueOnce({});

    const { result } = renderHook(() => usePolicyChecklist());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.toggleItem('purpose');
    });

    expect(apiClient.patch).toHaveBeenCalledWith('/merchants/merchant-123/policy-checklist', {
      policyChecklist: expect.objectContaining({ purpose: true }),
    });

    const cached = localStorage.getItem('policy-checklist-merchant-123');
    expect(JSON.parse(cached as string).purpose).toBe(true);
  });

  it('surfaces offline warning when fetch fails but retains cached data', async () => {
    const cachedChecklist = { purpose: false, pep_check: true };
    localStorage.setItem('policy-checklist-merchant-123', JSON.stringify(cachedChecklist));
    const networkError = new Error('Network down');

    vi.mocked(apiClient.get).mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => usePolicyChecklist());

    await waitFor(() => expect(result.current.error).toBe(networkError));
    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Checklist Offline' })
    );
    expect(result.current.checklist).toMatchObject(cachedChecklist);
  });
});
