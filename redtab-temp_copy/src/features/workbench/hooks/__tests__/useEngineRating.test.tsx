import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEngineRating } from '../useEngineRating';
import { CreditTier } from '@/types';
import type { ReactNode } from 'react';

// Mock the usePolicyConfig hook
vi.mock('@/features/merchants/hooks', () => ({
  usePolicyConfig: vi.fn(),
}));

import { usePolicyConfig } from '@/features/merchants/hooks';

/**
 * Test suite for useEngineRating hook
 * Verifies ENGINE RATING correctly matches with T1, T2, T3 tiers
 */
describe('useEngineRating', () => {
  let queryClient: QueryClient;

  const mockPolicyConfig = {
    TIERS: {
      [CreditTier.T1]: {
        label: 'Elite (Low Risk)',
        maxLimit: 200000,
        startingLimit: 50000,
        feeRate: 0.02,
        maxTenure: 30,
        gracePeriod: 5,
        penaltyRate: 0.005,
        minScore: 85,
        maxScore: 100,
      },
      [CreditTier.T2]: {
        label: 'Standard (Medium Risk)',
        maxLimit: 100000,
        startingLimit: 30000,
        feeRate: 0.035,
        maxTenure: 30,
        gracePeriod: 2,
        penaltyRate: 0.01,
        minScore: 70,
        maxScore: 84,
      },
      [CreditTier.T3]: {
        label: 'New/Small (High Risk)',
        maxLimit: 50000,
        startingLimit: 20000,
        feeRate: 0.05,
        maxTenure: 30,
        gracePeriod: 0,
        penaltyRate: 0.02,
        minScore: 50,
        maxScore: 69,
      },
      [CreditTier.NONE]: {
        label: 'Ineligible',
        maxLimit: 0,
        startingLimit: 0,
        feeRate: 0,
        maxTenure: 0,
        gracePeriod: 0,
        penaltyRate: 0,
        minScore: 0,
        maxScore: 49,
      },
    },
    KILL_SWITCHES: {
      MAX_PORTFOLIO_EXPOSURE: 10000000,
      DELINQUENCY_15_PLUS_THRESHOLD: 0.08,
      MONTHLY_LOSS_BUDGET: 500000,
    },
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('getEngineRating', () => {
    describe('T1 Tier - Rating A (Elite, Low Risk)', () => {
      beforeEach(() => {
        vi.mocked(usePolicyConfig).mockReturnValue({
          data: mockPolicyConfig,
          isLoading: false,
          error: null,
        } as ReturnType<typeof usePolicyConfig>);
      });

      it('should return A for score at T1 minimum threshold (85)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(85)).toBe('A');
        });
      });

      it('should return A for score in T1 range (85-100)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(90)).toBe('A');
          expect(result.current.getEngineRating(95)).toBe('A');
          expect(result.current.getEngineRating(100)).toBe('A');
        });
      });

      it('should return A for perfect score (100)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(100)).toBe('A');
        });
      });
    });

    describe('T2 Tier - Rating B (Standard, Medium Risk)', () => {
      beforeEach(() => {
        vi.mocked(usePolicyConfig).mockReturnValue({
          data: mockPolicyConfig,
          isLoading: false,
          error: null,
        } as ReturnType<typeof usePolicyConfig>);
      });

      it('should return B for score at T2 minimum threshold (70)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(70)).toBe('B');
        });
      });

      it('should return B for score in T2 range (70-84)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(75)).toBe('B');
          expect(result.current.getEngineRating(80)).toBe('B');
          expect(result.current.getEngineRating(84)).toBe('B');
        });
      });

      it('should not return B for score at T1 threshold (85)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(85)).not.toBe('B');
          expect(result.current.getEngineRating(85)).toBe('A');
        });
      });
    });

    describe('T3 Tier - Rating C (New/Small, High Risk)', () => {
      beforeEach(() => {
        vi.mocked(usePolicyConfig).mockReturnValue({
          data: mockPolicyConfig,
          isLoading: false,
          error: null,
        } as ReturnType<typeof usePolicyConfig>);
      });

      it('should return C for score at T3 minimum threshold (50)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(50)).toBe('C');
        });
      });

      it('should return C for score in T3 range (50-69)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(55)).toBe('C');
          expect(result.current.getEngineRating(60)).toBe('C');
          expect(result.current.getEngineRating(69)).toBe('C');
        });
      });

      it('should not return C for score at T2 threshold (70)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(70)).not.toBe('C');
          expect(result.current.getEngineRating(70)).toBe('B');
        });
      });
    });

    describe('NONE Tier - Rating D (Ineligible)', () => {
      beforeEach(() => {
        vi.mocked(usePolicyConfig).mockReturnValue({
          data: mockPolicyConfig,
          isLoading: false,
          error: null,
        } as ReturnType<typeof usePolicyConfig>);
      });

      it('should return D for score below T3 threshold (< 50)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(0)).toBe('D');
          expect(result.current.getEngineRating(25)).toBe('D');
          expect(result.current.getEngineRating(49)).toBe('D');
        });
      });

      it('should return D for negative scores', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(-10)).toBe('D');
        });
      });

      it('should not return D for score at T3 threshold (50)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(50)).not.toBe('D');
          expect(result.current.getEngineRating(50)).toBe('C');
        });
      });
    });

    describe('Edge Cases', () => {
      beforeEach(() => {
        vi.mocked(usePolicyConfig).mockReturnValue({
          data: mockPolicyConfig,
          isLoading: false,
          error: null,
        } as ReturnType<typeof usePolicyConfig>);
      });

      it('should handle boundary values correctly (84 vs 85)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(84)).toBe('B'); // Just below T1
          expect(result.current.getEngineRating(85)).toBe('A'); // At T1 threshold
        });
      });

      it('should handle boundary values correctly (69 vs 70)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(69)).toBe('C'); // Just below T2
          expect(result.current.getEngineRating(70)).toBe('B'); // At T2 threshold
        });
      });

      it('should handle boundary values correctly (49 vs 50)', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(49)).toBe('D'); // Just below T3
          expect(result.current.getEngineRating(50)).toBe('C'); // At T3 threshold
        });
      });

      it('should handle scores above 100', async () => {
        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          // Scores above 100 are treated as raw credit scores (0-850 scale)
          // and normalized via getCreditScorePercent: (clamped/850)*100
          // 150 → (150/850)*100 ≈ 17.6 → 'D', 999 → clamped to 850 → 100 → 'A'
          expect(result.current.getEngineRating(150)).toBe('D');
          expect(result.current.getEngineRating(999)).toBe('A');
        });
      });

      it('should return D when policy config is not loaded', async () => {
        vi.mocked(usePolicyConfig).mockReturnValue({
          data: null,
          isLoading: false,
          error: null,
        } as ReturnType<typeof usePolicyConfig>);

        const { result } = renderHook(() => useEngineRating(), { wrapper });

        await waitFor(() => {
          expect(result.current.getEngineRating(90)).toBe('D');
        });
      });
    });
  });

  describe('getRecommendedTier', () => {
    beforeEach(() => {
      vi.mocked(usePolicyConfig).mockReturnValue({
        data: mockPolicyConfig,
        isLoading: false,
        error: null,
      } as ReturnType<typeof usePolicyConfig>);
    });

    it('should recommend T1 for Rating A scores (≥ 85)', async () => {
      const { result } = renderHook(() => useEngineRating(), { wrapper });

      await waitFor(() => {
        expect(result.current.getRecommendedTier(85)).toBe(CreditTier.T1);
        expect(result.current.getRecommendedTier(90)).toBe(CreditTier.T1);
        expect(result.current.getRecommendedTier(100)).toBe(CreditTier.T1);
      });
    });

    it('should recommend T2 for Rating B scores (70-84)', async () => {
      const { result } = renderHook(() => useEngineRating(), { wrapper });

      await waitFor(() => {
        expect(result.current.getRecommendedTier(70)).toBe(CreditTier.T2);
        expect(result.current.getRecommendedTier(75)).toBe(CreditTier.T2);
        expect(result.current.getRecommendedTier(84)).toBe(CreditTier.T2);
      });
    });

    it('should recommend T3 for Rating C scores (50-69)', async () => {
      const { result } = renderHook(() => useEngineRating(), { wrapper });

      await waitFor(() => {
        expect(result.current.getRecommendedTier(50)).toBe(CreditTier.T3);
        expect(result.current.getRecommendedTier(60)).toBe(CreditTier.T3);
        expect(result.current.getRecommendedTier(69)).toBe(CreditTier.T3);
      });
    });

    it('should recommend NONE for Rating D scores (< 50)', async () => {
      const { result } = renderHook(() => useEngineRating(), { wrapper });

      await waitFor(() => {
        expect(result.current.getRecommendedTier(0)).toBe(CreditTier.NONE);
        expect(result.current.getRecommendedTier(25)).toBe(CreditTier.NONE);
        expect(result.current.getRecommendedTier(49)).toBe(CreditTier.NONE);
      });
    });
  });

  describe('Rating-to-Tier Consistency', () => {
    beforeEach(() => {
      vi.mocked(usePolicyConfig).mockReturnValue({
        data: mockPolicyConfig,
        isLoading: false,
        error: null,
      } as ReturnType<typeof usePolicyConfig>);
    });

    it('should maintain consistent Rating-to-Tier mapping', async () => {
      const { result } = renderHook(() => useEngineRating(), { wrapper });

      await waitFor(() => {
        // Test all boundary scores
        const testCases = [
          { score: 100, expectedRating: 'A', expectedTier: CreditTier.T1 },
          { score: 85, expectedRating: 'A', expectedTier: CreditTier.T1 },
          { score: 84, expectedRating: 'B', expectedTier: CreditTier.T2 },
          { score: 70, expectedRating: 'B', expectedTier: CreditTier.T2 },
          { score: 69, expectedRating: 'C', expectedTier: CreditTier.T3 },
          { score: 50, expectedRating: 'C', expectedTier: CreditTier.T3 },
          { score: 49, expectedRating: 'D', expectedTier: CreditTier.NONE },
          { score: 0, expectedRating: 'D', expectedTier: CreditTier.NONE },
        ];

        testCases.forEach(({ score, expectedRating, expectedTier }) => {
          const rating = result.current.getEngineRating(score);
          const tier = result.current.getRecommendedTier(score);

          expect(rating).toBe(expectedRating);
          expect(tier).toBe(expectedTier);
        });
      });
    });

    it('should ensure Rating A always maps to T1', async () => {
      const { result } = renderHook(() => useEngineRating(), { wrapper });

      await waitFor(() => {
        const scoresForRatingA = [85, 90, 95, 100];

        scoresForRatingA.forEach((score) => {
          const rating = result.current.getEngineRating(score);
          const tier = result.current.getRecommendedTier(score);

          expect(rating).toBe('A');
          expect(tier).toBe(CreditTier.T1);
        });
      });
    });

    it('should ensure Rating B always maps to T2', async () => {
      const { result } = renderHook(() => useEngineRating(), { wrapper });

      await waitFor(() => {
        const scoresForRatingB = [70, 75, 80, 84];

        scoresForRatingB.forEach((score) => {
          const rating = result.current.getEngineRating(score);
          const tier = result.current.getRecommendedTier(score);

          expect(rating).toBe('B');
          expect(tier).toBe(CreditTier.T2);
        });
      });
    });

    it('should ensure Rating C always maps to T3', async () => {
      const { result } = renderHook(() => useEngineRating(), { wrapper });

      await waitFor(() => {
        const scoresForRatingC = [50, 55, 60, 69];

        scoresForRatingC.forEach((score) => {
          const rating = result.current.getEngineRating(score);
          const tier = result.current.getRecommendedTier(score);

          expect(rating).toBe('C');
          expect(tier).toBe(CreditTier.T3);
        });
      });
    });

    it('should ensure Rating D always maps to NONE', async () => {
      const { result } = renderHook(() => useEngineRating(), { wrapper });

      await waitFor(() => {
        const scoresForRatingD = [0, 25, 40, 49];

        scoresForRatingD.forEach((score) => {
          const rating = result.current.getEngineRating(score);
          const tier = result.current.getRecommendedTier(score);

          expect(rating).toBe('D');
          expect(tier).toBe(CreditTier.NONE);
        });
      });
    });
  });
});
