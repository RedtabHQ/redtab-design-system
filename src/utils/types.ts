import type React from 'react';

/**
 * Extends a props type with an optional `className` string.
 * Useful for components that accept style overrides via Tailwind or CSS modules.
 */
export type PropsWithClassName<P = unknown> = P & { className?: string };

/**
 * Extends a props type with an optional `children` slot.
 */
export type PropsWithChildren<P = unknown> = P & { children?: React.ReactNode };

/**
 * Makes the specified keys `K` optional on type `T` while keeping all other
 * keys with their original required/optional status.
 *
 * @example
 * type ButtonProps = Optional<{ label: string; disabled: boolean }, 'disabled'>
 * // → { label: string; disabled?: boolean }
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes the specified keys `K` required on type `T` while keeping all other
 * keys with their original required/optional status.
 *
 * @example
 * type ButtonProps = RequiredKeys<{ label?: string; onClick?: () => void }, 'label'>
 * // → { label: string; onClick?: () => void }
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Resolves to the ref type of any React element type.
 * Wraps `React.ComponentRef` for convenient use alongside component definitions.
 *
 * @example
 * type InputRef = ComponentRef<'input'> // → HTMLInputElement
 */
export type ComponentRef<T extends React.ElementType> = React.ComponentRef<T>;
