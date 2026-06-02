// src/routes/index.tsx
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoutes } from './ProtectedRoutes';
import { LoadingView } from './LoadingView';

const LoginView = React.lazy(() => import('@/features/auth/views/LoginView'));
const ForgotPasswordView = React.lazy(() => import('@/features/auth/views/ForgotPasswordView'));
const ResetPasswordView = React.lazy(() => import('@/features/auth/views/ResetPasswordView'));
const PaymentConfirmation = React.lazy(() => import('@/features/payment/components/PaymentConfirmation'));

export const AppRoutes = () => (
  <Suspense fallback={<LoadingView />}>
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/forgot-password" element={<ForgotPasswordView />} />
      <Route path="/reset-password" element={<ResetPasswordView />} />
      <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  </Suspense>
);
