// src/features/admin/routes.tsx
import React from 'react';
import type { RouteObject } from 'react-router-dom';

const ScoringEngineConfigView = React.lazy(() => import('./views/ScoringEngineConfigView'));
const PolicyConfigView = React.lazy(() => import('./views/PolicyConfigView'));
const RegionalControlsView = React.lazy(() => import('./views/RegionalControlsView'));
const SettingsView = React.lazy(() => import('./views/SettingsView'));

export const adminRoutes: RouteObject[] = [
  { path: '/scoring-config', element: <ScoringEngineConfigView /> },
  { path: '/policy', element: <PolicyConfigView /> },
  { path: '/regional', element: <RegionalControlsView /> },
  { path: '/settings', element: <SettingsView /> },
];
