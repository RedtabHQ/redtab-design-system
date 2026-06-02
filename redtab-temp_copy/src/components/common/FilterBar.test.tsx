import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('renders children in a flex layout container', () => {
    const { container } = render(
      <FilterBar>
        <span>child</span>
      </FilterBar>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/flex/);
    expect(screen.getByText('child')).toBeDefined();
  });

  it('applies custom className to root', () => {
    const { container } = render(
      <FilterBar className="my-custom-class">
        <span>child</span>
      </FilterBar>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('my-custom-class');
  });

  describe('FilterBar.Search', () => {
    it('renders an input with the given placeholder', () => {
      render(
        <FilterBar.Search
          placeholder="Search items..."
          value=""
          onChange={vi.fn()}
        />
      );
      expect(screen.getByPlaceholderText('Search items...')).toBeDefined();
    });

    it('uses default placeholder when none provided', () => {
      render(
        <FilterBar.Search value="" onChange={vi.fn()} />
      );
      expect(screen.getByPlaceholderText('Search...')).toBeDefined();
    });

    it('calls onChange with new value when user types', () => {
      const handleChange = vi.fn();
      render(
        <FilterBar.Search value="" onChange={handleChange} placeholder="Search..." />
      );
      fireEvent.change(screen.getByPlaceholderText('Search...'), {
        target: { value: 'hello' },
      });
      expect(handleChange).toHaveBeenCalledWith('hello');
    });

    it('applies custom className', () => {
      const { container } = render(
        <FilterBar.Search value="" onChange={vi.fn()} className="w-64" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('w-64');
    });
  });

  describe('FilterBar.Status', () => {
    const options = ['ALL', 'ACTIVE', 'CLOSED'];

    it('renders a select with placeholder option and all provided options', () => {
      render(
        <FilterBar.Status
          options={options}
          value="ALL"
          onChange={vi.fn()}
        />
      );
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select).toBeDefined();
      // placeholder + 3 options
      expect(select.options.length).toBe(4);
      expect(select.options[1].value).toBe('ALL');
      expect(select.options[2].value).toBe('ACTIVE');
    });

    it('uses custom placeholder', () => {
      render(
        <FilterBar.Status
          options={options}
          onChange={vi.fn()}
          placeholder="Pick a status"
        />
      );
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.options[0].text).toBe('Pick a status');
    });

    it('calls onChange when selection changes', () => {
      const handleChange = vi.fn();
      render(
        <FilterBar.Status options={options} value="" onChange={handleChange} />
      );
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'ACTIVE' },
      });
      expect(handleChange).toHaveBeenCalledWith('ACTIVE');
    });

    it('applies custom className to the select element', () => {
      render(
        <FilterBar.Status options={options} onChange={vi.fn()} className="w-48" />
      );
      expect(screen.getByRole('combobox').className).toContain('w-48');
    });
  });

  describe('FilterBar.Custom', () => {
    it('renders children passed through without wrapping element', () => {
      render(
        <FilterBar.Custom>
          <button>Extra filter</button>
        </FilterBar.Custom>
      );
      expect(screen.getByRole('button', { name: 'Extra filter' })).toBeDefined();
    });
  });

  it('composes sub-components inside root', () => {
    const handleSearch = vi.fn();
    const handleStatus = vi.fn();
    render(
      <FilterBar>
        <FilterBar.Search value="foo" onChange={handleSearch} placeholder="Find..." />
        <FilterBar.Status options={['ALL', 'DONE']} onChange={handleStatus} />
        <FilterBar.Custom>
          <button>Reset</button>
        </FilterBar.Custom>
      </FilterBar>
    );
    expect(screen.getByPlaceholderText('Find...')).toBeDefined();
    expect(screen.getByRole('combobox')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDefined();
  });
});
