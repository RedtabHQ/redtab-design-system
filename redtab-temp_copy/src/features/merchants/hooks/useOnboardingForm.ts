import { useState, useCallback } from 'react';

export interface OnboardingFormData {
  name: string;
  category: string;
  categoryId?: string;
  registrationNumber: string;
  vatPan: string;
  contactPerson: string;
  email: string;
  phone: string;
  regionId: string;
  address?: string;
  panNumber?: string;
  bankFlows: number;
  posSales: number;
  inventoryTurnover: number;
  profitMargin: number;
  liquidAssets: number;
  growthTrend: number;
  employeeArrears: number;
  householdDebt: number;
  outsideLoans: number;
  rentLease: number;
  taxDues: number;
  tenureMonths: number;
  refundRate: number;
  fulfillmentRate: number;
  socialReputation: number;
  responsiveness: number;
  docs: string[];
}

const INITIAL_FORM_DATA: OnboardingFormData = {
  name: '',
  category: '',
  categoryId: '',
  registrationNumber: '',
  vatPan: '',
  contactPerson: '',
  email: '',
  phone: '',
  regionId: 'REG-NP',
  address: '',
  panNumber: '',
  bankFlows: 0,
  posSales: 0,
  inventoryTurnover: 12,
  profitMargin: 15,
  liquidAssets: 0,
  growthTrend: 5,
  employeeArrears: 0,
  householdDebt: 0,
  outsideLoans: 0,
  rentLease: 0,
  taxDues: 0,
  tenureMonths: 1,
  refundRate: 0,
  fulfillmentRate: 95,
  socialReputation: 80,
  responsiveness: 90,
  docs: [],
};

/**
 * Hook for managing form data and field updates
 */
export const useOnboardingForm = (initialData?: Partial<OnboardingFormData>) => {
  const [form, setForm] = useState<OnboardingFormData>({
    ...INITIAL_FORM_DATA,
    ...initialData,
  });

  const updateField = useCallback(<K extends keyof OnboardingFormData>(
    field: K,
    value: OnboardingFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateBatch = useCallback((updates: Partial<OnboardingFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setForm({ ...INITIAL_FORM_DATA, ...initialData });
  }, [initialData]);

  return {
    form,
    updateField,
    updateBatch,
    reset,
  };
};
