/**
 * Returns `true` when `value` is a syntactically valid email address.
 * Uses a pragmatic RFC 5322-subset regex suitable for UI validation.
 */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Returns `true` when `value` is a valid absolute URL with an http or https scheme.
 * Falls back to `false` for any string that the URL constructor rejects.
 */
export function isUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns `true` when `value` matches a basic international phone number format.
 * Accepts an optional leading `+`, then 7–15 digits with optional spaces, dashes, or dots.
 * Examples: "+1 800-555-0199", "07911 123456", "+49.30.12345678"
 */
export function isPhone(value: string): boolean {
  return /^\+?[\d\s\-.(]{7,20}[\d)]$/.test(value.trim());
}

/**
 * Returns a validator that enforces a minimum string length.
 * Returns an error message string when the constraint is violated, or `undefined` when valid.
 */
export function minLength(min: number): (value: string) => string | undefined {
  return (value: string) => {
    if (value.length < min) {
      return `Must be at least ${min} character${min !== 1 ? 's' : ''}.`;
    }
    return undefined;
  };
}

/**
 * Returns a validator that enforces a maximum string length.
 * Returns an error message string when the constraint is violated, or `undefined` when valid.
 */
export function maxLength(max: number): (value: string) => string | undefined {
  return (value: string) => {
    if (value.length > max) {
      return `Must be no more than ${max} character${max !== 1 ? 's' : ''}.`;
    }
    return undefined;
  };
}

/**
 * Returns an error message when `value` is empty, null, undefined, or a blank string.
 * Returns `undefined` when a value is present.
 */
export function required(value: unknown): string | undefined {
  if (value === null || value === undefined) return 'This field is required.';
  if (typeof value === 'string' && value.trim() === '') return 'This field is required.';
  return undefined;
}

/**
 * Returns a validator that tests a string against a regular expression.
 * Returns the provided `message` when the pattern does not match, or `undefined` when valid.
 */
export function pattern(
  regex: RegExp,
  message: string,
): (value: string) => string | undefined {
  return (value: string) => {
    if (!regex.test(value)) return message;
    return undefined;
  };
}
