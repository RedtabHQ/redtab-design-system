// src/features/audit/routes.tsx
import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const AuditLogsView = React.lazy(() => import('./views/AuditLogsView'));
const AuditContractsView = React.lazy(() => import('./views/AuditContractsView'));

export const auditRoutes: RouteObject[] = [
  { path: '/audit', element: <Navigate to="/audit/logs" replace /> },
  { path: '/audit/logs', element: <AuditLogsView /> },
  { path: '/audit/contracts', element: <AuditContractsView /> },
];
