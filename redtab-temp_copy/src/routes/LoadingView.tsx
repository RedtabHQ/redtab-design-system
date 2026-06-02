// src/routes/LoadingView.tsx
import { Spinner } from '@/components/common';

export const LoadingView = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size="lg" variant="primary" label="Loading component..." />
  </div>
);
