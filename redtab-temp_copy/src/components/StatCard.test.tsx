import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { StatCard } from './StatCard';
import { DollarSign } from 'lucide-react';
import userEvent from '@testing-library/user-event';

describe('StatCard', () => {
  describe('Rendering', () => {
    it('should render title and value', () => {
      render(<StatCard title="Total Revenue" value="$1,000" />);
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('$1,000')).toBeInTheDocument();
    });

    it('should render numeric value', () => {
      render(<StatCard title="Users" value={1000} />);
      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('should render with unit', () => {
      render(<StatCard title="Revenue" value="1000" unit="USD" />);
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('should render with icon', () => {
      render(<StatCard title="Revenue" value="1000" icon={<DollarSign data-testid="dollar-icon" />} />);
      expect(screen.getByTestId('dollar-icon')).toBeInTheDocument();
    });
  });

  describe('Trend Indicators', () => {
    it('should show positive trend with up arrow', () => {
      render(<StatCard title="Revenue" value="1000" change={10} trend="up" />);
      expect(screen.getByText('10% from last period')).toBeInTheDocument();
      const trendElement = screen.getByText('10% from last period').parentElement;
      expect(trendElement).toHaveClass('text-green-600');
    });

    it('should show negative trend with down arrow', () => {
      render(<StatCard title="Revenue" value="1000" change={-5} trend="down" />);
      expect(screen.getByText('5% from last period')).toBeInTheDocument();
      const trendElement = screen.getByText('5% from last period').parentElement;
      expect(trendElement).toHaveClass('text-red-600');
    });

    it('should show neutral trend', () => {
      render(<StatCard title="Revenue" value="1000" change={0} trend="neutral" />);
      expect(screen.getByText('0% from last period')).toBeInTheDocument();
      const trendElement = screen.getByText('0% from last period').parentElement;
      expect(trendElement).toHaveClass('text-gray-600');
    });

    it('should display absolute value of change', () => {
      render(<StatCard title="Revenue" value="1000" change={-15} trend="down" />);
      expect(screen.getByText('15% from last period')).toBeInTheDocument();
    });

    it('should not show trend when change is undefined', () => {
      render(<StatCard title="Revenue" value="1000" />);
      expect(screen.queryByText(/from last period/i)).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when card is clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<StatCard title="Revenue" value="1000" onClick={handleClick} />);

      const { container } = render(<StatCard title="Revenue" value="1000" onClick={handleClick} />);
      const card = container.firstChild as HTMLElement;

      await user.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should have hover styles when onClick is provided', () => {
      const { container } = render(<StatCard title="Revenue" value="1000" onClick={() => {}} />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('cursor-pointer', 'hover:shadow-lg', 'hover:-translate-y-1');
    });

    it('should not have hover styles when onClick is not provided', () => {
      const { container } = render(<StatCard title="Revenue" value="1000" />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('cursor-pointer');
      expect(card.className).not.toMatch(/hover:shadow-lg/);
    });
  });

  describe('Styling', () => {
    it('should apply card class', () => {
      const { container } = render(<StatCard title="Revenue" value="1000" />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('card');
    });

    it('should have proper text styling for title', () => {
      render(<StatCard title="Total Revenue" value="1000" />);
      const title = screen.getByText('Total Revenue');
      expect(title).toHaveClass('text-xs', 'font-semibold', 'text-gray-500', 'uppercase', 'tracking-wide');
    });

    it('should have proper text styling for value', () => {
      const { container } = render(<StatCard title="Revenue" value="1000" />);
      const value = screen.getByText('1000');
      expect(value).toHaveClass('text-3xl', 'font-bold', 'text-gray-900');
    });

    it('should have proper styling for unit', () => {
      render(<StatCard title="Revenue" value="1000" unit="USD" />);
      const unit = screen.getByText('USD');
      expect(unit).toHaveClass('text-sm', 'text-gray-500', 'font-medium');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible when clickable', () => {
      const { container } = render(<StatCard title="Revenue" value="1000" onClick={() => {}} />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('cursor-pointer');
    });

    it('should use proper semantic HTML', () => {
      render(<StatCard title="Total Revenue" value="1000" />);
      const title = screen.getByText('Total Revenue');
      expect(title.tagName).toBe('P');
    });
  });
});
