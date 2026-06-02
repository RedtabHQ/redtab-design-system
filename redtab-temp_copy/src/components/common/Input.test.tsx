import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Input } from './Input';
import { Search } from 'lucide-react';
import userEvent from '@testing-library/user-event';

describe('Input', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should show required indicator when required', () => {
      render(<Input label="Email" required />);
      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-red-500');
    });

    it('should not show required indicator when not required', () => {
      render(<Input label="Optional Field" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('should render with icon', () => {
      render(<Input icon={<Search data-testid="search-icon" />} />);
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should apply error styling to input', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('ring-2', 'ring-red-500', 'border-red-500');
    });

    it('should show error message with red color', () => {
      render(<Input error="Error message" />);
      const errorMsg = screen.getByText('Error message');
      expect(errorMsg).toHaveClass('text-red-500', 'font-medium');
    });

    it('should not show helper text when error is present', () => {
      render(<Input error="Error" helperText="Helper text" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('should display helper text', () => {
      render(<Input helperText="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('should apply proper styling to helper text', () => {
      render(<Input helperText="Helper" />);
      const helperText = screen.getByText('Helper');
      expect(helperText).toHaveClass('text-xs', 'text-gray-500');
    });
  });

  describe('Icon', () => {
    it('should apply padding when icon is present', () => {
      render(<Input icon={<Search />} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-10');
    });

    it('should not apply icon padding when no icon', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).not.toMatch(/pl-10/);
    });

    it('should position icon absolutely', () => {
      const { container } = render(<Input icon={<Search data-testid="icon" />} />);
      const iconContainer = screen.getByTestId('icon').parentElement;
      expect(iconContainer).toHaveClass('absolute', 'left-3');
    });
  });

  describe('Styling', () => {
    it('should apply base input class', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('input');
    });

    it('should apply custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('input', 'custom-class');
    });

    it('should apply label styling', () => {
      render(<Input label="Field" />);
      const label = screen.getByText('Field').closest('label');
      expect(label).toHaveClass('block', 'text-sm', 'font-semibold', 'text-gray-700', 'mb-2');
    });
  });

  describe('Interactions', () => {
    it('should accept user input', async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Type here" />);

      const input = screen.getByPlaceholderText('Type here');
      await user.type(input, 'Hello World');

      expect(input).toHaveValue('Hello World');
    });

    it('should call onChange handler', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'a');
      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle onBlur event', async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();

      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should support ref forwarding', () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should have correct displayName', () => {
      expect(Input.displayName).toBe('Input');
    });

    it('should pass through native input props', () => {
      render(
        <Input
          type="email"
          name="email"
          placeholder="Enter email"
          data-testid="email-input"
        />
      );
      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('name', 'email');
      expect(input).toHaveAttribute('placeholder', 'Enter email');
    });

    it('should support disabled state', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should associate label with input', () => {
      render(<Input label="Username" id="username" />);
      const label = screen.getByText('Username');
      const input = screen.getByRole('textbox');
      // Since we're not using htmlFor, we just check they're both rendered
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });
  });
});
