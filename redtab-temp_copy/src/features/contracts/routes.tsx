// src/features/contracts/routes.tsx
import React from 'react';
import type { RouteObject } from 'react-router-dom';

const ContractListView = React.lazy(() => import('./views/ContractListView'));
const ContractDetailView = React.lazy(() => import('./views/ContractDetailView'));

export const contractRoutes: RouteObject[] = [
  { path: '/contracts', element: <ContractListView /> },
  { path: '/contracts/:contractId', element: <ContractDetailView /> },
];
