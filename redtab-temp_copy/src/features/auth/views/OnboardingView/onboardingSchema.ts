
import { z } from 'zod';


// Validation Schema using Zod
const onboardingSchema = z.object({
  // Step 1: Entity
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(2, 'Category is required'),
  registrationNumber: z.string().min(3, 'Registration number is required'),
  vatPan: z.string().optional(),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits'),
  regionId: z.string().min(1, 'Region is required'),

  // Step 2: Capacity (Financials)
  bankFlows: z.number().min(0, 'Bank flows must be positive'),
  posSales: z.number().min(0, 'POS sales must be positive'),
  inventoryTurnover: z.number().min(1, 'Inventory turnover must be at least 1'),
  profitMargin: z.number().min(0).max(100, 'Profit margin must be between 0 and 100'),
  liquidAssets: z.number().min(0, 'Liquid assets must be positive'),
  growthTrend: z.number().min(0, 'Growth trend must be positive'),

  // Step 3: Obligations
  employeeArrears: z.number().min(0, 'Employee arrears must be positive'),
  householdDebt: z.number().min(0, 'Household debt must be positive'),
  outsideLoans: z.number().min(0, 'Outside loans must be positive'),
  rentLease: z.number().min(0, 'Rent/lease must be positive'),
  taxDues: z.number().min(0, 'Tax dues must be positive'),

  // Step 4: Behavioral
  tenureMonths: z.number().min(1, 'Business must be active for at least 1 month'),
  refundRate: z.number().min(0).max(100, 'Refund rate must be between 0 and 100'),
  fulfillmentRate: z.number().min(0).max(100, 'Fulfillment rate must be between 0 and 100'),
  socialReputation: z.number().min(0).max(100, 'Social reputation must be between 0 and 100'),
  responsiveness: z.number().min(0).max(100, 'Responsiveness must be between 0 and 100'),

  // Step 5: Documents
  docs: z.array(z.string()).optional()
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export { onboardingSchema, OnboardingFormData };