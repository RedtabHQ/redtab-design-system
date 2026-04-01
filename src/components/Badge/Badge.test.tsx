import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies neutral variant by default', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default').className).toContain('bg-neutral-100');
  });

  it('applies success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success').className).toContain('bg-success-50');
  });

  it('applies warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning').className).toContain('bg-warning-50');
  });

  it('applies danger variant', () => {
    render(<Badge variant="danger">Error</Badge>);
    expect(screen.getByText('Error').className).toContain('bg-error-50');
  });

  it('applies info variant', () => {
    render(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info').className).toContain('bg-info-50');
  });

  it('merges custom className', () => {
    render(<Badge className="ml-2">Custom</Badge>);
    expect(screen.getByText('Custom').className).toContain('ml-2');
  });
});
