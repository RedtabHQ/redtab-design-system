# FEATURE-BASED REFACTOR PLAN

## Target Structure

```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   └── [OTHER UI - move to features]
├── features/
│   ├── contracts/           # Contract management
│   │   ├── components/
│   │   ├── views/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── suppliers/           # Supplier management
│   │   ├── components/
│   │   ├── views/
│   │   └── ...
│   ├── merchants/           # Merchant management
│   │   ├── components/
│   │   ├── views/
│   │   └── ...
│   ├── dashboard/           # Dashboard feature
│   ├── auth/                # Authentication
│   ├── payment/             # Payment processing
│   ├── settlement/          # Settlement
│   ├── credit/              # Credit management
│   ├── workbench/           # Decisioning Workbench
│   ├── admin/               # Admin features
│   ├── users/               # User management
│   ├── audit/               # Audit logs
│   ├── portfolio/           # Portfolio risk
│   └── communication/       # Communication
├── hooks/                   # Global hooks (not feature-specific)
├── services/                # Global services
├── stores/                  # Global Zustand stores
├── contexts/                # Global React contexts
├── types/                   # Global types
├── utils/                   # Global utilities
├── lib/                     # Library setup
├── pages/                   # Page routing (if needed)
└── docs/                    # Documentation (moved from scattered .md files)
```

## Features Identified

1. **contracts** - Contract management & display
2. **suppliers** - Supplier directory & management
3. **merchants** - Merchant onboarding & management
4. **dashboard** - Dashboard & analytics
5. **auth** - Login, password reset, authentication
6. **payment** - Payment orchestration
7. **settlement** - Settlement rails
8. **credit** - Credit management
9. **workbench** - Decisioning workbench
10. **admin** - Admin panel & settings
11. **users** - User management & permissions
12. **audit** - Audit logs
13. **portfolio** - Portfolio risk analysis
14. **communication** - Communication/messaging

## Components to Move

### Common/Reusable
- Header, Sidebar, Layout components
- UI components (Button, Card, Alert, Modal, etc.)
- Form components
- Stats components

### Feature-Specific
- Contracts: ContractTable, ContractFilters, etc.
- Suppliers: SupplierCard, SupplierDirectory, etc.
- Merchants: MerchantCard, MerchantSelector, etc.
- Dashboard: DashboardCard, Charts, etc.

## Steps
1. Create /features directory
2. Create each feature directory
3. Move components into /features/<feature>/components
4. Move views into /features/<feature>/views
5. Move feature-specific hooks/services
6. Update import statements
