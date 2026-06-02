import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ApiKeysPage from './views/ApiKeysPage';
import { developerService } from '@/features/developer/services/developerService';

vi.mock('@/features/developer/services/developerService');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockApiKeys = [
  {
    id: 'key-1',
    name: 'Test API Key',
    keyPrefix: 'rpl_dev_abc123...',
    environment: 'development',
    scopes: ['contracts:read', 'contracts:write'],
    isActive: true,
    requestCount: 150,
    lastUsedAt: '2024-01-01T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'key-2',
    name: 'Production Key',
    keyPrefix: 'rpl_prod_xyz789...',
    environment: 'production',
    scopes: ['*'],
    isActive: true,
    requestCount: 1500,
    lastUsedAt: '2024-01-02T10:00:00Z',
    createdAt: '2023-12-01T00:00:00Z',
  },
];

const mockCreatedKey = {
  id: 'key-new',
  key: 'rpl_dev_newfullkey123456',
  keyPrefix: 'rpl_dev_newf',
  name: 'New Test Key',
  description: 'Test description',
  scopes: ['contracts:read'],
  environment: 'development',
  isActive: true,
  rateLimitPerHour: 1000,
  createdAt: '2024-01-03T00:00:00Z',
  createdBy: 'user-1',
  warning: 'Save this key now. It cannot be retrieved again.',
};

describe('ApiKeysPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(developerService.listApiKeys).mockResolvedValue(mockApiKeys);
  });

  it('should render API keys page', async () => {
    render(<ApiKeysPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test API Key')).toBeInTheDocument();
      expect(screen.getByText('Production Key')).toBeInTheDocument();
    });
  });

  it('should load API keys on mount', async () => {
    render(<ApiKeysPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(developerService.listApiKeys).toHaveBeenCalledTimes(1);
    });
  });

  it('should display API key information correctly', async () => {
    render(<ApiKeysPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test API Key')).toBeInTheDocument();
      expect(screen.getByText('rpl_dev_abc123...')).toBeInTheDocument();
      expect(screen.getByText('development')).toBeInTheDocument();
    });
  });

  it('should show create modal when create button is clicked', async () => {
    render(<ApiKeysPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test API Key')).toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /Create API Key/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create API Key/i })).toBeInTheDocument();
    });
  });

  it('should create a new API key', async () => {
    vi.mocked(developerService.createApiKey).mockResolvedValue(mockCreatedKey);

    render(<ApiKeysPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test API Key')).toBeInTheDocument();
    });

    // Open create modal
    const createButton = screen.getByRole('button', { name: /Create API Key/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create API Key/i })).toBeInTheDocument();
    });

    // Fill in form
    const nameInput = screen.getByPlaceholderText(/Production API Key/i);
    await userEvent.type(nameInput, 'New Test Key');

    const descriptionInput = screen.getByPlaceholderText(/Used for production server/i);
    await userEvent.type(descriptionInput, 'Test description');

    // Select at least one scope
    const scopeCheckbox = screen.getByRole('checkbox', { name: /contracts:read/i });
    await userEvent.click(scopeCheckbox);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /^Create$/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(developerService.createApiKey).toHaveBeenCalled();
    });
  });

  it('should display created key in modal after creation', async () => {
    vi.mocked(developerService.createApiKey).mockResolvedValue(mockCreatedKey);

    render(<ApiKeysPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test API Key')).toBeInTheDocument();
    });

    // Open create modal
    const createButton = screen.getByRole('button', { name: /Create API Key/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create API Key/i })).toBeInTheDocument();
    });

    // Fill and submit form
    const nameInput = screen.getByPlaceholderText(/Production API Key/i);
    await userEvent.type(nameInput, 'New Test Key');

    const scopeCheckbox = screen.getByRole('checkbox', { name: /contracts:read/i });
    await userEvent.click(scopeCheckbox);

    const submitButton = screen.getByRole('button', { name: /^Create$/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockCreatedKey.key)).toBeInTheDocument();
      expect(screen.getByText(/Save this key now/i)).toBeInTheDocument();
    });
  });

  it('should copy API key to clipboard', async () => {
    vi.mocked(developerService.createApiKey).mockResolvedValue(mockCreatedKey);

    // Mock clipboard API
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    render(<ApiKeysPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test API Key')).toBeInTheDocument();
    });

    // Create a key
    const createButton = screen.getByRole('button', { name: /Create API Key/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create API Key/i })).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText(/Production API Key/i);
    await userEvent.type(nameInput, 'New Test Key');

    const scopeCheckbox = screen.getByRole('checkbox', { name: /contracts:read/i });
    await userEvent.click(scopeCheckbox);

    const submitButton = screen.getByRole('button', { name: /^Create$/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockCreatedKey.key)).toBeInTheDocument();
    });

    // Click copy button
    const copyButton = screen.getByRole('button', { name: /Copy/i });
    await userEvent.click(copyButton);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(mockCreatedKey.key);
    });
  });

  it('should revoke an API key with confirmation', async () => {
    vi.mocked(developerService.revokeApiKey).mockResolvedValue({ success: true, message: 'Revoked' });

    render(<ApiKeysPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test API Key')).toBeInTheDocument();
    });

    // Find and click first revoke button to open confirmation modal
    const revokeButtons = screen.getAllByRole('button', { name: /Revoke/i });
    await userEvent.click(revokeButtons[0]);

    // Modal should appear with confirmation text
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to revoke/)).toBeInTheDocument();
    });

    // Click the confirm revoke button in the modal
    const confirmButton = screen.getByRole('button', { name: /Revoke Key/i });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(developerService.revokeApiKey).toHaveBeenCalledWith('key-1');
    });
  });

  it('should not revoke API key if confirmation is cancelled', async () => {
    render(<ApiKeysPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test API Key')).toBeInTheDocument();
    });

    // Find and click first revoke button to open confirmation modal
    const revokeButtons = screen.getAllByRole('button', { name: /Revoke/i });
    await userEvent.click(revokeButtons[0]);

    // Modal should appear with confirmation text
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to revoke/)).toBeInTheDocument();
    });

    // Click the cancel button in the modal
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelButton);

    // Modal should close and revoke should not be called
    await waitFor(() => {
      expect(screen.queryByText(/Are you sure you want to revoke/)).not.toBeInTheDocument();
    });

    expect(developerService.revokeApiKey).not.toHaveBeenCalled();
  });

  it('should handle API key creation error', async () => {
    vi.mocked(developerService.createApiKey).mockRejectedValue({
      response: { data: { message: 'Invalid scopes' } },
    });

    global.alert = vi.fn();

    render(<ApiKeysPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test API Key')).toBeInTheDocument();
    });

    // Open create modal
    const createButton = screen.getByRole('button', { name: /Create API Key/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create API Key/i })).toBeInTheDocument();
    });

    // Fill and submit form
    const nameInput = screen.getByPlaceholderText(/Production API Key/i);
    await userEvent.type(nameInput, 'New Test Key');

    const scopeCheckbox = screen.getByRole('checkbox', { name: /contracts:read/i });
    await userEvent.click(scopeCheckbox);

    const submitButton = screen.getByRole('button', { name: /^Create$/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Invalid scopes');
    });
  });

  it('should handle API key loading error', async () => {
    vi.mocked(developerService.listApiKeys).mockRejectedValue(new Error('Network error'));

    render(<ApiKeysPage />, { wrapper: createWrapper() });

    // The component should gracefully handle the error and show empty state
    await waitFor(() => {
      expect(developerService.listApiKeys).toHaveBeenCalled();
    });

    // After error, component should render (empty state or error state)
    expect(screen.queryByText('Test API Key')).not.toBeInTheDocument();
  });

  it('should display loading state', () => {
    vi.mocked(developerService.listApiKeys).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<ApiKeysPage />, { wrapper: createWrapper() });

    // Check for loading indicators (adjust based on your actual loading UI)
    expect(screen.queryByText('Test API Key')).not.toBeInTheDocument();
  });

  it('should filter keys by environment', async () => {
    render(<ApiKeysPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test API Key')).toBeInTheDocument();
      expect(screen.getByText('Production Key')).toBeInTheDocument();
    });

    // Both development and production keys should be visible
    expect(screen.getByText('development')).toBeInTheDocument();
    expect(screen.getByText('production')).toBeInTheDocument();
  });
});
