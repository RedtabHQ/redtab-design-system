// src/features/dashboard/routes.tsx
import React from 'react';
import type { RouteObject } from 'react-router-dom';

const DashboardView = React.lazy(() => import('./views/DashboardView'));

export const dashboardRoutes: RouteObject[] = [
  { path: '/', element: <DashboardView /> },
];
