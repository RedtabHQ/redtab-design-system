/**
 * Contract calculation helpers
 * Provides utility functions to compute derived values from Contract entities
 */

import type { Contract } from '@/types';

/**
 * Calculate remaining principal (principal due)
 * @param contract - Contract object
 * @returns Principal amount still owed
 */
export const calculatePrincipalDue = (contract: Contract): number => {
  const principalPaid = contract.principalPaid ?? 0;
  return Math.max(0, contract.drawdownAmount - principalPaid);
};

/**
 * Calculate total fees based on principal and fee rate
 * @param contract - Contract object
 * @returns Total fees amount
 */
export const calculateTotalFees = (contract: Contract): number => {
  const totalFeeRate = contract.totalFeeRate ?? 0;
  return (contract.drawdownAmount * totalFeeRate) / 100;
};

/**
 * Calculate fees due (assuming proportional to remaining principal)
 * @param contract - Contract object
 * @returns Fees amount still owed
 */
export const calculateFeesDue = (contract: Contract): number => {
  const totalFees = calculateTotalFees(contract);
  const principalDue = calculatePrincipalDue(contract);
  const paymentRatio = principalDue / contract.drawdownAmount;
  return totalFees * paymentRatio;
};

/**
 * Calculate penalties due
 * @param contract - Contract object
 * @returns Current penalty amount
 */
export const calculatePenaltiesDue = (contract: Contract): number => {
  return contract.currentPenalty || 0;
};

/**
 * Calculate total amount due (principal + fees + penalties)
 * @param contract - Contract object
 * @returns Total outstanding amount
 */
export const calculateTotalDue = (contract: Contract): number => {
  const principalDue = calculatePrincipalDue(contract);
  const feesDue = calculateFeesDue(contract);
  const penaltiesDue = calculatePenaltiesDue(contract);

  return principalDue + feesDue + penaltiesDue;
};

/**
 * Calculate total amount paid so far
 * @param contract - Contract object
 * @returns Total amount paid (principal only, as fees/penalties tracking may vary)
 */
export const calculateTotalPaid = (contract: Contract): number => {
  return contract.principalPaid || 0;
};

/**
 * Calculate payment progress percentage
 * @param contract - Contract object
 * @returns Payment completion percentage (0-100)
 */
export const calculatePaymentProgress = (contract: Contract): number => {
  if (contract.drawdownAmount === 0) return 0;
  const paidPercentage = ((contract.principalPaid ?? 0) / contract.drawdownAmount) * 100;
  return Math.min(100, Math.max(0, paidPercentage));
};

/**
 * Check if contract is overdue
 * @param contract - Contract object
 * @returns True if contract has any overdue days
 */
export const isContractOverdue = (contract: Contract): boolean => {
  return (contract.daysOverdue || 0) > 0;
};

/**
 * Check if contract is fully paid
 * @param contract - Contract object
 * @returns True if principal is fully paid
 */
export const isContractPaid = (contract: Contract): boolean => {
  return calculatePrincipalDue(contract) === 0;
};

/**
 * Calculate days remaining until due date
 * @param contract - Contract object
 * @returns Number of days remaining (negative if overdue)
 */
export const calculateDaysRemaining = (contract: Contract): number => {
  if (!contract.dueDate) return 0;

  const now = new Date();
  const dueDate = new Date(contract.dueDate);
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Get contract lifecycle progress
 * @param contract - Contract object
 * @returns Object with days elapsed, days remaining, and progress percentage
 */
export const getContractLifecycle = (contract: Contract): {
  daysElapsed: number;
  daysRemaining: number;
  progressPercentage: number;
} => {
  const daysRemaining = calculateDaysRemaining(contract);
  const { originalTenure } = contract as Contract & { originalTenure?: number };
  const totalDays = originalTenure ?? contract.tenureDays ?? 0;
  const daysElapsed = Math.max(0, totalDays - daysRemaining);
  const progressPercentage = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0;

  return {
    daysElapsed: Math.max(0, daysElapsed),
    daysRemaining,
    progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
  };
};

/**
 * Format contract summary for display
 * @param contract - Contract object
 * @returns Formatted summary object
 */
export const getContractSummary = (contract: Contract) => {
  return {
    principal: {
      total: contract.drawdownAmount,
      paid: contract.principalPaid,
      due: calculatePrincipalDue(contract),
    },
    fees: {
      rate: contract.totalFeeRate,
      total: calculateTotalFees(contract),
      due: calculateFeesDue(contract),
    },
    penalties: {
      current: calculatePenaltiesDue(contract),
    },
    totals: {
      due: calculateTotalDue(contract),
      paid: calculateTotalPaid(contract),
    },
    lifecycle: getContractLifecycle(contract),
    status: {
      isOverdue: isContractOverdue(contract),
      isPaid: isContractPaid(contract),
      daysOverdue: contract.daysOverdue || 0,
      paymentProgress: calculatePaymentProgress(contract),
    },
  };
};
