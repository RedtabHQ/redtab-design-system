/**
 * Merchant Data Service
 *
 * Provides synchronous access to merchant data for store operations.
 * This replaces direct useMerchantStore usage in other stores.
 *
 * TODO: When migrating to a server-centric architecture, this should be
 * replaced with API calls from creditStore actions.
 */

import type { Merchant } from '@types';

interface TierPolicy {
  label: string;
  maxLimit: number;
  startingLimit: number;
  feeRate: number;
  maxTenure: number;
  gracePeriod: number;
  penaltyRate: number;
  minScore: number;
  maxScore: number;
}

interface PolicyConfig {
  TIERS: Record<string, TierPolicy>;
  KILL_SWITCHES: Record<string, number>;
}

// This will be populated from API/constants
let merchantCache: Map<string, Merchant> = new Map();
let policyConfigCache: PolicyConfig | null = null;

/**
 * Initialize merchant cache from API or constants
 * Should be called once during app initialization
 */
export async function initializeMerchantCache(merchants: Merchant[], policyConfig: PolicyConfig) {
  merchantCache.clear();
  merchants.forEach(m => merchantCache.set(m.id, m));
  policyConfigCache = policyConfig;
}

/**
 * Get a merchant by ID from cache
 */
export function getMerchantFromCache(id: string): Merchant | undefined {
  return merchantCache.get(id);
}

/**
 * Get policy config tier from cache
 */
export function getPolicyTierFromCache(tier: string): TierPolicy | undefined {
  return policyConfigCache?.TIERS?.[tier];
}

/**
 * Clear all caches
 */
export function clearMerchantCache() {
  merchantCache.clear();
  policyConfigCache = null;
}
