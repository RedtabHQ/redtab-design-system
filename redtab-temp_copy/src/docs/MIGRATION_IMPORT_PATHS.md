# Import Path Migration Guide

## ⚠️ Important: Update All Imports!

The refactoring moved files into feature folders. You need to update import statements throughout the codebase.

## 🔄 Migration Steps

### 1. App.tsx - Update View Imports

**BEFORE:**
```typescript
const LoginView = React.lazy(() => import('./views/LoginView'));
const MerchantListView = React.lazy(() => import('./views/MerchantListView'));
const ContractListView = React.lazy(() => import('./views/ContractListView'));
```

**AFTER:**
```typescript
const LoginView = React.lazy(() => import('./features/auth/views/LoginView'));
const MerchantListView = React.lazy(() => import('./features/merchants/views/MerchantListView'));
const ContractListView = React.lazy(() => import('./features/contracts/views/ContractListView'));
```

Or use feature index files:
```typescript
const { LoginView } = React.lazy(() => import('./features/auth'));
```

### 2. Components Import

**BEFORE (Old Path):**
```typescript
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ContractTable } from './components/contracts/ContractTable';
import { MerchantCard } from './components/MerchantCard';
```

**AFTER (New Path):**
```typescript
import { Header, Sidebar } from './components/common';
import { ContractTable } from './features/contracts/components';
import { MerchantCard } from './features/merchants/components';
```

### 3. Hooks Import

**BEFORE:**
```typescript
import { useAuth } from './hooks/useAuth';
import { useContracts } from './hooks/useContracts';
import { useMerchants } from './hooks/useMerchants';
```

**AFTER:**
```typescript
import { useAuth } from './features/auth/hooks';
import { useContracts } from './features/contracts/hooks';
import { useMerchants } from './features/merchants/hooks';
```

Or import entire feature:
```typescript
import { useContracts } from './features/contracts';
```

### 4. Services Import

**BEFORE:**
```typescript
import { contractsApi } from './services/contractsApi';
import { merchantApi } from './services/merchantApi';
```

**AFTER:**
```typescript
import { contractsApi } from './features/contracts/services';
import { merchantApi } from './features/merchants/services';
```

### 5. Global Components (Common)

These stay in `/components/common/`:
```typescript
import { Button } from './components/common';
import { Card, Modal, Alert } from './components/common';
import { PageHeader } from './components/common';
```

### 6. Global Hooks (if any)

These stay in `/hooks/`:
```typescript
import { useMarketSegments } from './hooks';
```

### 7. Global Services (if any)

These stay in `/services/`:
```typescript
import { geminiService } from './services';
```

## 📋 Complete Import Mapping

### Components
```
./components/Header               → ./components/common/Header
./components/Sidebar              → ./components/common/Sidebar
./components/Button               → ./components/common/Button
./components/ui/*                 → ./components/common/*
./components/form/*               → ./components/common/*
./components/modals/*             → ./components/common/*

./components/contracts/*          → ./features/contracts/components/*
./components/supplier/*           → ./features/suppliers/components/*
./components/DecisioningWorkbench → ./features/contracts/components/DecisioningWorkbench
```

### Views
```
./views/LoginView                 → ./features/auth/views/LoginView
./views/MerchantListView          → ./features/merchants/views/MerchantListView
./views/ContractListView          → ./features/contracts/views/ContractListView
./views/SupplierDirectoryView     → ./features/suppliers/views/SupplierDirectoryView
./views/DashboardView             → ./features/dashboard/views/DashboardView
./views/PaymentOrchestrationView  → ./features/payment/views/PaymentOrchestrationView
```

### Hooks
```
./hooks/useAuth                   → ./features/auth/hooks/useAuth
./hooks/useMerchants              → ./features/merchants/hooks/useMerchants
./hooks/useContracts              → ./features/contracts/hooks/useContracts
./hooks/useSuppliers              → ./features/suppliers/hooks/useSuppliers
./hooks/useMarketSegments         → ./hooks/useMarketSegments (stays global)
```

### Services
```
./services/authApi                → ./features/auth/services/authApi
./services/merchantApi            → ./features/merchants/services/merchantApi
./services/contractsApi           → ./features/contracts/services/contractsApi
./services/geminiService          → ./services/geminiService (stays global)
```

## 🛠️ Automated Migration (Using Find & Replace)

You can use your IDE's Find & Replace to help:

1. **In VS Code:**
   - Open Find and Replace: `Ctrl+H` (or `Cmd+H`)
   - Find: `import \{ ([^}]+) \} from ['"]\.\/components\/([^/'"])`
   - Replace with your new path (feature-specific)

2. **Search patterns:**
   ```
   From: './views/'              To: './features/[feature]/views/'
   From: './hooks/'              To: './features/[feature]/hooks/'
   From: './services/'           To: './features/[feature]/services/'
   From: './components/'         To: './features/[feature]/components/' OR './components/common/'
   ```

## ✅ Checklist

After updating imports:
- [ ] App.tsx updated with correct view imports
- [ ] All component imports updated
- [ ] All hook imports updated
- [ ] All service imports updated
- [ ] Context imports still point to ./contexts/
- [ ] Utility imports still point to ./utils/
- [ ] Store imports still point to ./stores/
- [ ] No import errors in console
- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] No circular dependency warnings

## 🔍 Finding Missing Imports

After migration, you'll likely see import errors. To find them:

1. **Build the project:**
   ```bash
   npm run build
   ```
   Look for any import resolution errors

2. **Check console:**
   ```bash
   npm run dev
   ```
   Open browser console for runtime errors

3. **Search for old patterns:**
   - Search for `from './components/contracts'` → should be `from './features/contracts'`
   - Search for `from './views/'` → should be `from './features/[feature]/views/'`
   - Search for `from './hooks/use'` → should be `from './features/[feature]/hooks/'` or `from './hooks/'`

## 📝 Example: Complete File Update

### Before (Old):
```typescript
import React from 'react';
import { ContractTable } from './components/contracts/ContractTable';
import { useContracts } from './hooks/useContracts';
import { contractsApi } from './services/contractsApi';
import { Button } from './components/ui/Button';
import { PageHeader } from './components/PageHeader';

export const ContractPage = () => {
  const { contracts } = useContracts();
  
  return (
    <div>
      <PageHeader title="Contracts" />
      <ContractTable data={contracts} />
    </div>
  );
};
```

### After (New):
```typescript
import React from 'react';
import { ContractTable } from './features/contracts/components';
import { useContracts } from './features/contracts/hooks';
import { contractsApi } from './features/contracts/services';
import { Button, PageHeader } from './components/common';

export const ContractPage = () => {
  const { contracts } = useContracts();
  
  return (
    <div>
      <PageHeader title="Contracts" />
      <ContractTable data={contracts} />
    </div>
  );
};
```

Or using feature index:
```typescript
import { ContractTable, useContracts, contractsApi } from './features/contracts';
import { PageHeader } from './components/common';
```

## 🎯 Priority Files to Update First

1. **App.tsx** - Main routing file (most critical)
2. **Layout components** - Sidebar, Header
3. **View files** - They import components
4. **Component files** - They import hooks/services
5. **Test files** - Update their imports

---

**Status:** Refactoring complete, import migration in progress
**Estimated time:** Depends on codebase size, can be automated with Find & Replace
