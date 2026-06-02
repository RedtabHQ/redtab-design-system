// src/features/developer/routes.tsx
import React from 'react';
import type { RouteObject } from 'react-router-dom';

const DeveloperPortal = React.lazy(() => import('./views/DeveloperPortal'));
const ApiKeysPage = React.lazy(() => import('./views/ApiKeysPage'));
const WebhookConfigsPage = React.lazy(() => import('./views/WebhookConfigsPage'));
const WebhookLogsPage = React.lazy(() => import('./views/WebhookLogsPage'));

export const developerRoutes: RouteObject[] = [
  {
    path: '/developer/*',
    element: <DeveloperPortal />,
    children: [
      { path: 'api-keys', element: <ApiKeysPage /> },
      { path: 'webhooks', element: <WebhookConfigsPage /> },
      { path: 'webhook-logs', element: <WebhookLogsPage /> },
    ],
  },
];
