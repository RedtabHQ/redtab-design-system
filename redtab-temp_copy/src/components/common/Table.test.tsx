import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Table } from './Table';

describe('Table', () => {
  // Test 1: Mobile card view rendering
  it('renders card view on mobile when responsive=true', () => {
    // Mock window.innerWidth for mobile
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600, // < 640px (mobile)
    });

    const columns = [
      { key: 'name' as const, label: 'Name' },
      { key: 'email' as const, label: 'Email' },
    ];
    const data = [
      { name: 'John Doe', email: 'john@example.com' },
    ];

    render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(row, idx) => idx.toString()}
        responsive={true}
      />
    );

    // Verify card view elements (not table)
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();

    // Restore
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  // Test 2: Desktop table view
  it('renders table view on desktop when responsive=true', () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // >= 640px (desktop)
    });

    const columns = [
      { key: 'name' as const, label: 'Name' },
      { key: 'email' as const, label: 'Email' },
    ];
    const data = [
      { name: 'John Doe', email: 'john@example.com' },
    ];

    render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(row, idx) => idx.toString()}
        responsive={true}
      />
    );

    // Verify table view elements
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Name/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /John Doe/i })).toBeInTheDocument();

    // Restore
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  // Test 3: responsive=false always shows table
  it('always renders table when responsive=false', () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600, // Mobile width
    });

    const columns = [
      { key: 'name' as const, label: 'Name' },
    ];
    const data = [{ name: 'John Doe' }];

    render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(row, idx) => idx.toString()}
        responsive={false}
      />
    );

    // Should always show table regardless of window width
    expect(screen.getByRole('table')).toBeInTheDocument();

    // Restore
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  // Test 4: Click handler in card view
  it('triggers onRowClick when card is clicked', async () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600, // Mobile
    });

    const handleRowClick = vi.fn();
    const columns = [{ key: 'name' as const, label: 'Name' }];
    const data = [{ name: 'John Doe' }];

    const { rerender } = render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(row, idx) => idx.toString()}
        responsive={true}
        onRowClick={handleRowClick}
      />
    );

    // Force a rerender to trigger the useEffect with updated window.innerWidth
    rerender(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(row, idx) => idx.toString()}
        responsive={true}
        onRowClick={handleRowClick}
      />
    );

    const card = screen.getByText('John Doe').closest('div[class*="border"]');
    if (card) {
      await userEvent.click(card);
    }

    expect(handleRowClick).toHaveBeenCalledWith(data[0]);

    // Restore
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  // Test 5: Custom row renderer in card view
  it('uses custom row renderer in card view', () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600, // Mobile
    });

    const columns = [{ key: 'name' as const, label: 'Name' }];
    const data = [{ name: 'John Doe' }];

    render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(row, idx) => idx.toString()}
        responsive={true}
        rowRenderer={({ defaultRow }) => (
          <div className="custom-wrapper">{defaultRow}</div>
        )}
      />
    );

    // Verify custom wrapper is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    // Custom wrapper should be present
    const customWrapper = document.querySelector('.custom-wrapper');
    expect(customWrapper).toBeInTheDocument();

    // Restore
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  // Test 6: Loading state in mobile view
  it('shows loading state correctly in mobile view', () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600, // Mobile
    });

    const columns = [{ key: 'name' as const, label: 'Name' }];

    render(
      <Table
        columns={columns}
        data={[]}
        keyExtractor={(row, idx) => idx.toString()}
        responsive={true}
        loading={true}
      />
    );

    // Should show loading regardless of view
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();

    // Restore
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  // Test 7: Empty state in card view
  it('shows empty message in card view', () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600, // Mobile
    });

    const columns = [{ key: 'name' as const, label: 'Name' }];

    render(
      <Table
        columns={columns}
        data={[]}
        keyExtractor={(row, idx) => idx.toString()}
        responsive={true}
        emptyMessage="No records found"
      />
    );

    expect(screen.getByText('No records found')).toBeInTheDocument();

    // Restore
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });
});
