import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('does not render when totalPages is 1', () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders navigation and highlights current page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={8} onPageChange={onPageChange} />);

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
  });

  it('calls onPageChange when selecting a specific page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={8} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when pressing previous and next', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={8} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 2);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 4);
  });

  it('disables previous button on first page and next button on last page', () => {
    const onPageChange = vi.fn();
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={8} onPageChange={onPageChange} />,
    );

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();

    rerender(<Pagination currentPage={8} totalPages={8} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });
});
