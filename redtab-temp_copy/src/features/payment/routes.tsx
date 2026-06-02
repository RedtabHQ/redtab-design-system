// src/features/payment/routes.tsx
import React from 'react';
import type { RouteObject } from 'react-router-dom';

const PaymentOrchestrationView = React.lazy(() => import('./views/PaymentOrchestrationView'));
const TransactionListView = React.lazy(() => import('./views/TransactionListView'));

export const paymentRoutes: RouteObject[] = [
  { path: '/payments', element: <PaymentOrchestrationView /> },
  { path: '/transactions', element: <TransactionListView /> },
];
