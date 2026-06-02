import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  // Renders correct text
  it('renders the status text', () => {
    render(<StatusBadge type="merchant" status="ACTIVE" />);
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('renders webhook label for active state', () => {
    render(<StatusBadge type="webhook" status="active" activeLabel="Online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('renders webhook label for inactive state', () => {
    render(<StatusBadge type="webhook" status="inactive" inactiveLabel="Offline" />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  // Merchant color mappings
  describe('merchant type', () => {
    it('applies green classes for VERIFIED', () => {
      const { container } = render(<StatusBadge type="merchant" status="VERIFIED" />);
      expect(container.firstChild).toHaveClass('bg-green-50', 'text-green-700', 'border-green-100');
    });

    it('applies green classes for ACTIVE', () => {
      const { container } = render(<StatusBadge type="merchant" status="ACTIVE" />);
      expect(container.firstChild).toHaveClass('bg-green-50', 'text-green-700', 'border-green-100');
    });

    it('applies yellow classes for PENDING', () => {
      const { container } = render(<StatusBadge type="merchant" status="PENDING" />);
      expect(container.firstChild).toHaveClass('bg-yellow-50', 'text-yellow-700', 'border-yellow-100');
    });

    it('applies red classes for REJECTED', () => {
      const { container } = render(<StatusBadge type="merchant" status="REJECTED" />);
      expect(container.firstChild).toHaveClass('bg-red-50', 'text-red-700', 'border-red-100');
    });

    it('applies gray classes for SUSPENDED', () => {
      const { container } = render(<StatusBadge type="merchant" status="SUSPENDED" />);
      expect(container.firstChild).toHaveClass('bg-gray-100', 'text-gray-500', 'border-gray-200');
    });

    it('applies gray classes for INACTIVE', () => {
      const { container } = render(<StatusBadge type="merchant" status="INACTIVE" />);
      expect(container.firstChild).toHaveClass('bg-gray-100', 'text-gray-500', 'border-gray-200');
    });
  });

  // Webhook color mappings
  describe('webhook type', () => {
    it('applies green classes for active', () => {
      const { container } = render(<StatusBadge type="webhook" status="active" />);
      expect(container.firstChild).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('applies gray classes for inactive', () => {
      const { container } = render(<StatusBadge type="webhook" status="inactive" />);
      expect(container.firstChild).toHaveClass('bg-gray-100', 'text-gray-800');
    });
  });

  // Credit rating color mappings
  describe('credit type', () => {
    it('applies green bg for rating A', () => {
      const { container } = render(<StatusBadge type="credit" status="A" />);
      expect(container.firstChild).toHaveClass('bg-green-500');
    });

    it('applies blue bg for rating B', () => {
      const { container } = render(<StatusBadge type="credit" status="B" />);
      expect(container.firstChild).toHaveClass('bg-blue-500');
    });

    it('applies amber bg for rating C', () => {
      const { container } = render(<StatusBadge type="credit" status="C" />);
      expect(container.firstChild).toHaveClass('bg-amber-500');
    });

    it('applies red bg for rating D', () => {
      const { container } = render(<StatusBadge type="credit" status="D" />);
      expect(container.firstChild).toHaveClass('bg-red-500');
    });
  });

  // Tier color mappings
  describe('tier type', () => {
    it('applies indigo classes for T1', () => {
      const { container } = render(<StatusBadge type="tier" status="T1" />);
      expect(container.firstChild).toHaveClass('bg-indigo-50', 'text-indigo-700', 'border-indigo-100');
    });

    it('applies blue classes for T2', () => {
      const { container } = render(<StatusBadge type="tier" status="T2" />);
      expect(container.firstChild).toHaveClass('bg-blue-50', 'text-blue-700', 'border-blue-100');
    });

    it('applies cyan classes for T3', () => {
      const { container } = render(<StatusBadge type="tier" status="T3" />);
      expect(container.firstChild).toHaveClass('bg-cyan-50', 'text-cyan-700', 'border-cyan-100');
    });

    it('applies red classes for NONE', () => {
      const { container } = render(<StatusBadge type="tier" status="NONE" />);
      expect(container.firstChild).toHaveClass('bg-red-50', 'text-red-700', 'border-red-100');
    });
  });

  // Contract color mappings
  describe('contract type', () => {
    it('applies green classes for PAID', () => {
      const { container } = render(<StatusBadge type="contract" status="PAID" />);
      expect(container.firstChild).toHaveClass('bg-green-50', 'text-green-700');
    });

    it('applies red classes for OVERDUE', () => {
      const { container } = render(<StatusBadge type="contract" status="OVERDUE" />);
      expect(container.firstChild).toHaveClass('bg-red-50', 'text-red-700');
    });

    it('applies red classes for DEFAULTED', () => {
      const { container } = render(<StatusBadge type="contract" status="DEFAULTED" />);
      expect(container.firstChild).toHaveClass('bg-red-50', 'text-red-700');
    });

    it('applies orange classes for DELINQUENT', () => {
      const { container } = render(<StatusBadge type="contract" status="DELINQUENT" />);
      expect(container.firstChild).toHaveClass('bg-orange-50', 'text-orange-700');
    });

    it('applies gray classes for WRITTEN_OFF', () => {
      const { container } = render(<StatusBadge type="contract" status="WRITTEN_OFF" />);
      expect(container.firstChild).toHaveClass('bg-gray-50', 'text-gray-700');
    });

    it('falls back to blue classes for unknown contract status', () => {
      const { container } = render(<StatusBadge type="contract" status="UNKNOWN_STATUS" />);
      expect(container.firstChild).toHaveClass('bg-blue-50', 'text-blue-700');
    });
  });

  // Size variants
  describe('size prop', () => {
    it('defaults to md size classes', () => {
      const { container } = render(<StatusBadge type="merchant" status="ACTIVE" />);
      expect(container.firstChild).toHaveClass('px-3', 'py-1');
    });

    it('applies sm size classes', () => {
      const { container } = render(<StatusBadge type="merchant" status="ACTIVE" size="sm" />);
      expect(container.firstChild).toHaveClass('px-2', 'py-0.5');
    });
  });

  // className prop
  it('applies custom className', () => {
    const { container } = render(<StatusBadge type="merchant" status="ACTIVE" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  // Fallback for unknown status
  it('renders with default style for unknown merchant status', () => {
    const { container } = render(<StatusBadge type="merchant" status="UNKNOWN" />);
    expect(container.firstChild).toHaveClass('bg-gray-100', 'text-gray-500', 'border-gray-200');
  });
});
