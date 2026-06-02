import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PolicyVaultPage } from '../PolicyVaultPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('@/features/workbench/hooks/usePolicyChecklist', () => ({
  usePolicyChecklist: vi.fn(),
}));

import { useParams } from 'react-router-dom';
import { usePolicyChecklist } from '@/features/workbench/hooks/usePolicyChecklist';

describe('PolicyVaultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ merchantId: undefined } as any);
  });

  it('renders checklist items and triggers toggle through the hook', () => {
    const toggleItem = vi.fn().mockResolvedValue(undefined);
    vi.mocked(usePolicyChecklist).mockReturnValue({
      checklist: {
        purpose: true,
        owner_id: false,
        reg_val: false,
        vat_pan: false,
        pep_check: false,
      },
      isLoading: false,
      error: null,
      updatedAt: '2025-02-01T12:00:00Z',
      providerId: 'merchant-abc',
      toggleItem,
      refresh: vi.fn(),
    });

    render(<PolicyVaultPage providerId="merchant-abc" />);

    expect(screen.getByText('Business purpose matches category')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Business purpose matches category'));

    expect(toggleItem).toHaveBeenCalledWith('purpose');
    expect(usePolicyChecklist).toHaveBeenCalledWith('merchant-abc');
  });

  it('shows a loading indicator when data is syncing', () => {
    vi.mocked(usePolicyChecklist).mockReturnValue({
      checklist: {},
      isLoading: true,
      error: null,
      updatedAt: null,
      providerId: 'merchant-abc',
      toggleItem: vi.fn(),
      refresh: vi.fn(),
    });

    render(<PolicyVaultPage providerId="merchant-abc" />);

    expect(screen.getByTestId('policy-checklist-loading')).toBeInTheDocument();
  });

  it('displays an offline banner when the hook reports an error', () => {
    vi.mocked(usePolicyChecklist).mockReturnValue({
      checklist: { pep_check: true },
      isLoading: false,
      error: new Error('Network down'),
      updatedAt: null,
      providerId: 'merchant-abc',
      toggleItem: vi.fn(),
      refresh: vi.fn(),
    });

    render(<PolicyVaultPage providerId="merchant-abc" />);

    expect(screen.getByTestId('policy-checklist-alert')).toBeInTheDocument();
    expect(screen.getByText(/offline mode/i)).toBeInTheDocument();
  });
});
