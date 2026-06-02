// src/features/portfolio/routes.tsx
import React from 'react';
import type { RouteObject } from 'react-router-dom';

const PortfolioRiskView = React.lazy(() => import('./views/PortfolioRiskView'));

export const portfolioRoutes: RouteObject[] = [
  { path: '/portfolio', element: <PortfolioRiskView /> },
];
