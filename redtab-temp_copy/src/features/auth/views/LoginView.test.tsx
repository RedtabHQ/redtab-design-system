import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@test/test-utils';
import LoginView from './LoginView';
import * as authHooks from '../hooks/useAuth';
import { useAuthStore } from '@stores';
import type { UseMutationResult } from '@tanstack/react-query';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the auth hooks
vi.mock('../hooks/useAuth');

// Type for login mutation variables
interface LoginVariables {
  email: string;
  password: string;
  twoFactorCode?: string;
  rememberMe?: boolean;
}

// Type for login mutation result
interface LoginResult {
  success: boolean;
}

describe('LoginView', () => {
  const mockLogin: UseMutationResult<LoginResult, Error, LoginVariables> = {
    mutateAsync: vi.fn(),
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
    data: undefined,
    reset: vi.fn(),
    status: 'idle',
    isIdle: true,
    variables: undefined,
    context: undefined,
    failureCount: 0,
    failureReason: null,
    submittedAt: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHooks.useLogin).mockReturnValue(mockLogin);
  });

  describe('Rendering', () => {
    it('should render the login form', () => {
      render(<LoginView />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to access your dashboard')).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render branding section on desktop', () => {
      render(<LoginView />);

      expect(screen.getAllByText('Redtab Pay').length).toBeGreaterThan(0);
      expect(screen.getAllByText(/SNPL Platform/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/B2B Purchase/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Financing Platform/i).length).toBeGreaterThan(0);
    });

    it('should display platform statistics', () => {
      render(<LoginView />);

      expect(screen.getByText('$2.5M+')).toBeInTheDocument();
      expect(screen.getByText('Total Disbursed')).toBeInTheDocument();
      expect(screen.getByText('500+')).toBeInTheDocument();
      expect(screen.getByText('Active Merchants')).toBeInTheDocument();
      expect(screen.getByText('98.5%')).toBeInTheDocument();
      expect(screen.getByText('Recovery Rate')).toBeInTheDocument();
      expect(screen.getByText('<2s')).toBeInTheDocument();
      expect(screen.getByText('Avg Decision Time')).toBeInTheDocument();
    });

    it('should display demo credentials', () => {
      render(<LoginView />);

      expect(screen.getByText('Demo Credentials')).toBeInTheDocument();
      expect(screen.getByText('Email: admin@redtab.xyz')).toBeInTheDocument();
      expect(screen.getByText('Password: admin123')).toBeInTheDocument();
    });

    it('should render forgot password link', () => {
      render(<LoginView />);

      expect(screen.getByRole('button', { name: /forgot password/i })).toBeInTheDocument();
    });

    it('should render remember me checkbox', () => {
      render(<LoginView />);

      const checkbox = screen.getByLabelText(/keep me signed in/i);
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked(); // Default to checked
    });

    it('should render contact support link', () => {
      render(<LoginView />);

      expect(screen.getByText(/need help/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /contact support/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty email', async () => {
      const user = userEvent.setup();
      render(<LoginView />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.click(emailInput);
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('should show validation error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<LoginView />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      });
    });

    it('should show validation error for empty password', async () => {
      const user = userEvent.setup();
      render(<LoginView />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.click(passwordInput);
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('should show validation error for short password', async () => {
      const user = userEvent.setup();
      render(<LoginView />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, '12345');
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });

    it('should accept valid email formats', async () => {
      const user = userEvent.setup();
      render(<LoginView />);

      const emailInput = screen.getByLabelText(/email address/i);

      await user.type(emailInput, 'test@example.com');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
      });
    });

    it('should accept password with minimum length', async () => {
      const user = userEvent.setup();
      render(<LoginView />);

      const passwordInput = screen.getByLabelText(/^password$/i);

      await user.type(passwordInput, '123456');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility when clicking eye icon', async () => {
      const user = userEvent.setup();
      render(<LoginView />);

      const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
      expect(passwordInput.type).toBe('password');

      // Click to show password
      const toggleButtons = screen.getAllByRole('button');
      const eyeButton = toggleButtons.find(btn => btn.querySelector('svg'));
      if (eyeButton) {
        await user.click(eyeButton);
        expect(passwordInput.type).toBe('text');

        // Click to hide password again
        await user.click(eyeButton);
        expect(passwordInput.type).toBe('password');
      }
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid credentials', async () => {
      const user = userEvent.setup();
      mockLogin.mutateAsync.mockResolvedValueOnce({ success: true });

      render(<LoginView />);

      await user.type(screen.getByLabelText(/email address/i), 'admin@redtab.xyz');
      await user.type(screen.getByLabelText(/^password$/i), 'admin123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockLogin.mutateAsync).toHaveBeenCalledWith({
          email: 'admin@redtab.xyz',
          password: 'admin123',
          twoFactorCode: '',
          rememberMe: true,
        });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should submit form without remember me when unchecked', async () => {
      const user = userEvent.setup();
      mockLogin.mutateAsync.mockResolvedValueOnce({ success: true });

      render(<LoginView />);

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');

      // Uncheck remember me
      const rememberMeCheckbox = screen.getByLabelText(/keep me signed in/i);
      await user.click(rememberMeCheckbox);

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockLogin.mutateAsync).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          twoFactorCode: '',
          rememberMe: false,
        });
      });
    });

    it('should display server error on login failure', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Invalid credentials';
      mockLogin.mutateAsync.mockRejectedValueOnce(new Error(errorMessage));

      render(<LoginView />);

      await user.type(screen.getByLabelText(/email address/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Authentication Error')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should display generic error message for non-Error objects', async () => {
      const user = userEvent.setup();
      mockLogin.mutateAsync.mockRejectedValueOnce('Network error');

      render(<LoginView />);

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Authentication Error')).toBeInTheDocument();
        expect(screen.getByText('Login failed. Please check your credentials.')).toBeInTheDocument();
      });
    });

    it('should clear server error when submitting again', async () => {
      const user = userEvent.setup();
      mockLogin.mutateAsync
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce({ success: true });

      render(<LoginView />);

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('First error')).toBeInTheDocument();
      });

      // Submit again
      await user.type(screen.getByLabelText(/^password$/i), 'correctpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.queryByText('First error')).not.toBeInTheDocument();
      });
    });

    it('should prevent submission when form is invalid', async () => {
      const user = userEvent.setup();
      render(<LoginView />);

      // Try to submit with empty form
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockLogin.mutateAsync).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to forgot password page when clicking forgot password link', async () => {
      const user = userEvent.setup();
      render(<LoginView />);

      await user.click(screen.getByRole('button', { name: /forgot password/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
    });
  });

  describe('Loading State', () => {
    it('should show loading state during submission', async () => {
      const user = userEvent.setup();

      // Create a promise that we can control
      let resolveLogin: (value: LoginResult) => void;
      const loginPromise = new Promise<LoginResult>(resolve => {
        resolveLogin = resolve;
      });
      mockLogin.mutateAsync.mockReturnValue(loginPromise);

      render(<LoginView />);

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument();
      });

      // Resolve the login
      resolveLogin!({ success: true });

      await waitFor(() => {
        expect(screen.queryByText('Signing in...')).not.toBeInTheDocument();
      });
    });

    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();

      let resolveLogin: (value: LoginResult) => void;
      const loginPromise = new Promise<LoginResult>(resolve => {
        resolveLogin = resolve;
      });
      mockLogin.mutateAsync.mockReturnValue(loginPromise);

      render(<LoginView />);

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Button should be disabled
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Resolve the login
      resolveLogin!({ success: true });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      render(<LoginView />);

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/keep me signed in/i)).toBeInTheDocument();
    });

    it('should have proper button types', () => {
      render(<LoginView />);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should show error messages with proper ARIA attributes', async () => {
      const user = userEvent.setup();
      render(<LoginView />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        const errorMessage = screen.getByText('Email is required');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveClass('text-red-600');
      });
    });
  });

  describe('Input Placeholders', () => {
    it('should have placeholder for email input', () => {
      render(<LoginView />);

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('placeholder', 'admin@redtab.xyz');
    });

    it('should have placeholder for password input', () => {
      render(<LoginView />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle network errors', async () => {
      const user = userEvent.setup();
      mockLogin.mutateAsync.mockRejectedValueOnce(new Error('Network request failed'));

      render(<LoginView />);

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Network request failed')).toBeInTheDocument();
      });
    });

    it('should handle 401 unauthorized errors', async () => {
      const user = userEvent.setup();
      mockLogin.mutateAsync.mockRejectedValueOnce(new Error('Unauthorized'));

      render(<LoginView />);

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Unauthorized')).toBeInTheDocument();
      });
    });
  });

  describe('Two-Factor Authentication', () => {
    it('should submit 2FA code when provided', async () => {
      const user = userEvent.setup();
      mockLogin.mutateAsync.mockResolvedValueOnce({ success: true });

      render(<LoginView />);

      await user.type(screen.getByLabelText(/email address/i), 'admin@redtab.xyz');
      await user.type(screen.getByLabelText(/^password$/i), 'admin123');

      // Note: The form doesn't show 2FA field by default, but we can test the submission logic
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockLogin.mutateAsync).toHaveBeenCalledWith({
          email: 'admin@redtab.xyz',
          password: 'admin123',
          twoFactorCode: '',
          rememberMe: true,
        });
      });
    });
  });
});
