import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Users } from 'lucide-react';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  describe('title', () => {
    it('renders title in h1', () => {
      render(<PageHeader title="Merchants" />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Merchants');
    });
  });

  describe('subtitle', () => {
    it('renders subtitle when provided', () => {
      render(<PageHeader title="Merchants" subtitle="All registered merchants" />);
      expect(screen.getByText('All registered merchants')).toBeInTheDocument();
    });

    it('does not render subtitle when omitted', () => {
      render(<PageHeader title="Merchants" />);
      expect(screen.queryByText(/All registered/)).not.toBeInTheDocument();
    });
  });

  describe('icon', () => {
    it('renders icon inside h1 when provided', () => {
      render(
        <PageHeader
          title="Merchants"
          icon={<Users data-testid="icon" size={28} />}
        />
      );
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.querySelector('[data-testid="icon"]')).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('renders actions when provided', () => {
      render(
        <PageHeader
          title="Merchants"
          actions={<button>Add Merchant</button>}
        />
      );
      expect(screen.getByRole('button', { name: /add merchant/i })).toBeInTheDocument();
    });

    it('does not render actions wrapper when omitted', () => {
      const { container } = render(<PageHeader title="Merchants" />);
      // The actions wrapper div is the only direct child of the header row that follows the left block
      const headerRow = container.querySelector('.flex.items-center.justify-between');
      expect(headerRow?.children.length).toBe(1);
    });
  });

  describe('backHref', () => {
    it('does not render back link when backHref omitted', () => {
      render(<PageHeader title="Detail" />);
      expect(screen.queryByText(/back/i)).not.toBeInTheDocument();
    });

    it('renders Link with correct href when backHref provided', () => {
      render(<PageHeader title="Detail" backHref="/merchants" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/merchants');
    });

    it('renders "Back" text in back link', () => {
      render(<PageHeader title="Detail" backHref="/merchants" />);
      expect(screen.getByText('Back')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('h1 has tracking-tight class', () => {
      render(<PageHeader title="Test" />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('tracking-tight');
    });

    it('full usage renders correctly together', () => {
      render(
        <PageHeader
          title="Merchants"
          subtitle="Registry of merchants"
          icon={<Users size={28} />}
          actions={<button>Onboard</button>}
          backHref="/dashboard"
        />
      );
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Merchants');
      expect(screen.getByText('Registry of merchants')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /onboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', '/dashboard');
    });
  });
});
