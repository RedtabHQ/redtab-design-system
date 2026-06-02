# Loading States Standardization Guide

**Date**: 2026-01-06
**Status**: ✅ STANDARDIZED

## Overview

This guide documents the standardized loading state components and animations across the RPL frontend application. All loading states should use these components for consistency.

---

## 🎨 Loading Components

### 1. Spinner Components

#### Basic Spinner (Lucide Icon)
```tsx
import { Spinner } from '@/components/common';

// Default spinner
<Spinner />

// With size and variant
<Spinner size="lg" variant="primary" />
<Spinner size="sm" variant="secondary" />

// With label
<Spinner size="md" variant="primary" label="Loading data..." />
```

**Sizes**: `sm` | `md` | `lg` | `xl`
**Variants**: `primary` (redtab) | `secondary` (gray) | `white`

#### Inline Spinner (CSS Border)
```tsx
import { InlineSpinner } from '@/components/common';

// For buttons and inline use
<InlineSpinner size="sm" variant="white" />
```

---

### 2. Loading State Components

#### Page/Section Loading
```tsx
import { LoadingState } from '@/components/common';

// Full section
<LoadingState message="Loading merchants..." size="md" />

// Fullscreen
<LoadingState message="Initializing..." size="fullscreen" />

// Small section
<LoadingState message="Loading..." size="sm" />
```

**Sizes**: `sm` (h-32) | `md` (h-64) | `lg` (h-96) | `fullscreen`

#### Card Loading
```tsx
import { CardLoadingState } from '@/components/common';

<CardLoadingState
  message="Loading details..."
  minHeight="400px"
/>
```

#### Overlay Loading
```tsx
import { OverlayLoadingState } from '@/components/common';

<OverlayLoadingState
  message="Processing..."
  isVisible={isSubmitting}
/>
```

#### Button Loading
```tsx
import { ButtonLoadingState } from '@/components/common';

<button disabled={isLoading}>
  <ButtonLoadingState
    isLoading={isLoading}
    defaultText="Submit"
    loadingText="Submitting..."
  />
</button>
```

---

### 3. Skeleton Loaders

#### Base Skeleton
```tsx
import { Skeleton } from '@/components/common';

// Text skeleton
<Skeleton variant="text" width="100%" height="16px" />

// Rectangular skeleton
<Skeleton variant="rectangular" width="200px" height="100px" />

// Circular skeleton (avatar)
<Skeleton variant="circular" width={40} height={40} />

// With wave animation
<Skeleton animation="wave" className="h-4 w-full" />
```

**Variants**: `text` | `rectangular` | `circular`
**Animations**: `pulse` (default) | `wave` | `none`

#### Table Skeleton
```tsx
import { TableSkeleton } from '@/components/common';

// Default table skeleton
<TableSkeleton rows={5} columns={4} />

// Without header
<TableSkeleton rows={10} columns={6} showHeader={false} />
```

#### Card Skeleton
```tsx
import { CardSkeleton } from '@/components/common';

// Simple card
<CardSkeleton lines={3} />

// With avatar
<CardSkeleton lines={4} showAvatar={true} />

// With actions
<CardSkeleton lines={3} showActions={true} />
```

#### List Skeleton
```tsx
import { ListSkeleton } from '@/components/common';

// Simple list
<ListSkeleton items={5} />

// With images
<ListSkeleton items={8} showImage={true} />
```

#### Form Skeleton
```tsx
import { FormSkeleton } from '@/components/common';

// Standard form
<FormSkeleton fields={4} />

// Without buttons
<FormSkeleton fields={6} showButtons={false} />
```

#### Stat/KPI Skeleton
```tsx
import { StatSkeleton } from '@/components/common';

// 3 stat boxes
<StatSkeleton count={3} />

// 4 stat boxes
<StatSkeleton count={4} />
```

---

## 📋 Usage Patterns

### Table Loading

```tsx
import { Table, TableSkeleton } from '@/components/common';

function MyTable({ data, loading }) {
  if (loading) {
    return <TableSkeleton rows={5} columns={4} />;
  }

  return <Table columns={columns} data={data} />;
}
```

### Page Loading

```tsx
import { LoadingState } from '@/components/common';

function MyPage() {
  const { data, isLoading } = useQuery('myData');

  if (isLoading) {
    return <LoadingState message="Loading page..." size="md" />;
  }

  return <div>{/* Page content */}</div>;
}
```

### Card/Component Loading

```tsx
import { CardSkeleton } from '@/components/common';

function MyCard({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <CardSkeleton lines={4} showAvatar={true} />
      </div>
    );
  }

  return <div>{/* Card content */}</div>;
}
```

### Form Submission Loading

```tsx
import { ButtonLoadingState } from '@/components/common';

function MyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
      >
        <ButtonLoadingState
          isLoading={isSubmitting}
          defaultText="Save Changes"
          loadingText="Saving..."
        />
      </button>
    </form>
  );
}
```

### Overlay Loading (Modal/Full Screen)

```tsx
import { OverlayLoadingState } from '@/components/common';

function MyComponent() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async () => {
    setIsProcessing(true);
    await someAsyncOperation();
    setIsProcessing(false);
  };

  return (
    <>
      <button onClick={handleAction}>Process</button>
      <OverlayLoadingState
        message="Processing your request..."
        isVisible={isProcessing}
      />
    </>
  );
}
```

---

## 🎯 Standard Practices

### DO ✅

1. **Use appropriate loading component for context**
   - Tables → `TableSkeleton`
   - Cards → `CardSkeleton`
   - Lists → `ListSkeleton`
   - Pages → `LoadingState`
   - Buttons → `ButtonLoadingState`

2. **Provide meaningful loading messages**
   ```tsx
   <LoadingState message="Loading merchants..." />
   <CardLoadingState message="Fetching transaction details..." />
   ```

3. **Match skeleton structure to actual content**
   ```tsx
   // If your card shows avatar + 3 lines + 2 buttons
   <CardSkeleton lines={3} showAvatar={true} showActions={true} />
   ```

4. **Use consistent animations**
   - Default: `pulse` (Tailwind's animate-pulse)
   - Alternative: `wave` (shimmer effect)

### DON'T ❌

1. **Don't create custom loading spinners**
   ```tsx
   // ❌ Don't do this
   <div className="animate-spin border-4 ..."></div>

   // ✅ Use this instead
   <Spinner size="md" variant="primary" />
   ```

2. **Don't use inconsistent loading messages**
   ```tsx
   // ❌ Inconsistent
   <LoadingState message="Please wait..." />
   <LoadingState message="Hold on..." />

   // ✅ Consistent and descriptive
   <LoadingState message="Loading data..." />
   <LoadingState message="Processing request..." />
   ```

3. **Don't skip loading states**
   ```tsx
   // ❌ No loading state
   return data ? <Content data={data} /> : null;

   // ✅ Show loading state
   if (isLoading) return <LoadingState />;
   return <Content data={data} />;
   ```

4. **Don't use multiple loading patterns in same context**
   ```tsx
   // ❌ Mixed patterns
   {loading && <Spinner />}
   {loading && <div className="animate-pulse">...</div>}

   // ✅ Consistent pattern
   {loading && <LoadingState />}
   ```

---

## 🎨 Animation Specifications

### Pulse Animation (Default)
- **Duration**: Tailwind default (~2s)
- **Easing**: cubic-bezier
- **Use case**: Most loading states

### Wave/Shimmer Animation
- **Duration**: 2s
- **Easing**: ease-in-out
- **Use case**: Premium feel, skeleton loaders
- **Configuration**: Added to `tailwind.config.js`

```js
// tailwind.config.js
keyframes: {
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
},
animation: {
  shimmer: 'shimmer 2s ease-in-out infinite',
},
```

---

## 🔄 Migration Guide

### Replacing Custom Loading States

#### Before (Custom Implementation)
```tsx
// ❌ Old way
{loading && (
  <div className="flex justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-redtab"></div>
  </div>
)}
```

#### After (Standardized)
```tsx
// ✅ New way
import { LoadingState } from '@/components/common';

{loading && <LoadingState message="Loading data..." size="sm" />}
```

### Replacing Custom Skeletons

#### Before (Custom Implementation)
```tsx
// ❌ Old way
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

#### After (Standardized)
```tsx
// ✅ New way
import { CardSkeleton } from '@/components/common';

<CardSkeleton lines={2} />
```

---

## 📦 Component Summary

| Component | Use Case | Import Path |
|-----------|----------|-------------|
| `Spinner` | General purpose spinner | `@/components/common` |
| `InlineSpinner` | Button/inline spinner | `@/components/common` |
| `LoadingState` | Page/section loading | `@/components/common` |
| `CardLoadingState` | Card loading | `@/components/common` |
| `OverlayLoadingState` | Modal/overlay loading | `@/components/common` |
| `ButtonLoadingState` | Button text loading | `@/components/common` |
| `Skeleton` | Base skeleton | `@/components/common` |
| `TableSkeleton` | Table loading | `@/components/common` |
| `CardSkeleton` | Card content loading | `@/components/common` |
| `ListSkeleton` | List loading | `@/components/common` |
| `FormSkeleton` | Form loading | `@/components/common` |
| `StatSkeleton` | KPI/stat boxes loading | `@/components/common` |

---

## ✅ Checklist for New Components

When creating a new component that loads data:

- [ ] Does it show a loading state?
- [ ] Is the loading state from standardized components?
- [ ] Does the loading message describe what's loading?
- [ ] Does the skeleton match the actual content structure?
- [ ] Is the loading state accessible (aria-live, aria-busy)?
- [ ] Does it handle error states?

---

**Updated by**: Claude Code Agent
**Status**: ✅ Production Ready
**Version**: 1.0.0
