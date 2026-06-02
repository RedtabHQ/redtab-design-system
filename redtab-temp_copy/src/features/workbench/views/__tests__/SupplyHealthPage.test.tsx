import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SupplyHealthPage } from '../SupplyHealthPage';
import { mockSuppliers, testScenarios } from '@/features/suppliers/__mocks__/mockSuppliers';
import type { Supplier, Merchant } from '@/types';

// Mock SearchInput component
interface MockSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

vi.mock('@/components/SearchInput', () => ({
  SearchInput: ({ value, onChange, placeholder, className }: MockSearchInputProps) => (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      data-testid="search-input"
    />
  ),
}));

let mockContextValue: unknown = {};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useOutletContext: vi.fn(() => mockContextValue),
  };
});

/**
 * Test suite for SupplyHealthPage component
 * Tests various scenarios: low risk, high risk, critical risk, no suppliers, and error handling
 */
describe('SupplyHealthPage', () => {
  const mockMerchant: Merchant = {
    id: 'M001',
    name: 'Test Merchant',
    email: 'merchant@test.com',
    phone: '+1-800-000-0000',
    category: 'Electronics',
    status: 'ACTIVE',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Scenario 1: Low Risk Network (Well-diversified)', () => {
    beforeEach(() => {
      mockContextValue = {
        merchant: mockMerchant,
        suppliers: testScenarios.lowRisk,
        isSuppliersLoading: false,
      };
    });

    it('should render supplier cards with correct data', () => {
      render(<SupplyHealthPage />);

      // Verify all suppliers are rendered
      expect(screen.getByText('FastTrack Logistics')).toBeInTheDocument();
      expect(screen.getByText('Global Distributors Ltd')).toBeInTheDocument();

      // Verify supplier categories
      expect(screen.getByText('Logistics & Fulfillment')).toBeInTheDocument();
      expect(screen.getByText('Distribution & Wholesale')).toBeInTheDocument();
    });

    it('should display LOW exposure risk', () => {
      render(<SupplyHealthPage />);

      // Network Concentration Analysis should show LOW risk
      const riskText = screen.getByText('LOW');
      expect(riskText).toBeInTheDocument();
      expect(riskText).toHaveClass('text-green-500');
    });

    it('should display correct supplier count', () => {
      render(<SupplyHealthPage />);

      // Should display "4 suppliers"
      expect(screen.getByText(/4 suppliers/)).toBeInTheDocument();
    });

    it('should show health scores as stars', () => {
      render(<SupplyHealthPage />);

      // Verified suppliers should have higher health scores
      const healthScoreTexts = screen.getAllByText(/Health Score/i);
      expect(healthScoreTexts.length).toBeGreaterThan(0);
    });

    it('should display invoice validity rates', () => {
      render(<SupplyHealthPage />);

      // Should show invoice validity percentages
      const validityTexts = screen.getAllByText(/Match/i);
      expect(validityTexts.length).toBeGreaterThan(0);
    });
  });

  describe('Scenario 2: High Risk Network (Few suppliers)', () => {
    beforeEach(() => {
      mockContextValue = {
        merchant: mockMerchant,
        suppliers: testScenarios.highRisk,
        isSuppliersLoading: false,
      };
    });

    it('should render only 2 suppliers', () => {
      render(<SupplyHealthPage />);

      expect(screen.getByText('FastTrack Logistics')).toBeInTheDocument();
      expect(screen.getByText('Global Distributors Ltd')).toBeInTheDocument();
    });

    it('should display HIGH or MEDIUM exposure risk', () => {
      render(<SupplyHealthPage />);

      const riskElements = screen.getAllByText(/HIGH|MEDIUM/);
      expect(riskElements.length).toBeGreaterThan(0);
    });

    it('should display correct supplier count', () => {
      render(<SupplyHealthPage />);

      expect(screen.getByText(/2 suppliers/)).toBeInTheDocument();
    });
  });

  describe('Scenario 3: Critical Risk (Single supplier)', () => {
    beforeEach(() => {
      mockContextValue = {
        merchant: mockMerchant,
        suppliers: testScenarios.criticalRisk,
        isSuppliersLoading: false,
      };
    });

    it('should render single supplier', () => {
      render(<SupplyHealthPage />);

      expect(screen.getByText('FastTrack Logistics')).toBeInTheDocument();
    });

    it('should display CRITICAL exposure risk', () => {
      render(<SupplyHealthPage />);

      const criticalRisk = screen.getByText('CRITICAL');
      expect(criticalRisk).toBeInTheDocument();
      expect(criticalRisk).toHaveClass('text-red-500');
    });

    it('should display "1 supplier" (singular)', () => {
      render(<SupplyHealthPage />);

      expect(screen.getByText(/1 supplier$/)).toBeInTheDocument();
    });
  });

  describe('Scenario 4: No Suppliers', () => {
    beforeEach(() => {
      mockContextValue = {
        merchant: mockMerchant,
        suppliers: testScenarios.noSuppliers,
        isSuppliersLoading: false,
      };
    });

    it('should display "No suppliers connected" message', () => {
      render(<SupplyHealthPage />);

      expect(screen.getByText('No suppliers connected')).toBeInTheDocument();
      expect(screen.getByText(/This merchant has no suppliers linked yet/)).toBeInTheDocument();
    });

    it('should show amber alert icon', () => {
      const { container } = render(<SupplyHealthPage />);

      // Check for AlertCircle icon (aria-label or svg)
      const alertIcon = container.querySelector('[class*="text-amber"]');
      expect(alertIcon).toBeInTheDocument();
    });
  });

  describe('Scenario 5: Mixed with Blocked Supplier', () => {
    beforeEach(() => {
      mockContextValue = {
        merchant: mockMerchant,
        suppliers: testScenarios.withBlocked,
        isSuppliersLoading: false,
      };
    });

    it('should display blocked supplier with different status badge', () => {
      render(<SupplyHealthPage />);

      // Should have at least one "Blocked" badge
      const blockedBadges = screen.getAllByText('Blocked');
      expect(blockedBadges.length).toBeGreaterThan(0);
    });

    it('should display red status badge for blocked supplier', () => {
      const { container } = render(<SupplyHealthPage />);

      // Blocked supplier should have red styling
      const redBadges = container.querySelectorAll('[class*="text-red-600"]');
      expect(redBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      mockContextValue = {
        merchant: mockMerchant,
        suppliers: [],
        isSuppliersLoading: true,
      };
    });

    it('should display skeleton loaders during loading', () => {
      const { container } = render(<SupplyHealthPage />);

      // Look for pulse animation (loading skeleton)
      const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should not show supplier content while loading', () => {
      render(<SupplyHealthPage />);

      expect(screen.queryByText('FastTrack Logistics')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      const mockError = new Error('Failed to fetch suppliers');
      mockContextValue = {
        merchant: mockMerchant,
        suppliers: [],
        isSuppliersLoading: false,
        suppliersError: mockError,
      };
    });

    it('should display error message when loading fails', () => {
      render(<SupplyHealthPage />);

      expect(screen.getByText('Failed to load suppliers')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch suppliers')).toBeInTheDocument();
    });

    it('should display error in red alert box', () => {
      const { container } = render(<SupplyHealthPage />);

      // Error alert should have red styling
      const errorAlert = container.querySelector('[class*="bg-red-50"]');
      expect(errorAlert).toBeInTheDocument();
    });
  });

  describe('Search & Filter', () => {
    beforeEach(() => {
      mockContextValue = {
        merchant: mockMerchant,
        suppliers: testScenarios.lowRisk,
        isSuppliersLoading: false,
      };
    });

    it('should have search input field', () => {
      render(<SupplyHealthPage />);

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', 'Filter suppliers by name or category...');
    });

    it('should filter suppliers by name', async () => {
      const user = userEvent.setup();
      render(<SupplyHealthPage />);

      const searchInput = screen.getByTestId('search-input');

      // Search for "FastTrack"
      await user.type(searchInput, 'FastTrack');

      await waitFor(() => {
        expect(screen.getByText('FastTrack Logistics')).toBeInTheDocument();
        expect(screen.queryByText('Global Distributors Ltd')).not.toBeInTheDocument();
      });
    });

    it('should filter suppliers by category', async () => {
      const user = userEvent.setup();
      render(<SupplyHealthPage />);

      const searchInput = screen.getByTestId('search-input');

      // Search for "Logistics"
      await user.type(searchInput, 'Logistics');

      await waitFor(() => {
        expect(screen.getByText('Logistics & Fulfillment')).toBeInTheDocument();
      });
    });

    it('should show no results message when filter has no matches', async () => {
      const user = userEvent.setup();
      render(<SupplyHealthPage />);

      const searchInput = screen.getByTestId('search-input');

      // Search for non-existent supplier
      await user.type(searchInput, 'NonexistentSupplier');

      await waitFor(() => {
        expect(screen.getByText(/No suppliers match/)).toBeInTheDocument();
      });
    });
  });

  describe('Network Concentration Analysis', () => {
    it('should display concentration percentage', () => {
      mockContextValue = {
        merchant: mockMerchant,
        suppliers: testScenarios.lowRisk,
        isSuppliersLoading: false,
      };

      const { container } = render(<SupplyHealthPage />);

      // Should display a percentage value
      const percentageTexts = container.querySelectorAll('[class*="font-black"]');
      let foundPercentage = false;
      percentageTexts.forEach((el) => {
        if (el.textContent && el.textContent.match(/\d+%/)) {
          foundPercentage = true;
        }
      });
      expect(foundPercentage).toBe(true);
    });

    it('should update concentration when supplier count changes', () => {
      const { rerender } = render(<SupplyHealthPage />);

      mockContextValue = {
        merchant: mockMerchant,
        suppliers: testScenarios.lowRisk,
        isSuppliersLoading: false,
      };

      rerender(<SupplyHealthPage />);

      const firstSupplierCount = screen.getByText(/suppliers/);
      expect(firstSupplierCount).toBeInTheDocument();

      // Update to critical risk (1 supplier)
      mockContextValue = {
        merchant: mockMerchant,
        suppliers: testScenarios.criticalRisk,
        isSuppliersLoading: false,
      };

      rerender(<SupplyHealthPage />);

      expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockContextValue = {
        merchant: mockMerchant,
        suppliers: testScenarios.lowRisk,
        isSuppliersLoading: false,
      };
    });

    it('should have proper heading hierarchy', () => {
      render(<SupplyHealthPage />);

      const heading = screen.getByText(/SUPPLY CHAIN RELATIONSHIP MAPPING/);
      expect(heading.tagName).toBe('H4');
    });

    it('should have descriptive labels for metrics', () => {
      render(<SupplyHealthPage />);

      expect(screen.getAllByText('Buy Volume').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Health Score').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Invoice Validity').length).toBeGreaterThan(0);
    });
  });
});
