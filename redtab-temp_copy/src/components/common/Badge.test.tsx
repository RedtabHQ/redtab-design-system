import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Badge } from './Badge';

describe('Badge', () => {
  describe('Rendering', () => {
    it('should render children content', () => {
      render(<Badge>Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should render with neutral variant by default', () => {
      render(<Badge>Default</Badge>);
      const badge = screen.getByText('Default');
      expect(badge).toHaveClass('badge', 'bg-gray-100', 'text-gray-700');
    });
  });

  describe('Variants', () => {
    it('should render success variant', () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByText('Success');
      expect(badge).toHaveClass('badge-success');
    });

    it('should render warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>);
      const badge = screen.getByText('Warning');
      expect(badge).toHaveClass('badge-warning');
    });

    it('should render danger variant', () => {
      render(<Badge variant="danger">Danger</Badge>);
      const badge = screen.getByText('Danger');
      expect(badge).toHaveClass('badge-danger');
    });

    it('should render info variant', () => {
      render(<Badge variant="info">Info</Badge>);
      const badge = screen.getByText('Info');
      expect(badge).toHaveClass('badge-info');
    });

    it('should render neutral variant', () => {
      render(<Badge variant="neutral">Neutral</Badge>);
      const badge = screen.getByText('Neutral');
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-700');
    });
  });

  describe('Styling', () => {
    it('should apply base badge class', () => {
      render(<Badge>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass('badge');
    });

    it('should apply custom className', () => {
      render(<Badge className="custom-class">Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('badge', 'custom-class');
    });

    it('should combine variant and custom classes', () => {
      render(<Badge variant="success" className="extra-class">Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('badge', 'badge-success', 'extra-class');
    });
  });

  describe('Accessibility', () => {
    it('should render as span element', () => {
      render(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge.tagName).toBe('SPAN');
    });

    it('should preserve text content', () => {
      render(<Badge>Status: Active</Badge>);
      expect(screen.getByText('Status: Active')).toBeInTheDocument();
    });
  });
});
