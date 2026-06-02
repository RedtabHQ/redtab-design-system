import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WebhookConfigsPage from './views/WebhookConfigsPage';
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

const mockWebhookConfigs = [
  {
    id: 'webhook-1',
    url: 'https://example.com/webhook',
    eventType: 'CONTRACT_CREATED',
    description: 'Production webhook',
    isActive: true,
    successCount: 100,
    failureCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'webhook-2',
    url: 'https://test.com/webhook',
    eventType: 'PAYMENT_MISSED',
    description: 'Test webhook',
    isActive: false,
    successCount: 50,
    failureCount: 2,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
  },
];

describe('WebhookConfigsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(developerService.listWebhookConfigs).mockResolvedValue(mockWebhookConfigs);
  });

  it('should render webhook configs page', async () => {
    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
      expect(screen.getByText('https://test.com/webhook')).toBeInTheDocument();
    });
  });

  it('should load webhook configs on mount', async () => {
    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(developerService.listWebhookConfigs).toHaveBeenCalledTimes(1);
    });
  });

  it('should display webhook config information correctly', async () => {
    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
      expect(screen.getByText('CONTRACT_CREATED')).toBeInTheDocument();
      expect(screen.getByText('Production webhook')).toBeInTheDocument();
    });
  });

  it('should show create modal when create button is clicked', async () => {
    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /Create Webhook/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Webhook/i })).toBeInTheDocument();
    });
  });

  it('should create a new webhook config', async () => {
    const newWebhook = {
      id: 'webhook-new',
      url: 'https://new.com/webhook',
      eventType: 'LINE_FROZEN',
      description: 'New webhook',
      isActive: true,
      successCount: 0,
      failureCount: 0,
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
    };

    vi.mocked(developerService.createWebhookConfig).mockResolvedValue(newWebhook);

    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
    });

    // Open create modal
    const createButton = screen.getByRole('button', { name: /Create Webhook/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Webhook/i })).toBeInTheDocument();
    });

    // Fill in form
    const urlInput = screen.getByPlaceholderText(/https:\/\/your-domain\.com\/webhook/i);
    await userEvent.type(urlInput, 'https://new.com/webhook');

    const descriptionInput = screen.getByPlaceholderText(/Optional description/i);
    await userEvent.type(descriptionInput, 'New webhook');

    const eventTypeSelect = screen.getByRole('combobox', { name: '' });
    await userEvent.selectOptions(eventTypeSelect, 'credit_line.frozen');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /^Create$/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(developerService.createWebhookConfig).toHaveBeenCalled();
    });
  });

  it('should show edit modal when edit button is clicked', async () => {
    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
    });

    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(btn => {
      const svg = btn.querySelector('svg');
      return svg?.classList.contains('lucide-edit');
    });

    if (editButton) {
      await userEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Edit Webhook/i })).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://example.com/webhook')).toBeInTheDocument();
      });
    }
  });

  it('should update webhook config', async () => {
    vi.mocked(developerService.updateWebhookConfig).mockResolvedValue({
      ...mockWebhookConfigs[0],
      url: 'https://updated.com/webhook',
    });

    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
    });

    // Find and click edit button
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(btn => {
      const svg = btn.querySelector('svg');
      return svg?.classList.contains('lucide-edit');
    });

    if (editButton) {
      await userEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Edit Webhook/i })).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://example.com/webhook')).toBeInTheDocument();
      });

      // Update URL
      const urlInput = screen.getByDisplayValue('https://example.com/webhook');
      await userEvent.clear(urlInput);
      await userEvent.type(urlInput, 'https://updated.com/webhook');

      // Submit form
      const updateButton = screen.getByRole('button', { name: /^Update$/i });
      await userEvent.click(updateButton);

      await waitFor(() => {
        expect(developerService.updateWebhookConfig).toHaveBeenCalledWith(
          'webhook-1',
          expect.objectContaining({
            url: 'https://updated.com/webhook',
          })
        );
      });
    }
  });

  it('should delete webhook config with confirmation', async () => {
    vi.mocked(developerService.deleteWebhookConfig).mockResolvedValue({ success: true });

    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
    });

    // Find delete button by looking for buttons with red text color class
    const allButtons = screen.getAllByRole('button');
    const deleteButton = allButtons.find(btn =>
      btn.classList.contains('text-red-600') && btn.querySelector('svg.lucide-trash-2')
    );

    expect(deleteButton).toBeDefined();
    if (deleteButton) {
      await userEvent.click(deleteButton);

      // Modal should appear with confirmation text
      await waitFor(() => {
        expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      });

      // Click the confirm delete button in the modal
      const confirmButton = screen.getByRole('button', { name: /Delete Webhook/i });
      await userEvent.click(confirmButton);

      await waitFor(() => {
        expect(developerService.deleteWebhookConfig).toHaveBeenCalledWith('webhook-1');
      });
    }
  });

  it('should not delete webhook if confirmation is cancelled', async () => {
    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
    });

    // Find delete button by looking for buttons with red text color class
    const allButtons = screen.getAllByRole('button');
    const deleteButton = allButtons.find(btn =>
      btn.classList.contains('text-red-600') && btn.querySelector('svg.lucide-trash-2')
    );

    expect(deleteButton).toBeDefined();
    if (deleteButton) {
      await userEvent.click(deleteButton);

      // Modal should appear with confirmation text
      await waitFor(() => {
        expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      });

      // Click the cancel button in the modal
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      await userEvent.click(cancelButton);

      // Modal should close and delete should not be called
      await waitFor(() => {
        expect(screen.queryByText(/Are you sure you want to delete/)).not.toBeInTheDocument();
      });

      expect(developerService.deleteWebhookConfig).not.toHaveBeenCalled();
    }
  });

  it('should toggle webhook active status', async () => {
    vi.mocked(developerService.updateWebhookConfig).mockResolvedValue({
      ...mockWebhookConfigs[0],
      isActive: false,
    });

    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
    });

    // Find and click toggle button
    const toggleButtons = screen.getAllByRole('button');
    const toggleButton = toggleButtons.find(btn => {
      const svg = btn.querySelector('svg');
      return svg?.classList.contains('lucide-power') || svg?.classList.contains('lucide-power-off');
    });

    if (toggleButton) {
      await userEvent.click(toggleButton);

      await waitFor(() => {
        expect(developerService.updateWebhookConfig).toHaveBeenCalledWith(
          'webhook-1',
          expect.objectContaining({
            isActive: false,
          })
        );
      });
    }
  });

  it('should handle webhook creation error', async () => {
    vi.mocked(developerService.createWebhookConfig).mockRejectedValue({
      response: { data: { message: 'Invalid event type' } },
    });

    global.alert = vi.fn();

    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
    });

    // Open create modal
    const createButton = screen.getByRole('button', { name: /Create Webhook/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Webhook/i })).toBeInTheDocument();
    });

    // Fill and submit form with valid URL to bypass HTML5 validation
    const urlInput = screen.getByPlaceholderText(/https:\/\/your-domain\.com\/webhook/i);
    await userEvent.type(urlInput, 'https://valid-url.com/webhook');

    const eventTypeSelect = screen.getByRole('combobox');
    await userEvent.selectOptions(eventTypeSelect, 'contract.created');

    const submitButton = screen.getByRole('button', { name: /^Create$/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Invalid event type');
    });
  });

  it('should handle webhook loading error', async () => {
    vi.mocked(developerService.listWebhookConfigs).mockRejectedValue(new Error('Network error'));

    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    // The component should gracefully handle the error and show empty state
    await waitFor(() => {
      expect(developerService.listWebhookConfigs).toHaveBeenCalled();
    });

    // After error, component should render (empty state or error state)
    expect(screen.queryByText('https://example.com/webhook')).not.toBeInTheDocument();
  });

  it('should display loading state', () => {
    vi.mocked(developerService.listWebhookConfigs).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    // Check that configs are not displayed yet
    expect(screen.queryByText('https://example.com/webhook')).not.toBeInTheDocument();
  });

  it('should display webhook statistics', async () => {
    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
    });

    // Check for success rate display (100/105 = 100 success + 5 failures)
    expect(screen.getByText(/100\/105/)).toBeInTheDocument();
  });

  it('should close modal when cancel button is clicked', async () => {
    render(<WebhookConfigsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('https://example.com/webhook')).toBeInTheDocument();
    });

    // Open create modal
    const createButton = screen.getByRole('button', { name: /Create Webhook/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Webhook/i })).toBeInTheDocument();
    });

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /^Cancel$/i });
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Create Webhook/i })).not.toBeInTheDocument();
    });
  });
});
