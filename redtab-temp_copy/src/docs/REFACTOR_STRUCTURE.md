# Frontend Structure Refactor - Complete Guide

## 📂 New Structure Overview

After refactoring, the frontend has been reorganized into a **feature-based structure** for better maintainability and scalability.

```
frontend/src/
├── components/                    # Global/reusable components
│   ├── common/                    # Common UI components (Header, Sidebar, UI library)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Form components
│   │   └── index.ts
│   └── (components folder no longer contains feature-specific)
│
├── features/                      # Feature modules (main structure)
│   ├── auth/                      # Authentication & onboarding
│   │   ├── components/            # Auth-specific components
│   │   ├── views/                 # LoginView, ForgotPasswordView, etc.
│   │   ├── hooks/                 # useAuth, useAuthMutations
│   │   ├── services/              # authApi
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── merchants/                 # Merchant management
│   │   ├── components/
│   │   ├── views/                 # MerchantListView, MerchantDetailView
│   │   ├── hooks/                 # useMerchants, useMerchantActions
│   │   ├── services/              # merchantApi
│   │   └── index.ts
│   │
│   ├── suppliers/                 # Supplier management
│   │   ├── components/
│   │   ├── views/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   │
│   ├── contracts/                 # Contract management
│   │   ├── components/            # ContractTable, ContractFilters
│   │   ├── views/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   │
│   ├── dashboard/                 # Dashboard & analytics
│   ├── payment/                   # Payment processing
│   ├── settlement/                # Settlement operations
│   ├── credit/                    # Credit management
│   ├── workbench/                 # Decisioning workbench
│   ├── admin/                     # Admin features & settings
│   ├── users/                     # User management
│   ├── audit/                     # Audit logs
│   ├── portfolio/                 # Portfolio risk analysis
│   └── communication/             # Messaging & communication
│
├── hooks/                         # Global custom hooks (not feature-specific)
│   ├── useMarketSegments.ts       # Used across multiple features
│   └── (feature-specific hooks moved to features/)
│
├── services/                      # Global services
│   ├── geminiService.ts           # Global services
│   └── (feature-specific services moved to features/)
│
├── stores/                        # Global Zustand state
│   ├── authStore.ts
│   ├── merchantStore.ts
│   └── ...
│
├── contexts/                      # Global React contexts
│   ├── MarketSegmentContext.tsx
│   ├── FormContext.tsx            # (merged from context/)
│   └── index.ts
│
├── types/                         # Global type definitions
│   ├── api.ts
│   ├── merchant.ts
│   └── ...
│
├── utils/                         # Global utilities
│   ├── dateFormatter.ts
│   ├── validators.ts
│   └── ...
│
├── lib/                           # Library setup
│   ├── queryClient.ts
│   └── ...
│
├── docs/                          # ✨ NEW: Centralized documentation
│   ├── REFACTOR_STRUCTURE.md     # This file
│   ├── MIGRATION_GUIDE.md        # How to migrate imports
│   ├── TESTING_GUIDE.md
│   ├── README.md
│   └── ... (all .md files)
│
├── App.tsx
├── main.tsx
├── index.css
└── constants.ts
```

## ✨ Key Improvements

### 1. **Better Organization**
- Each feature has its own folder with components, views, hooks, services
- Related code is grouped together for easier navigation
- Clear separation of concerns

### 2. **Reduced Clutter**
- ✅ Removed: `App_design_backup.tsx`, `App_new.tsx`, `store_ts` (backup files)
- ✅ Merged: `context/` → `contexts/` (consolidated)
- ✅ Merged: `contract/` → `contracts/detail/` (better organization)
- ✅ Centralized: All `.md` files → `/docs` folder

### 3. **Easier Debugging**
- Find all contract-related code in `/features/contracts/`
- Find all merchant-related code in `/features/merchants/`
- No more scrolling through 66 components in one folder

### 4. **Scalability**
- Easy to add new features: Create `/features/newFeature/` and follow the pattern
- Each feature can be independently tested and deployed
- Clear entry points via `index.ts` files

## 🔄 Migration Guide for Imports

### Before (Old Structure)
```typescript
import { ContractTable } from '@/components/contracts/ContractTable';
import { MerchantCard } from '@/components/MerchantCard';
import { useContracts } from '@/hooks/useContracts';
import { contractsApi } from '@/services/contractsApi';
```

### After (New Structure)
```typescript
import { ContractTable } from '@/features/contracts/components';
import { MerchantCard } from '@/features/merchants/components';
import { useContracts } from '@/features/contracts/hooks';
import { contractsApi } from '@/features/contracts/services';

// Or import entire feature
import { ContractTable, useContracts, contractsApi } from '@/features/contracts';
```

## 📦 Feature Index Files

Each feature has an `index.ts` that exports all public APIs:

```typescript
// features/contracts/index.ts
export * from './components';
export * from './views';
export * from './hooks';
export * from './services';
export * from './types';
```

This allows clean imports:
```typescript
import { ContractTable, useContracts } from '@/features/contracts';
```

## 🔧 Common Patterns

### Adding a New Component to a Feature
```
features/merchants/
└── components/
    ├── MerchantCard.tsx
    ├── MerchantSelector.tsx
    ├── NewComponent.tsx          ← Add here
    └── index.ts                  ← Update: export * from './NewComponent'
```

### Adding a New Hook to a Feature
```
features/merchants/
└── hooks/
    ├── useMerchants.ts
    ├── useMerchantActions.ts
    ├── useNewHook.ts             ← Add here
    └── index.ts                  ← Update export
```

### Adding a New Feature
```
1. Create: features/newFeature/
2. Create: features/newFeature/components/
3. Create: features/newFeature/views/
4. Create: features/newFeature/hooks/
5. Create: features/newFeature/services/
6. Create: features/newFeature/index.ts
7. Follow the same pattern as existing features
```

## ⚠️ Important Notes

1. **Global vs Feature-Specific Code**
   - Keep in `/hooks`: Hooks used by multiple features
   - Move to `/features/*/hooks`: Feature-specific hooks
   - Same applies to services, types, etc.

2. **Common Components**
   - Keep reusable UI components in `/components/common/`
   - Examples: Button, Card, Modal, Form inputs, etc.
   - Feature-specific components go in `/features/*/components/`

3. **Circular Dependencies**
   - Features can import from `/components/common/`
   - Features should NOT import from other features (if possible)
   - Use global stores/contexts for cross-feature communication

4. **Import Paths**
   - Use path aliases: `@/features/...` (check `tsconfig.json`)
   - Avoid relative imports like `../../../`
   - Use index.ts files for clean exports

## 🧪 Testing Structure

Test files are co-located with source:
```
features/merchants/
├── hooks/
│   ├── useMerchants.ts
│   ├── useMerchants.test.ts      ← Test next to source
│   └── index.ts
└── services/
    ├── merchantApi.ts
    ├── merchantApi.test.ts        ← Test next to source
    └── index.ts
```

## 📝 Documentation Structure

All documentation is in `/docs/`:
```
docs/
├── REFACTOR_STRUCTURE.md          ← Architecture overview (this file)
├── MIGRATION_GUIDE.md             ← How to update imports
├── TESTING_GUIDE.md               ← Testing patterns
├── README.md                      ← Project overview
└── ...other documentation
```

## ✅ Refactoring Checklist

After refactoring, verify:
- [ ] All features have `index.ts` files
- [ ] Import paths are updated (./src/features/...)
- [ ] No circular dependencies
- [ ] Test files are co-located
- [ ] Documentation is in `/docs/`
- [ ] Build and tests pass
- [ ] No unused folders in `/components/` (except `common/`)

## 🚀 Next Steps

1. **Update Import Paths** - Check and update all imports throughout the codebase
2. **Build & Test** - Run `npm run build` and `npm test` to ensure everything works
3. **Update Path Aliases** - Verify `tsconfig.json` aliases work correctly
4. **Update Dependencies** - Check for any circular dependencies
5. **Document Custom Patterns** - Add team-specific patterns to this guide

---

**Created:** Dec 23, 2024
**Structure:** Feature-based with collocated hooks/services
**Benefits:** Better organization, easier debugging, improved scalability
