# Redtab Design System — Design Reference

## Brand Colors

Primary is red (`#e63946`). Semantic palette covers success/warning/error/info. Neutral goes 0→950.

| Token | Value | Use |
|-------|-------|-----|
| `primary-500` | `#e63946` | CTA buttons, active states, brand accents |
| `primary-600` | `#c1121f` | Button hover |
| `primary-700` | `#991b1b` | Button active/pressed |
| `neutral-0` | `#ffffff` | Surface backgrounds |
| `neutral-100` | `#f5f5f5` | Subtle backgrounds, ghost hover |
| `neutral-300` | `#d4d4d4` | Borders, dividers |
| `neutral-700` | `#404040` | Secondary text |
| `neutral-800` | `#262626` | Primary text |
| `neutral-900` | `#171717` | High-contrast text |
| `success-500` | `#22c55e` | Success states |
| `warning-500` | `#f59e0b` | Warning states |
| `error-500` | `#ef4444` | Error states |
| `info-500` | `#3b82f6` | Informational states |

---

## Typography

Font stack: system-ui (inherits from host app). Design system provides scale + semantic mappings.

### Scale

| Token | Size | Weight | Line Height | Use |
|-------|------|--------|-------------|-----|
| `h1` | 60px | 700 | 1.2 | Page titles |
| `h2` | 48px | 700 | 1.2 | Section headings |
| `h3` | 36px | 700 | 1.2 | Card headings |
| `h4` | 30px | 600 | 1.2 | Sub-headings |
| `h5` | 24px | 600 | 1.2 | Widget titles |
| `h6` | 20px | 600 | 1.2 | Small headings |
| `body` | 16px | 400 | 1.5 | Body text |
| `caption` | 14px | 400 | 1.5 | Labels, helper text |

### Text Size Classes (Tailwind)

`text-xs` (12px) · `text-sm` (14px) · `text-base` (16px) · `text-lg` (18px) · `text-xl` (20px) · `text-2xl` (24px) · `text-3xl` (30px) · `text-4xl` (36px) · `text-5xl` (48px) · `text-6xl` (60px)

---

## Spacing

4px base grid.

| Token | Value | Tailwind |
|-------|-------|---------|
| `spacing.1` | 4px | `p-1`, `m-1` |
| `spacing.2` | 8px | `p-2`, `m-2` |
| `spacing.3` | 12px | `p-3`, `m-3` |
| `spacing.4` | 16px | `p-4`, `m-4` |
| `spacing.6` | 24px | `p-6`, `m-6` |
| `spacing.8` | 32px | `p-8`, `m-8` |
| `spacing.12` | 48px | `p-12`, `m-12` |
| `spacing.16` | 64px | `p-16`, `m-16` |

---

## Component Patterns

### CVA Variants

All components use `class-variance-authority` + `cn()` (clsx + tailwind-merge).

```tsx
const variants = cva('base-classes', {
  variants: {
    variant: { primary: '...', secondary: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});
```

### forwardRef Pattern

All interactive components wrap with `forwardRef` and set `displayName`.

```tsx
export const Component = forwardRef<HTMLElement, Props>(({ className, ...props }, ref) => (
  <element ref={ref} className={cn(variants({ className }))} {...props} />
));
Component.displayName = 'Component';
```

---

## Button

4 variants × 3 sizes.

| Variant | Background | Text | Use |
|---------|-----------|------|-----|
| `primary` | `primary-500` | white | Main CTA |
| `secondary` | white + `neutral-300` border | `neutral-800` | Secondary action |
| `ghost` | transparent | `neutral-700` | Tertiary, toolbar |
| `danger` | `error-500` | white | Destructive action |

| Size | Height | Padding | Text |
|------|--------|---------|------|
| `sm` | 32px | px-3 | xs |
| `md` | 40px | px-4 | sm |
| `lg` | 48px | px-6 | base |

`isLoading` prop disables button + shows spinner. Focus ring: `primary-500` 2px offset.

---

## Badge

Semantic pill. No size variants — fixed `px-2.5 py-0.5 text-xs`.

| Variant | Background | Text |
|---------|-----------|------|
| `success` | `success-50` | `success-700` |
| `warning` | `warning-50` | `warning-700` |
| `danger` | `error-50` | `error-700` |
| `info` | `info-50` | `info-700` |
| `neutral` | `neutral-100` | `neutral-700` |

---

## StatusBadge

Extended badge with optional dot indicator. Semantic variants match Badge.

---

## Component Inventory

### Layout
- `AppShell` — top-level app wrapper
- `PageLayout` — page-level layout with sidebar slot
- `PageShell` — inner page container
- `PageSection` — content section with optional heading
- `ListPageLayout` — layout for list/table pages
- `ListShell` — list content wrapper
- `AuthLayout` — auth page wrapper
- `Container` — max-width content wrapper
- `Grid` — CSS grid helper
- `Stack` — flex stack (vertical/horizontal)
- `Surface` — elevated card-like surface

### Navigation
- `Header` — top navigation bar
- `Sidebar` — left navigation rail
- `SidebarComponents` — sidebar sub-items
- `Breadcrumbs` — breadcrumb trail
- `Tabs` — tab navigation
- `Pagination` — page navigation
- `Link` — styled anchor

### Forms
- `Input` — text input
- `Textarea` — multiline input
- `Select` — dropdown select
- `Checkbox` — checkbox with label
- `Radio` — radio button
- `Toggle` — boolean toggle switch
- `FormField` — label + input + error wrapper
- `AuthField` — auth-specific field variant

### Feedback
- `Alert` — inline alert banner
- `Badge` — semantic status pill
- `StatusBadge` — badge with dot indicator
- `Toast` — transient notification
- `Spinner` — loading spinner
- `Progress` — progress bar
- `Skeleton` — loading skeleton
- `TableSkeleton` — table-specific skeleton
- `EmptyState` — zero-state display
- `ErrorBanner` — error message banner
- `AuthErrorBanner` — auth-specific error banner

### Data Display
- `Table` — data table
- `StatsCard` — metric card
- `StatsGrid` — grid of stats cards
- `Card` — generic content card
- `Avatar` — user avatar
- `AvatarGroup` — stacked avatars
- `ColorSwatch` — color preview
- `Typography` — text rendering
- `Divider` — horizontal rule

### Overlay
- `Dialog` — modal dialog
- `ModalHeader` — dialog header
- `Dropdown` — dropdown menu
- `Tooltip` — hover tooltip

### Page-level
- `Login` — login page
- `AuthPage` — auth page shell
- `AuthCard` — auth content card
- `AuthHeroPanel` — auth left panel
- `AuthSubmitButton` — auth form submit
- `PageHeader` — page title + actions
- `FilterBar` — search + filter row
- `Accordion` — collapsible section
- `UserDropdown` — user menu

---

## Tailwind Config Integration

Host app must extend Tailwind config with design system color tokens:

```js
// tailwind.config.js
module.exports = {
  content: ['./node_modules/@redtabhq/design-system/dist/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#fef2f2', /* ... */ 500: '#e63946', 600: '#c1121f', 700: '#991b1b' },
        neutral: { 0: '#ffffff', 50: '#fafafa', /* ... */ 950: '#0a0a0a' },
        success: { 50: '#f0fdf4', 500: '#22c55e', 700: '#15803d' },
        warning: { 50: '#fffbeb', 500: '#f59e0b', 700: '#b45309' },
        error:   { 50: '#fef2f2', 500: '#ef4444', 700: '#b91c1c' },
        info:    { 50: '#eff6ff', 500: '#3b82f6', 700: '#1d4ed8' },
      },
    },
  },
};
```

---

## Import

```tsx
// Components
import { Button, Badge, Input, Table, Dialog } from '@redtabhq/design-system';

// Tokens
import { colors, spacing, typography } from '@redtabhq/design-system/tokens';
```

---

## Utilities

- `cn(...classes)` — clsx + tailwind-merge; use for all className composition
- `PropsWithClassName<P>` — adds optional `className` to props type
- `PropsWithChildren<P>` — adds optional `children` to props type
- `PaginationMeta` — `{ page, pageSize, total, totalPages }`
