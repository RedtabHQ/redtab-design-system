import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TabNavigation } from './TabNavigation';

describe('TabNavigation', () => {
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'transactions', label: 'Transactions' },
    { key: 'business-info', label: 'Business Info' },
  ];

  it('renders all tabs', () => {
    render(<TabNavigation tabs={tabs} activeTab="overview" onTabChange={() => {}} />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Business Info')).toBeInTheDocument();
  });

  it('highlights active tab with redtab styling', () => {
    render(<TabNavigation tabs={tabs} activeTab="overview" onTabChange={() => {}} />);
    const activeButton = screen.getByText('Overview');
    expect(activeButton.className).toContain('border-redtab');
    expect(activeButton.className).toContain('text-redtab');
  });

  it('calls onTabChange when tab is clicked', () => {
    const onTabChange = vi.fn();
    render(<TabNavigation tabs={tabs} activeTab="overview" onTabChange={onTabChange} />);
    fireEvent.click(screen.getByText('Transactions'));
    expect(onTabChange).toHaveBeenCalledWith('transactions');
  });

  it('does not call onTabChange when active tab is clicked', () => {
    const onTabChange = vi.fn();
    render(<TabNavigation tabs={tabs} activeTab="overview" onTabChange={onTabChange} />);
    fireEvent.click(screen.getByText('Overview'));
    expect(onTabChange).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TabNavigation tabs={tabs} activeTab="overview" onTabChange={() => {}} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
