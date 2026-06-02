# Store Migration Guide

## Overview

This guide explains the migration from the monolithic `useRPLStore` to domain-specific stores. The refactoring improves code organization, maintainability, and follows the Single Responsibility Principle.

## Why Split the Stores?

### Previous Architecture Issues

1. **Single Responsibility Violation**: The monolithic `useRPLStore` handled multiple unrelated concerns:
   - Market segment/region management
   - Notification system
   - Audit logging
   - Communication logs
   - Merchant data
   - Contract data
   - Supplier data

2. **Tight Coupling**: Changes to one domain affected all components using the store

3. **Poor Scalability**: Adding new features required modifying a large, complex store

4. **Testing Difficulty**: Hard to test individual domains in isolation

5. **Performance**: Components re-rendered unnecessarily when unrelated state changed

### New Architecture Benefits

1. **Domain Separation**: Each store manages a single business domain
2. **Better Type Safety**: Focused types per domain
3. **Easier Testing**: Mock individual stores independently
4. **Improved Performance**: Subscriptions only to relevant state changes
5. **Clearer Dependencies**: Component dependencies are explicit
6. **Easier Onboarding**: New developers understand domain boundaries

## Store Mapping

### From `useRPLStore` to Domain Stores

| Old Store (`useRPLStore`) | New Store | Domain |
|---------------------------|-----------|---------|
| `currentMarketSegmentId` | `useMarketSegmentStore` | Market/Region Management |
| `regions` / `marketSegments` | `useMarketSegmentStore` | Market/Region Management |
| `setCurrentRegion` / `setCurrentMarketSegment` | `useMarketSegmentStore` | Market/Region Management |
| `notifications` | `useLogStore` | Notifications & Logging |
| `markNotificationsRead` | `useLogStore` | Notifications & Logging |
| `addNotification` | `useLogStore` | Notifications & Logging |
| `auditLogs` | `useLogStore` | Audit Trail |
| `addAuditEntry` | `useLogStore` | Audit Trail |
| `communicationLogs` | `useLogStore` | Communication History |
| `logCommunication` | `useLogStore` | Communication History |

## Migration Examples

### 1. Market Segment Management

#### Before (Old Store)

```typescript
import { useRPLStore } from './store';

const MyComponent = () => {
  const {
    currentMarketSegmentId,
    regions,
    setCurrentRegion
  } = useRPLStore();

  const activeRegion = regions.find(r => r.id === currentMarketSegmentId);

  return (
    <div>
      <h2>{activeRegion?.name}</h2>
      <button onClick={() => setCurrentRegion('seg-np-001')}>
        Switch to Nepal
      </button>
    </div>
  );
};
```

#### After (New Store)

```typescript
import { useMarketSegmentStore } from './stores/marketSegmentStore';

const MyComponent = () => {
  const {
    currentMarketSegmentId,
    marketSegments,
    setCurrentMarketSegment
  } = useMarketSegmentStore();

  const activeSegment = marketSegments.find(r => r.id === currentMarketSegmentId);

  return (
    <div>
      <h2>{activeSegment?.name}</h2>
      <button onClick={() => setCurrentMarketSegment('seg-np-001')}>
        Switch to Nepal
      </button>
    </div>
  );
};
```

**Key Changes:**
- Import from `./stores/marketSegmentStore` instead of `./store`
- Use `useMarketSegmentStore()` instead of `useRPLStore()`
- Property `regions` renamed to `marketSegments` for clarity
- Method `setCurrentRegion` renamed to `setCurrentMarketSegment`
- Use `null` for global view instead of `'GLOBAL'` string

### 2. Notifications

#### Before (Old Store)

```typescript
import { useRPLStore } from './store';

const NotificationBell = () => {
  const { notifications, markNotificationsRead, addNotification } = useRPLStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleClick = () => {
    markNotificationsRead();
  };

  const sendAlert = () => {
    addNotification({
      title: 'New Alert',
      message: 'Something happened',
      type: 'INFO'
    });
  };

  return (
    <button onClick={handleClick}>
      Notifications ({unreadCount})
    </button>
  );
};
```

#### After (New Store)

```typescript
import { useLogStore } from './stores/logStore';

const NotificationBell = () => {
  const { notifications, markNotificationsRead, addNotification } = useLogStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleClick = () => {
    markNotificationsRead();
  };

  const sendAlert = () => {
    addNotification({
      title: 'New Alert',
      message: 'Something happened',
      type: 'INFO'
    });
  };

  return (
    <button onClick={handleClick}>
      Notifications ({unreadCount})
    </button>
  );
};
```

**Key Changes:**
- Import from `./stores/logStore` instead of `./store`
- Use `useLogStore()` instead of `useRPLStore()`
- API remains the same for notifications

### 3. Audit Logging

#### Before (Old Store)

```typescript
import { useRPLStore } from './store';

const ContractActions = () => {
  const { addAuditEntry } = useRPLStore();

  const approveContract = (contractId: string) => {
    // Business logic...

    addAuditEntry('CONTRACT', 'Contract Approved', { contractId });
  };

  return <button onClick={() => approveContract('C001')}>Approve</button>;
};
```

#### After (New Store)

```typescript
import { useLogStore } from './stores/logStore';

const ContractActions = () => {
  const { addAuditEntry } = useLogStore();

  const approveContract = (contractId: string) => {
    // Business logic...

    addAuditEntry('CONTRACT', 'Contract Approved', { contractId });
  };

  return <button onClick={() => approveContract('C001')}>Approve</button>;
};
```

**Key Changes:**
- Import from `./stores/logStore` instead of `./store`
- Use `useLogStore()` instead of `useRPLStore()`
- API remains the same for audit logging

### 4. Multiple Store Usage

#### Before (Old Store)

```typescript
import { useRPLStore } from './store';

const Dashboard = () => {
  const {
    currentMarketSegmentId,
    regions,
    notifications,
    addAuditEntry
  } = useRPLStore();

  const activeRegion = regions.find(r => r.id === currentMarketSegmentId);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <h1>{activeRegion?.name} Dashboard</h1>
      <NotificationBadge count={unreadCount} />
    </div>
  );
};
```

#### After (New Stores)

```typescript
import { useMarketSegmentStore } from './stores/marketSegmentStore';
import { useLogStore } from './stores/logStore';

const Dashboard = () => {
  const {
    currentMarketSegmentId,
    marketSegments
  } = useMarketSegmentStore();

  const {
    notifications,
    addAuditEntry
  } = useLogStore();

  const activeSegment = marketSegments.find(r => r.id === currentMarketSegmentId);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <h1>{activeSegment?.name} Dashboard</h1>
      <NotificationBadge count={unreadCount} />
    </div>
  );
};
```

**Key Changes:**
- Import multiple domain-specific stores
- Use each store's hook separately
- Each component only re-renders when its specific store updates

## Available Stores

### 1. Market Segment Store (`useMarketSegmentStore`)

**Location:** `./stores/marketSegmentStore.ts`

**Responsibilities:**
- Manage market segments (regions)
- Track current active segment
- Handle segment configuration

**State:**
```typescript
{
  marketSegments: MarketSegment[];
  currentMarketSegmentId: string | null;
}
```

**Actions:**
- `setCurrentMarketSegment(id: string | null)` - Switch to a market segment (null = global)
- `updateMarketSegment(segmentId, config)` - Update segment configuration
- `getMarketSegment(id)` - Get segment by ID
- `getCurrentMarketSegment()` - Get current active segment
- `getAllMarketSegments()` - Get all segments
- `getActiveMarketSegments()` - Get only active segments
- `getMarketSegmentByCurrency(currency)` - Find segment by currency
- `addMarketSegment(segment)` - Add new market segment

### 2. Log Store (`useLogStore`)

**Location:** `./stores/logStore.ts`

**Responsibilities:**
- Manage notifications
- Track audit logs
- Store communication history

**State:**
```typescript
{
  auditLogs: AuditLog[];
  notifications: RPLNotification[];
  communicationLogs: CommunicationLog[];
}
```

**Actions:**
- `addAuditEntry(category, action, metadata)` - Add audit log entry
- `addNotification(notification)` - Add new notification
- `markNotificationsRead()` - Mark all notifications as read
- `logCommunication(contractId, channel, message, tone)` - Log communication
- `getAuditLogs()` - Get all audit logs
- `getNotifications()` - Get all notifications
- `getCommunicationLogs()` - Get all communication logs
- `getAuditLogsByCategory(category)` - Filter audit logs by category
- `getUnreadNotifications()` - Get unread notifications
- `clearNotifications()` - Clear all notifications

## Creating a New Store

When you need to add a new domain-specific store, follow this pattern:

### 1. Create Store File

Create a new file in `/frontend/src/stores/` (e.g., `merchantStore.ts`):

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Merchant } from '../types';

// Define your state interface
interface MerchantState {
  merchants: Merchant[];
  currentMerchantId: string | null;
}

// Define your actions interface
interface MerchantActions {
  setCurrentMerchant: (id: string | null) => void;
  addMerchant: (merchant: Merchant) => void;
  updateMerchant: (id: string, updates: Partial<Merchant>) => void;
  getMerchant: (id: string) => Merchant | undefined;
}

// Combine state and actions
type MerchantStore = MerchantState & MerchantActions;

// Create the store
export const useMerchantStore = create<MerchantStore>()(
  persist(
    (set, get) => ({
      // Initial state
      merchants: [],
      currentMerchantId: null,

      // Actions
      setCurrentMerchant: (id) => {
        set({ currentMerchantId: id });
      },

      addMerchant: (merchant) => {
        set((state) => ({
          merchants: [...state.merchants, merchant]
        }));
      },

      updateMerchant: (id, updates) => {
        set((state) => ({
          merchants: state.merchants.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          )
        }));
      },

      getMerchant: (id) => {
        const state = get();
        return state.merchants.find((m) => m.id === id);
      },
    }),
    { name: 'merchant-storage' } // localStorage key
  )
);
```

### 2. Use the Store in Components

```typescript
import { useMerchantStore } from './stores/merchantStore';

const MerchantProfile = ({ merchantId }) => {
  const { merchants, updateMerchant } = useMerchantStore();
  const merchant = merchants.find(m => m.id === merchantId);

  return (
    <div>
      <h2>{merchant?.name}</h2>
      {/* Component content */}
    </div>
  );
};
```

## Best Practices

### 1. Store Organization

- **One Domain Per Store**: Each store should handle one business domain
- **Clear Naming**: Store names should reflect their domain (e.g., `useMarketSegmentStore`, `useLogStore`)
- **Consistent Structure**: Follow the State + Actions pattern

### 2. State Management

- **Immutable Updates**: Always return new objects/arrays, never mutate state
- **Derived State**: Use selectors or compute derived data in components
- **Minimal State**: Only store what you need, derive the rest

### 3. Actions

- **Descriptive Names**: Action names should clearly describe what they do
- **Single Purpose**: Each action should do one thing well
- **Type Safety**: Use TypeScript types for parameters and return values

### 4. Component Integration

- **Selective Subscription**: Only subscribe to the stores you need
- **Avoid Over-fetching**: Don't pull entire store if you only need one value
- **Memoization**: Use React.memo() for components that subscribe to stores

### 5. Performance Optimization

```typescript
// Bad: Re-renders on any store change
const { merchants, contracts, suppliers } = useMerchantStore();

// Good: Only re-renders when merchants change
const merchants = useMerchantStore((state) => state.merchants);
```

### 6. Testing

```typescript
// Mock individual stores in tests
jest.mock('./stores/marketSegmentStore', () => ({
  useMarketSegmentStore: () => ({
    currentMarketSegmentId: 'seg-np-001',
    marketSegments: [
      { id: 'seg-np-001', name: 'Nepal', currency: 'NPR' }
    ],
    setCurrentMarketSegment: jest.fn()
  })
}));
```

### 7. TypeScript Tips

- Always define separate interfaces for State and Actions
- Use `Partial<Type>` for update methods
- Export store types for use in other files
- Use strict typing for all parameters

### 8. Persistence

- Use `persist` middleware for data that should survive page reloads
- Choose meaningful storage keys (e.g., `'market-segment-storage'`)
- Be cautious about storing sensitive data in localStorage

## Common Pitfalls

### 1. Avoid Store Dependencies

```typescript
// Bad: Store depends on another store
export const useMerchantStore = create((set) => ({
  merchants: [],
  getCurrentMerchantSegment: () => {
    const { currentMarketSegmentId } = useMarketSegmentStore(); // Don't do this!
    // ...
  }
}));

// Good: Pass dependencies through components
const MyComponent = () => {
  const { currentMarketSegmentId } = useMarketSegmentStore();
  const { merchants } = useMerchantStore();

  const filteredMerchants = merchants.filter(
    m => m.segmentId === currentMarketSegmentId
  );

  return <MerchantList merchants={filteredMerchants} />;
};
```

### 2. Don't Overuse Stores

Not everything needs to be in a store. Use local component state for:
- UI-only state (modals, dropdowns, form inputs)
- Temporary state
- State that doesn't need to be shared

### 3. Avoid Circular Dependencies

Keep store imports one-directional. If two stores need to communicate, do it through components or create a higher-level orchestrator.

## Migration Checklist

- [ ] Identify all uses of `useRPLStore` in your component
- [ ] Map each property/method to its new store
- [ ] Import the appropriate domain stores
- [ ] Update variable names (e.g., `regions` → `marketSegments`)
- [ ] Update method calls (e.g., `setCurrentRegion` → `setCurrentMarketSegment`)
- [ ] Replace `'GLOBAL'` string with `null` for global view
- [ ] Test the component thoroughly
- [ ] Remove old store import

## Support

If you have questions about the migration:

1. Check this guide first
2. Review the store implementation files in `/stores/`
3. Look at migrated components for examples (e.g., `App_new.tsx`, `App_design_backup.tsx`)
4. Reach out to the team for clarification

## Summary

The store refactoring provides:
- Clear separation of concerns
- Better performance through targeted subscriptions
- Improved testability
- Easier maintenance and scaling
- Better developer experience

Follow the patterns in this guide, and your migration will be smooth and maintainable.
