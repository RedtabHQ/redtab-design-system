// src/features/merchants/routes.tsx
import React from 'react';
import type { RouteObject } from 'react-router-dom';

const MerchantListView = React.lazy(() => import('./views/MerchantListView'));
const MerchantDetailView = React.lazy(() => import('./views/MerchantDetailView'));
const OnboardingView = React.lazy(() => import('./views/MerchantOnboardingView'));
const MerchantPortal = React.lazy(() => import('./views/MerchantPortal'));

export const merchantRoutes: RouteObject[] = [
  { path: '/merchants', element: <MerchantListView /> },
  { path: '/merchants/:merchantId/:tab?', element: <MerchantDetailView /> },
  { path: '/onboarding', element: <OnboardingView /> },
  { path: '/portal', element: <MerchantPortal /> },
];
