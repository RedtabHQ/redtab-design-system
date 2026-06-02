// src/features/suppliers/routes.tsx
import React from 'react';
import type { RouteObject } from 'react-router-dom';

const SupplierDirectoryView = React.lazy(() => import('./views/SupplierDirectoryView'));
const SupplierDetailView = React.lazy(() => import('./views/SupplierDetailView'));
const SupplierOnboardingView = React.lazy(() => import('./views/SupplierOnboardingView'));

export const supplierRoutes: RouteObject[] = [
  { path: '/suppliers', element: <SupplierDirectoryView /> },
  { path: '/suppliers/onboarding', element: <SupplierOnboardingView /> },
  { path: '/suppliers/:supplierId/:tab?', element: <SupplierDetailView /> },
];
