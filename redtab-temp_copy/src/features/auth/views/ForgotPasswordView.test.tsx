import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@test/test-utils';
import ForgotPasswordView from './ForgotPasswordView';
import * as authHooks from '../hooks/useAuth';

// Mock the hooks
vi.mock('../hooks/useAuth');

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ForgotPasswordView', () => {
  const mockForgotPassword = {
    mutateAsync: vi.fn(),
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
    data: undefined,
    reset: vi.fn(),
    status: 'idle' as const,
    isIdle: true,
    variables: undefined,
    context: undefined,
    failureCount: 0,
    failureReason: null,
    submittedAt: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHooks.useForgotPassword).mockReturnValue(mockForgotPassword);
  });

  describe('Rendering', () => {
    it('should render the page title', () => {
      render(<ForgotPasswordView />);

      expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    });

    it('should render description text', () => {
      render(<ForgotPasswordView />);

      expect(
        screen.getByText(/Enter your account email and we'll send you a link to reset your password/i)
      ).toBeInTheDocument();
    });

    it('should render email input field', () => {
      render(<ForgotPasswordView />);

      expect(screen.getByPlaceholderText('you@company.com')).toBeInTheDocument();
    });

    it('should render email label', () => {
      render(<ForgotPasswordView />);

      expect(screen.getByText('Email Address')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<ForgotPasswordView />);

      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    });

    it('should render back to sign in link', () => {
      render(<ForgotPasswordView />);

      expect(screen.getByRole('button', { name: /back to sign in/i })).toBeInTheDocument();
    });

    it('should render email icon', () => {
      render(<ForgotPasswordView />);

      const emailInput = screen.getByPlaceholderText('you@company.com');
      const icon = emailInput.parentElement?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty email', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordView />);

      const emailInput = screen.getByPlaceholderText('you@company.com');
      await user.click(emailInput);
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('should not show error for valid email', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordView />);

      const emailInput = screen.getByPlaceholderText('you@company.com');
      await user.type(emailInput, 'test@example.com');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });

    it('should prevent form submission with empty email', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordView />);

      const submitButton = screen.getByRole('button', { name: /send reset link/i });
      await user.click(submitButton);

      expect(mockForgotPassword.mutateAsync).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid email', async () => {
      const user = userEvent.setup();
      mockForgotPassword.mutateAsync.mockResolvedValueOnce(undefined);

      render(<ForgotPasswordView />);

      const emailInput = screen.getByPlaceholderText('you@company.com');
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send reset link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockForgotPassword.mutateAsync).toHaveBeenCalledWith('test@example.com');
      });
    });

    it('should navigate to login after successful submission', async () => {
      const user = userEvent.setup();
      mockForgotPassword.mutateAsync.mockResolvedValueOnce(undefined);

      render(<ForgotPasswordView />);

      const emailInput = screen.getByPlaceholderText('you@company.com');
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send reset link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
      });
    });

    it('should handle submission error gracefully', async () => {
      const user = userEvent.setup();
      mockForgotPassword.mutateAsync.mockRejectedValueOnce(new Error('User not found'));

      render(<ForgotPasswordView />);

      const emailInput = screen.getByPlaceholderText('you@company.com');
      await user.type(emailInput, 'notfound@example.com');

      const submitButton = screen.getByRole('button', { name: /send reset link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockForgotPassword.mutateAsync).toHaveBeenCalled();
      });

      // Component should not crash
      expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();

      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>(resolve => {
        resolveSubmit = resolve;
      });
      mockForgotPassword.mutateAsync.mockReturnValue(submitPromise);

      render(<ForgotPasswordView />);

      const emailInput = screen.getByPlaceholderText('you@company.com');
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send reset link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument();
      });

      resolveSubmit!();

      await waitFor(() => {
        expect(screen.queryByText('Sending...')).not.toBeInTheDocument();
      });
    });

    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();

      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>(resolve => {
        resolveSubmit = resolve;
      });
      mockForgotPassword.mutateAsync.mockReturnValue(submitPromise);

      render(<ForgotPasswordView />);

      const emailInput = screen.getByPlaceholderText('you@company.com');
      await user.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /send reset link/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      resolveSubmit!();

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to login when clicking back to sign in', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordView />);

      const backButton = screen.getByRole('button', { name: /back to sign in/i });
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Accessibility', () => {
    it('should have proper label for email input', () => {
      render(<ForgotPasswordView />);

      const label = screen.getByText('Email Address');
      expect(label).toBeInTheDocument();
    });

    it('should apply error styling to email input on validation error', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordView />);

      const emailInput = screen.getByPlaceholderText('you@company.com');
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        expect(emailInput).toHaveClass('border-red-300');
      });
    });

    it('should have proper button type for submit', () => {
      render(<ForgotPasswordView />);

      const submitButton = screen.getByRole('button', { name: /send reset link/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('User Interaction', () => {
    it('should update input value when typing', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordView />);

      const emailInput = screen.getByPlaceholderText('you@company.com');
      await user.type(emailInput, 'user@test.com');

      expect(emailInput).toHaveValue('user@test.com');
    });

    it('should clear validation error when user types valid email', async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordView />);

      const emailInput = screen.getByPlaceholderText('you@company.com');

      // First trigger validation error
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      // Then type valid email
      await user.type(emailInput, 'valid@email.com');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });
  });
});
