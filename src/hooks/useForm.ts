import { useState, useCallback, useMemo } from 'react';

type FormErrors<T> = Partial<Record<keyof T, string>>;
type FormTouched<T> = Partial<Record<keyof T, boolean>>;

interface UseFormReturn<T extends Record<string, unknown>> {
  /** Current form values */
  values: T;
  /** Validation errors keyed by field name */
  errors: FormErrors<T>;
  /** Fields that have been blurred at least once */
  touched: FormTouched<T>;
  /** Handles input onChange events, updates values by field name */
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  /** Marks a field as touched on blur */
  handleBlur: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  /** Manually set the value of a specific field */
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Manually set an error for a specific field, or clear it with an empty string */
  setFieldError: (field: keyof T, error: string) => void;
  /** Reset form to initial values, clearing all errors and touched state */
  reset: () => void;
  /** True when there are no errors */
  isValid: boolean;
}

/**
 * Generic form state management hook.
 *
 * @example
 * ```tsx
 * const { values, errors, handleChange, handleBlur, isValid } = useForm({
 *   email: '',
 *   name: '',
 * });
 * ```
 */
export function useForm<T extends Record<string, unknown>>(
  initialValues: T
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});

  const handleChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = event.target;
      const fieldName = name as keyof T;

      const resolvedValue =
        type === 'checkbox'
          ? (event.target as HTMLInputElement).checked
          : value;

      setValues((prev) => ({
        ...prev,
        [fieldName]: resolvedValue,
      }));
    },
    []
  );

  const handleBlur = useCallback(
    (
      event: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name } = event.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    },
    []
  );

  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => {
      if (error === '') {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return { ...prev, [field]: error };
    });
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = useMemo(() => {
    const errorKeys = Object.keys(errors) as Array<keyof T>;
    return errorKeys.every((key) => !errors[key]);
  }, [errors]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    reset,
    isValid,
  };
}
