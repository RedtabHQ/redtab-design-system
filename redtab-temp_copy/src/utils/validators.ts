/**
 * Centralized validation utilities for form fields
 * Provides reusable validation patterns and error messages
 */

// Email validation
export const emailValidator = {
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email',
  },
  required: 'Email is required',
};

// Password validation
export const passwordValidator = (minLength = 6) => ({
  required: 'Password is required',
  minLength: {
    value: minLength,
    message: `Password must be at least ${minLength} characters`,
  },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
  },
});

// Phone validation
export const phoneValidator = {
  pattern: {
    value: /^(\+84|0)[1-9]\d{8}$/,
    message: 'Invalid phone number',
  },
  required: 'Phone number is required',
};

// URL validation
export const urlValidator = {
  pattern: {
    value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    message: 'Invalid URL',
  },
};

// Tax code validation (Vietnam)
export const taxCodeValidator = {
  pattern: {
    value: /^\d{10}(?:\d{3})?$/,
    message: 'Invalid tax code (10 or 13 digits)',
  },
  required: 'Tax code is required',
};

// Business registration validation
export const businessRegValidator = {
  pattern: {
    value: /^\d{10,13}$/,
    message: 'Invalid business registration code',
  },
  required: 'Business registration code is required',
};

// Bank account validation
export const bankAccountValidator = {
  pattern: {
    value: /^\d{9,18}$/,
    message: 'Invalid bank account number',
  },
  required: 'Bank account number is required',
};

// Bank provider validator (for supplier settlement)
export const bankProviderValidator = {
  required: 'Payment provider is required',
  minLength: {
    value: 2,
    message: 'Provider name must be at least 2 characters',
  },
  pattern: {
    value: /^[A-Z][A-Z0-9\s]*$/i,
    message: 'Invalid provider name',
  },
};

// Account number validator (for supplier settlement)
export const accountNumberValidator = {
  required: 'Account number is required',
  minLength: {
    value: 5,
    message: 'Account number must be at least 5 characters',
  },
  pattern: {
    value: /^[A-Z0-9]+$/i,
    message: 'Account number must contain only letters and numbers',
  },
};

// Required field validator
export const requiredValidator = (fieldName: string) => ({
  required: `${fieldName} is required`,
});

// String length validators
export const stringLengthValidator = (min: number, max: number) => ({
  minLength: {
    value: min,
    message: `Must be at least ${min} characters`,
  },
  maxLength: {
    value: max,
    message: `Maximum ${max} characters`,
  },
});

// Number range validators
export const numberRangeValidator = (min: number, max: number) => ({
  min: {
    value: min,
    message: `Minimum value is ${min}`,
  },
  max: {
    value: max,
    message: `Maximum value is ${max}`,
  },
});

/**
 * Custom validation functions
 */

export const customValidators = {
  // Match two fields (e.g., password confirmation)
  matchField: (value: string, fieldValue: string, fieldName: string) => {
    return value === fieldValue || `Does not match ${fieldName}`;
  },

  // Check if email format is valid and verify against pattern
  validateEmailDomain: (email: string) => {
    const validDomains = ['@gmail.com', '@company.com']; // Customize as needed
    const domain = email.substring(email.lastIndexOf('@'));
    return validDomains.includes(domain) || 'Email domain is not supported';
  },

  // Validate file type
  validateFileType: (file: File, allowedTypes: string[]) => {
    return allowedTypes.includes(file.type) || `File type is not supported. Allowed: ${allowedTypes.join(', ')}`;
  },

  // Validate file size (in MB)
  validateFileSize: (file: File, maxSizeMB: number) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes || `File size must be less than ${maxSizeMB}MB`;
  },

  // Validate date is in the future
  validateFutureDate: (date: string) => {
    return new Date(date) > new Date() || 'Date must be in the future';
  },

  // Validate date is in the past
  validatePastDate: (date: string) => {
    return new Date(date) < new Date() || 'Date must be in the past';
  },

  // Validate age minimum
  validateMinAge: (birthDate: string, minAge: number) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= minAge || `Must be at least ${minAge} years old`;
  },

  // Validate URL is reachable (async)
  validateUrlReachable: async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok || 'URL is not accessible';
    } catch {
      return 'URL is invalid or not accessible';
    }
  },

  // Check if value is unique (async - requires API call)
  validateUnique: async (value: string, checkFunction: (val: string) => Promise<boolean>) => {
    const isUnique = await checkFunction(value);
    return isUnique || 'This value is already in use';
  },
};

/**
 * Preset validation schemas for common forms
 */

export const validationSchemas = {
  login: {
    email: {
      required: 'Email is required',
      pattern: emailValidator.pattern,
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 1,
        message: 'Password is required',
      },
    },
  },

  registration: {
    email: {
      required: 'Email is required',
      pattern: emailValidator.pattern,
    },
    password: passwordValidator(6),
    confirmPassword: {
      required: 'Confirm password is required',
    },
    firstName: {
      required: 'First name is required',
      minLength: {
        value: 2,
        message: 'First name must be at least 2 characters',
      },
    },
    lastName: {
      required: 'Last name is required',
      minLength: {
        value: 2,
        message: 'Last name must be at least 2 characters',
      },
    },
    phone: phoneValidator,
  },

  merchantProfile: {
    businessName: {
      required: 'Business name is required',
      minLength: {
        value: 3,
        message: 'Business name must be at least 3 characters',
      },
    },
    taxCode: taxCodeValidator,
    businessRegCode: businessRegValidator,
    email: {
      required: 'Email is required',
      pattern: emailValidator.pattern,
    },
    phone: phoneValidator,
    bankAccount: bankAccountValidator,
  },

  supplierProfile: {
    companyName: {
      required: 'Company name is required',
      minLength: {
        value: 3,
        message: 'Company name must be at least 3 characters',
      },
    },
    contactPerson: {
      required: 'Contact person is required',
      minLength: {
        value: 2,
        message: 'Contact person name must be at least 2 characters',
      },
    },
    email: {
      required: 'Email is required',
      pattern: emailValidator.pattern,
    },
    phone: phoneValidator,
    // Supplier commercial terms
    paymentTermDays: {
      required: 'Payment term is required',
      min: {
        value: 0,
        message: 'Payment term cannot be negative',
      },
      max: {
        value: 90,
        message: 'Payment term maximum 90 days',
      },
    },
    supplierFeeRate: {
      required: 'Service fee is required',
      min: {
        value: 0,
        message: 'Service fee cannot be negative',
      },
      max: {
        value: 0.1,
        message: 'Service fee maximum 10%',
      },
    },
    numberOfDisbursementPeriods: {
      required: 'Number of disbursement periods is required',
      min: {
        value: 1,
        message: 'At least 1 period is required',
      },
      max: {
        value: 12,
        message: 'Maximum 12 periods supported',
      },
    },
    settlementMode: {
      required: 'Settlement mode is required',
    },
    bankProvider: bankProviderValidator,
    bankAccountNumber: accountNumberValidator,
  },
};

// Type helper for validation rules
export type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: string | boolean;
    pattern?: { value: RegExp; message: string };
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    validate?: (value: unknown) => string | boolean;
  };
};
