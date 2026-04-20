import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, type TabItem } from './Tabs';

const tabs: TabItem[] = [
  { id: 'overview', label: 'Overview', content: <div>Overview content</div> },
  { id: 'details', label: 'Details', content: <div>Details content</div> },
  { id: 'settings', label: 'Settings', content: <div>Settings content</div> },
];

describe('Tabs', () => {
  it('renders with the first tab active by default', () => {
    render(<Tabs tabs={tabs} />);

    const firstTab = screen.getByRole('tab', { name: 'Overview' });
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Overview content')).toBeInTheDocument();
  });

  it('respects defaultTab and shows matching content', () => {
    render(<Tabs tabs={tabs} defaultTab="details" />);

    const activeTab = screen.getByRole('tab', { name: 'Details' });
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Details content')).toBeInTheDocument();
  });

  it('switches active tab on click and calls onTabChange', () => {
    const onTabChange = vi.fn();
    render(<Tabs tabs={tabs} onTabChange={onTabChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Settings' }));

    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Settings content')).toBeInTheDocument();
    expect(onTabChange).toHaveBeenCalledWith('settings');
  });

  it('supports keyboard navigation with arrow keys', () => {
    render(<Tabs tabs={tabs} />);

    const firstTab = screen.getByRole('tab', { name: 'Overview' });
    fireEvent.keyDown(firstTab, { key: 'ArrowRight' });

    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Details content')).toBeInTheDocument();
  });
});
