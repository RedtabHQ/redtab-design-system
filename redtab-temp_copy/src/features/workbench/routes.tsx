// src/features/workbench/routes.tsx
import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const DecisioningWorkbenchView = React.lazy(() => import('./views/DecisioningWorkbenchView'));
const DetailWorkbenchLayout = React.lazy(() => import('./views/DetailWorkbenchLayout'));
const EntityProfilePage = React.lazy(() => import('./views/EntityProfilePage'));
const TrustSignalsPage = React.lazy(() => import('./views/TrustSignalsPage'));
const SupplyHealthPage = React.lazy(() => import('./views/SupplyHealthPage'));
const PolicyVaultPage = React.lazy(() => import('./views/PolicyVaultPage'));

export const workbenchRoutes: RouteObject[] = [
  { path: '/decisioning-workbench', element: <DecisioningWorkbenchView /> },
  {
    path: '/decisioning-workbench/:merchantId/*',
    element: <DetailWorkbenchLayout />,
    children: [
      { index: true, element: <Navigate to="entity-profile" replace /> },
      { path: 'entity-profile', element: <EntityProfilePage /> },
      { path: 'trust-signals', element: <TrustSignalsPage /> },
      { path: 'supply-health', element: <SupplyHealthPage /> },
      { path: 'policy-vault', element: <PolicyVaultPage /> },
    ],
  },
];
