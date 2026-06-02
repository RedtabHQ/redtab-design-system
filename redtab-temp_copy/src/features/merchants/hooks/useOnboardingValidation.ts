import { useState, useCallback } from 'react';
import { OnboardingFormData } from './useOnboardingForm';

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Hook for managing form validation
 */
export const useOnboardingValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateStep = useCallback((step: number, form: OnboardingFormData): boolean => {
    const errors: ValidationErrors = {};

    switch (step) {
      case 1: // Entity Profile
        // Name validation
        if (!form.name?.trim()) {
          errors.name = 'Business name is required';
        } else if (form.name.trim().length < 3) {
          errors.name = 'Business name must be at least 3 characters';
        } else if (form.name.trim().length > 100) {
          errors.name = 'Business name cannot exceed 100 characters';
        }

        // Category validation
        if (!form.categoryId?.trim()) {
          errors.categoryId = 'Business category is required';
        }

        // Contact person validation
        if (!form.contactPerson?.trim()) {
          errors.contactPerson = 'Contact person is required';
        } else if (form.contactPerson.trim().length < 2) {
          errors.contactPerson = 'Contact person name must be at least 2 characters';
        }

        // Email validation
        if (!form.email?.trim()) {
          errors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
          errors.email = 'Please enter a valid email address';
        }

        // Phone validation
        if (!form.phone?.trim()) {
          errors.phone = 'Phone number is required';
        } else if (!/^[+\d\s\-()]+$/.test(form.phone.trim())) {
          errors.phone = 'Please enter a valid phone number';
        } else if (form.phone.replace(/\D/g, '').length < 7) {
          errors.phone = 'Phone number must have at least 7 digits';
        }

        // Address validation (optional but if provided, validate)
        if (form.address?.trim() && form.address.trim().length < 5) {
          errors.address = 'Address must be at least 5 characters if provided';
        }

        // Registration number validation (optional but if provided, validate)
        if (form.registrationNumber?.trim() && form.registrationNumber.trim().length < 3) {
          errors.registrationNumber = 'Registration number must be at least 3 characters if provided';
        }

        break;

      case 2: // Financial Capacity
        // Bank flows validation
        if (form.bankFlows === null || form.bankFlows === undefined) {
          errors.bankFlows = 'Monthly bank inflow is required';
        } else if (form.bankFlows < 0) {
          errors.bankFlows = 'Monthly bank inflow cannot be negative';
        } else if (form.bankFlows > 999999999) {
          errors.bankFlows = 'Monthly bank inflow exceeds maximum limit';
        }

        // POS sales validation
        if (form.posSales === null || form.posSales === undefined) {
          errors.posSales = 'Average monthly POS sales is required';
        } else if (form.posSales < 0) {
          errors.posSales = 'POS sales cannot be negative';
        } else if (form.posSales > 999999999) {
          errors.posSales = 'POS sales exceeds maximum limit';
        }

        // Inventory turnover validation
        if (form.inventoryTurnover < 0) {
          errors.inventoryTurnover = 'Inventory turnover cannot be negative';
        } else if (form.inventoryTurnover > 365) {
          errors.inventoryTurnover = 'Inventory turnover cannot exceed 365 cycles per year';
        }

        // Profit margin validation
        if (form.profitMargin < 0) {
          errors.profitMargin = 'Profit margin cannot be negative';
        } else if (form.profitMargin > 100) {
          errors.profitMargin = 'Profit margin cannot exceed 100%';
        }

        // Liquid assets validation
        if (form.liquidAssets < 0) {
          errors.liquidAssets = 'Liquid assets cannot be negative';
        } else if (form.liquidAssets > 999999999) {
          errors.liquidAssets = 'Liquid assets exceeds maximum limit';
        }

        // Growth trend validation
        if (form.growthTrend < -100) {
          errors.growthTrend = 'Growth trend cannot be less than -100%';
        } else if (form.growthTrend > 500) {
          errors.growthTrend = 'Growth trend cannot exceed 500%';
        }

        break;

      case 3: // Obligations
        // Employee arrears validation
        if (form.employeeArrears < 0) {
          errors.employeeArrears = 'Employee arrears cannot be negative';
        } else if (form.employeeArrears > 999999999) {
          errors.employeeArrears = 'Employee arrears exceeds maximum limit';
        }

        // Household debt validation
        if (form.householdDebt < 0) {
          errors.householdDebt = 'Household debt cannot be negative';
        } else if (form.householdDebt > 999999999) {
          errors.householdDebt = 'Household debt exceeds maximum limit';
        }

        // Outside loans validation
        if (form.outsideLoans < 0) {
          errors.outsideLoans = 'Outside loans cannot be negative';
        } else if (form.outsideLoans > 999999999) {
          errors.outsideLoans = 'Outside loans exceeds maximum limit';
        }

        // Rent/lease validation
        if (form.rentLease < 0) {
          errors.rentLease = 'Monthly rent/lease cannot be negative';
        } else if (form.rentLease > 999999999) {
          errors.rentLease = 'Monthly rent/lease exceeds maximum limit';
        }

        // Tax dues validation
        if (form.taxDues < 0) {
          errors.taxDues = 'Tax dues cannot be negative';
        } else if (form.taxDues > 999999999) {
          errors.taxDues = 'Tax dues exceeds maximum limit';
        }

        break;

      case 4: // Behavioral
        // Tenure validation
        if (form.tenureMonths < 0) {
          errors.tenureMonths = 'Months in operation cannot be negative';
        } else if (form.tenureMonths > 600) {
          errors.tenureMonths = 'Months in operation cannot exceed 600 (50 years)';
        }

        // Refund rate validation
        if (form.refundRate < 0) {
          errors.refundRate = 'Refund rate cannot be negative';
        } else if (form.refundRate > 100) {
          errors.refundRate = 'Refund rate cannot exceed 100%';
        }

        // Fulfillment rate validation
        if (form.fulfillmentRate < 0) {
          errors.fulfillmentRate = 'Fulfillment rate cannot be negative';
        } else if (form.fulfillmentRate > 100) {
          errors.fulfillmentRate = 'Fulfillment rate cannot exceed 100%';
        }

        // Social reputation validation
        if (form.socialReputation < 0) {
          errors.socialReputation = 'Social reputation score cannot be negative';
        } else if (form.socialReputation > 100) {
          errors.socialReputation = 'Social reputation score cannot exceed 100';
        }

        // Responsiveness validation
        if (form.responsiveness < 0) {
          errors.responsiveness = 'Responsiveness score cannot be negative';
        } else if (form.responsiveness > 100) {
          errors.responsiveness = 'Responsiveness score cannot exceed 100';
        }

        break;

      case 5: // Documents
        // Optional - documents can be uploaded later
        if (form.panNumber?.trim() && form.panNumber.trim().length < 3) {
          errors.panNumber = 'PAN number must be at least 3 characters if provided';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  const validateAll = useCallback(
    (form: OnboardingFormData): boolean => {
      for (let i = 1; i <= 5; i++) {
        if (!validateStep(i, form)) {
          return false;
        }
      }
      return true;
    },
    [validateStep]
  );

  const clearError = useCallback((field: string) => {
    setValidationErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const reset = useCallback(() => {
    setValidationErrors({});
  }, []);

  return {
    validationErrors,
    validateStep,
    validateAll,
    clearError,
    reset,
  };
};
