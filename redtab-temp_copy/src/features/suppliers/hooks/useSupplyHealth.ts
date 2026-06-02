import { useMemo } from 'react';
import type { Supplier } from '@/types';

/**
 * Metrics for a single supplier's health
 */
export interface SupplierHealthMetrics {
  id: string;
  healthScore: number; // 0-5 stars
  invoiceValidityRate: number; // 0-100%
  buyVolume: string; // Formatted display
}

/**
 * Network-wide concentration analysis
 */
export interface NetworkConcentrationData {
  exposureRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  concentrationPercentage: number; // 0-100
  suppliersInNetwork: number;
  riskSummary: string;
}

/**
 * Calculate supplier health score (0-5 stars) based on attributes
 *
 * Scoring Logic:
 * - Base: 3 points
 * - +1 if verified
 * - +0.5 if fee rate < 5%
 * - Max: 5, Min: 0
 */
const calculateHealthScore = (supplier: Supplier): number => {
  let score = 3; // Base score

  if (supplier.isVerified) score += 1;
  if (supplier.supplierFeeRate < 0.05) score += 0.5;

  return Math.min(5, Math.max(0, score));
};

/**
 * Calculate invoice validity rate (0-100%)
 *
 * Logic:
 * - Base: 95% if verified, 85% if not
 * - Reduce by fee rate (max 5% reduction)
 * - Min: 70%
 */
const calculateInvoiceValidityRate = (supplier: Supplier): number => {
  const baseRate = supplier.isVerified ? 95 : 85;
  const feeAdjustment = Math.min(supplier.supplierFeeRate * 100, 5);
  return Math.max(70, baseRate - feeAdjustment);
};

/**
 * Format buy volume for display
 * In production, this would use actual transaction history from API
 */
const formatBuyVolume = (): string => {
  return '450k+'; // Placeholder - would be calculated from transactions
};

/**
 * Calculate network concentration analysis
 *
 * Based on:
 * - Number of suppliers in network
 * - Average fee rates (indicator of cost efficiency)
 * - Herfindahl-Hirschman Index (HHI) concept
 *
 * Risk Levels:
 * - CRITICAL: < 2 suppliers (high dependency)
 * - HIGH: 2-3 suppliers
 * - MEDIUM: 3+ suppliers but concentration > 30%
 * - LOW: Well-diversified network
 */
const calculateNetworkConcentration = (suppliers: Supplier[]): NetworkConcentrationData => {
  if (suppliers.length === 0) {
    return {
      exposureRiskLevel: 'LOW',
      concentrationPercentage: 0,
      suppliersInNetwork: 0,
      riskSummary: 'No suppliers connected to this merchant.',
    };
  }

  const suppliersInNetwork = suppliers.length;

  // HHI-inspired concentration calculation
  const avgFeeRate = suppliers.reduce((sum, s) => sum + s.supplierFeeRate, 0) / suppliers.length;
  const concentration = Math.min(100, (1 / suppliersInNetwork) * 100 + (avgFeeRate * 100) / 2);

  // Determine risk level
  let exposureRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let riskSummary = 'Network is well-diversified with low concentration risk.';

  if (suppliersInNetwork < 2) {
    exposureRiskLevel = 'CRITICAL';
    riskSummary = 'Critical: Single supplier dependency creates operational risk.';
  } else if (suppliersInNetwork < 3) {
    exposureRiskLevel = 'HIGH';
    riskSummary = 'High: Limited supplier diversity increases vulnerability to disruptions.';
  } else if (concentration > 30) {
    exposureRiskLevel = 'MEDIUM';
    riskSummary = 'Medium: Supplier concentration is moderately high; consider diversification.';
  }

  return {
    exposureRiskLevel,
    concentrationPercentage: Math.round(concentration),
    suppliersInNetwork,
    riskSummary,
  };
};

/**
 * Hook to calculate supply health metrics for a list of suppliers
 *
 * @param suppliers - Array of supplier objects from API
 * @returns Object containing individual supplier metrics and network analysis
 *
 * @example
 * ```tsx
 * const { supplierMetrics, networkData } = useSupplyHealth(suppliers);
 *
 * supplierMetrics.forEach(metric => {
 *   console.log(`${metric.id}: Health ${metric.healthScore}/5`);
 * });
 *
 * console.log(`Risk Level: ${networkData.exposureRiskLevel}`);
 * ```
 */
export const useSupplyHealth = (suppliers: Supplier[]) => {
  const supplierMetrics = useMemo<SupplierHealthMetrics[]>(() => {
    return suppliers.map((supplier) => ({
      id: supplier.id,
      healthScore: calculateHealthScore(supplier),
      invoiceValidityRate: calculateInvoiceValidityRate(supplier),
      buyVolume: formatBuyVolume(),
    }));
  }, [suppliers]);

  const networkData = useMemo<NetworkConcentrationData>(() => {
    return calculateNetworkConcentration(suppliers);
  }, [suppliers]);

  return {
    supplierMetrics,
    networkData,
    metrics: {
      calculateHealthScore,
      calculateInvoiceValidityRate,
      formatBuyVolume,
    },
  };
};
