import { Resolver } from 'react-hook-form';
import { MerchantFormData } from '../types/merchant-form';

export const merchantFormResolver: Resolver<MerchantFormData> = (data) => {
  const errors: Record<string, { message: string }> = {};

  // Step 1 validation
  if (!data.name?.trim()) {
    errors.name = { message: 'Business name is required' };
  } else if (data.name.trim().length < 3) {
    errors.name = { message: 'Business name must be at least 3 characters' };
  } else if (data.name.trim().length > 100) {
    errors.name = { message: 'Business name cannot exceed 100 characters' };
  }

  if (!data.categoryId?.trim()) {
    errors.categoryId = { message: 'Business category is required' };
  }

  if (!data.marketSegmentId?.trim()) {
    errors.marketSegmentId = { message: 'Market segment is required' };
  }

  if (!data.contactPerson?.trim()) {
    errors.contactPerson = { message: 'Contact person is required' };
  } else if (data.contactPerson.trim().length < 2) {
    errors.contactPerson = { message: 'Contact person name must be at least 2 characters' };
  }

  if (!data.email?.trim()) {
    errors.email = { message: 'Email address is required' };
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = { message: 'Please enter a valid email address' };
  }

  if (!data.phone?.trim()) {
    errors.phone = { message: 'Phone number is required' };
  } else if (!/^[+\d\s\-()]+$/.test(data.phone.trim())) {
    errors.phone = { message: 'Please enter a valid phone number' };
  } else if (data.phone.replace(/\D/g, '').length < 7) {
    errors.phone = { message: 'Phone number must have at least 7 digits' };
  }

  // Financial validation
  if (data.bankFlows < 0) {
    errors.bankFlows = { message: 'Monthly bank inflow cannot be negative' };
  } else if (data.bankFlows > 999999999) {
    errors.bankFlows = { message: 'Monthly bank inflow exceeds maximum limit' };
  }

  if (data.posSales < 0) {
    errors.posSales = { message: 'POS sales cannot be negative' };
  } else if (data.posSales > 999999999) {
    errors.posSales = { message: 'POS sales exceeds maximum limit' };
  }

  if (data.profitMargin < 0) {
    errors.profitMargin = { message: 'Profit margin cannot be negative' };
  } else if (data.profitMargin > 100) {
    errors.profitMargin = { message: 'Profit margin cannot exceed 100%' };
  }

  // Obligations validation
  if (data.employeeArrears < 0) {
    errors.employeeArrears = { message: 'Employee arrears cannot be negative' };
  }
  if (data.householdDebt < 0) {
    errors.householdDebt = { message: 'Household debt cannot be negative' };
  }
  if (data.outsideLoans < 0) {
    errors.outsideLoans = { message: 'Outside loans cannot be negative' };
  }
  if (data.rentLease < 0) {
    errors.rentLease = { message: 'Monthly rent/lease cannot be negative' };
  }
  if (data.taxDues < 0) {
    errors.taxDues = { message: 'Tax dues cannot be negative' };
  }

  // Behavioral validation
  if (data.tenureMonths < 0) {
    errors.tenureMonths = { message: 'Months in operation cannot be negative' };
  } else if (data.tenureMonths > 600) {
    errors.tenureMonths = { message: 'Months in operation cannot exceed 600' };
  }

  if (data.refundRate < 0 || data.refundRate > 100) {
    errors.refundRate = { message: 'Refund rate must be between 0-100%' };
  }

  if (data.fulfillmentRate < 0 || data.fulfillmentRate > 100) {
    errors.fulfillmentRate = { message: 'Fulfillment rate must be between 0-100%' };
  }

  if (data.socialReputation < 0 || data.socialReputation > 100) {
    errors.socialReputation = { message: 'Social reputation score must be 0-100' };
  }

  if (data.responsiveness < 0 || data.responsiveness > 100) {
    errors.responsiveness = { message: 'Responsiveness score must be 0-100' };
  }

  // Additional numeric field validations for edge cases
  if (data.inventoryTurnover < 0) {
    errors.inventoryTurnover = { message: 'Inventory turnover cannot be negative' };
  } else if (data.inventoryTurnover > 365) {
    errors.inventoryTurnover = { message: 'Inventory turnover cannot exceed 365 cycles/year' };
  }

  if (data.liquidAssets < 0) {
    errors.liquidAssets = { message: 'Liquid assets cannot be negative' };
  } else if (data.liquidAssets > 999999999) {
    errors.liquidAssets = { message: 'Liquid assets exceeds maximum limit' };
  }

  if (data.growthTrend < -100 || data.growthTrend > 500) {
    errors.growthTrend = { message: 'Growth trend must be between -100% and 500%' };
  }

  return {
    values: Object.keys(errors).length === 0 ? data : {},
    errors,
  };
};
