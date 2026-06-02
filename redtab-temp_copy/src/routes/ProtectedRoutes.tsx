// src/routes/ProtectedRoutes.tsx
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { dashboardRoutes } from '@/features/dashboard/routes';
import { merchantRoutes } from '@/features/merchants/routes';
import { supplierRoutes } from '@/features/suppliers/routes';
import { contractRoutes } from '@/features/contracts/routes';
import { paymentRoutes } from '@/features/payment/routes';
import { workbenchRoutes } from '@/features/workbench/routes';
import { auditRoutes } from '@/features/audit/routes';
import { adminRoutes } from '@/features/admin/routes';
import { developerRoutes } from '@/features/developer/routes';
import { portfolioRoutes } from '@/features/portfolio/routes';
import { userRoutes } from '@/features/users/routes';
import { AppShell } from './AppShell';
import { LoadingView } from './LoadingView';
import { NotFoundView } from './NotFoundView';
import { ProtectedRoute } from './ProtectedRoute';

const protectedRouteTree: RouteObject[] = [
  ...dashboardRoutes,
  ...merchantRoutes,
  ...supplierRoutes,
  ...contractRoutes,
  ...paymentRoutes,
  ...workbenchRoutes,
  ...auditRoutes,
  ...adminRoutes,
  ...developerRoutes,
  ...portfolioRoutes,
  ...userRoutes,
  { path: '*', element: <NotFoundView /> },
];

export const ProtectedRoutes = () => {
  const routeElement = useRoutes(protectedRouteTree);
  return (
    <ProtectedRoute>
      <AppShell>
        <Suspense fallback={<LoadingView />}>
          {routeElement}
        </Suspense>
      </AppShell>
    </ProtectedRoute>
  );
};
