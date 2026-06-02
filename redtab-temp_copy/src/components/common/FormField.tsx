/**
 * Reusable FormField component for react-hook-form integration
 * Handles field rendering with error display and styling
 */

import React from 'react';
import { Controller, FieldValues, FieldPath, Control, RegisterOptions } from 'react-hook-form';
import { Input } from './Input';

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  rules?: RegisterOptions;
  className?: string;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  helperText,
  icon,
  rules,
  className = '',
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules as RegisterOptions<TFieldValues, TName>}
      render={({ field: { ref: fieldRef, ...field }, fieldState: { error } }) => (
        <Input
          ref={fieldRef}
          {...field}
          type={type}
          label={label}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          error={error?.message}
          helperText={helperText}
          icon={icon}
          className={className}
        />
      )}
    />
  );
}
