// src/features/users/routes.tsx
import React from 'react';
import type { RouteObject } from 'react-router-dom';

const ProfileView = React.lazy(() => import('./views/ProfileView'));

export const userRoutes: RouteObject[] = [
  { path: '/profile', element: <ProfileView /> },
];
