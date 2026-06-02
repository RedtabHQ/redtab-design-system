import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Alert } from './Alert';
import userEvent from '@testing-library/user-event';

describe('Alert', () => {
  describe('Rendering', () => {
    it('should render alert message', () => {
      render(<Alert type="info" message="This is an info message" />);
      expect(screen.getByText('This is an info message')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(<Alert type="success" title="Success!" message="Operation completed" />);
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
    });

    it('should render without title', () => {
      render(<Alert type="info" message="Just a message" />);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      expect(screen.getByText('Just a message')).toBeInTheDocument();
    });

    it('should render dismiss button by default', () => {
      render(<Alert type="info" message="Dismissible message" />);
      const dismissButton = screen.getByRole('button');
      expect(dismissButton).toBeInTheDocument();
    });

    it('should not render dismiss button when not dismissible', () => {
      render(<Alert type="info" message="Non-dismissible" dismissible={false} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Alert Types', () => {
    it('should render success alert with correct styling', () => {
      const { container } = render(<Alert type="success" message="Success message" />);
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
    });

    it('should render error alert with correct styling', () => {
      const { container } = render(<Alert type="error" message="Error message" />);
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800');
    });

    it('should render warning alert with correct styling', () => {
      const { container } = render(<Alert type="warning" message="Warning message" />);
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass('bg-amber-50', 'border-amber-200', 'text-amber-800');
    });

    it('should render info alert with correct styling', () => {
      const { container } = render(<Alert type="info" message="Info message" />);
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
    });
  });

  describe('Icons', () => {
    it('should render success icon', () => {
      const { container } = render(<Alert type="success" message="Success" />);
      const iconContainer = container.querySelector('.text-green-600');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render error icon', () => {
      const { container } = render(<Alert type="error" message="Error" />);
      const iconContainer = container.querySelector('.text-red-600');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render warning icon', () => {
      const { container } = render(<Alert type="warning" message="Warning" />);
      const iconContainer = container.querySelector('.text-amber-600');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render info icon', () => {
      const { container } = render(<Alert type="info" message="Info" />);
      const iconContainer = container.querySelector('.text-blue-600');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClose when dismiss button is clicked', async () => {
      const handleClose = vi.fn();
      const user = userEvent.setup();

      render(<Alert type="info" message="Message" onClose={handleClose} />);
      const dismissButton = screen.getByRole('button');

      await user.click(dismissButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should not crash when onClose is not provided', async () => {
      const user = userEvent.setup();

      render(<Alert type="info" message="Message" />);
      const dismissButton = screen.getByRole('button');

      await user.click(dismissButton);
      // Should not throw error
      expect(dismissButton).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have proper flex layout', () => {
      const { container } = render(<Alert type="info" message="Message" />);
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass('flex', 'gap-3');
    });

    it('should render icon, content, and dismiss button in order', () => {
      const { container } = render(
        <Alert type="success" title="Title" message="Message" />
      );
      const alert = container.firstChild as HTMLElement;
      const children = Array.from(alert.children);

      expect(children).toHaveLength(3); // icon, content, dismiss button
      expect(children[0]).toHaveClass('flex-shrink-0'); // icon
      expect(children[1]).toHaveClass('flex-1'); // content
      expect(children[2].tagName).toBe('BUTTON'); // dismiss button
    });

    it('should render title and message in content section', () => {
      render(<Alert type="info" title="Alert Title" message="Alert message" />);
      const title = screen.getByText('Alert Title');
      const message = screen.getByText('Alert message');

      expect(title.tagName).toBe('H4');
      expect(message.tagName).toBe('P');
    });
  });

  describe('Styling', () => {
    it('should apply base layout classes', () => {
      const { container } = render(<Alert type="info" message="Message" />);
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass('border', 'rounded-lg', 'p-4', 'flex', 'gap-3');
    });

    it('should style title correctly', () => {
      render(<Alert type="info" title="Title" message="Message" />);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('font-semibold', 'text-sm');
    });

    it('should style message correctly', () => {
      render(<Alert type="info" message="Message" />);
      const message = screen.getByText('Message');
      expect(message).toHaveClass('text-sm');
    });

    it('should style dismiss button with hover effect', () => {
      render(<Alert type="info" message="Message" />);
      const dismissButton = screen.getByRole('button');
      expect(dismissButton).toHaveClass('opacity-60', 'hover:opacity-100', 'transition-opacity');
    });

    it('should make icon non-shrinkable', () => {
      const { container } = render(<Alert type="success" message="Message" />);
      const iconContainer = container.querySelector('.flex-shrink-0');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic heading for title', () => {
      render(<Alert type="info" title="Alert Title" message="Message" />);
      const title = screen.getByRole('heading', { level: 4 });
      expect(title).toHaveTextContent('Alert Title');
    });

    it('should have accessible dismiss button', () => {
      render(<Alert type="info" message="Message" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });
});
