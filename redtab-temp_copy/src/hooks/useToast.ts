import { useState, useCallback } from 'react';

export type ToastType = 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  timestamp: string;
}

const DEFAULT_DURATION = 5000; // 5 seconds

/**
 * Custom hook for displaying temporary toast notifications
 * Used for UI-level feedback (form validation, user actions, etc.)
 * NOT for persistent backend notifications - use useNotifications for that
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((notification: Omit<Toast, 'id' | 'timestamp'>, duration = DEFAULT_DURATION) => {
    const id = `${Date.now()}-${Math.random()}`;
    const toast: Toast = {
      ...notification,
      id,
      timestamp: new Date().toISOString(),
    };

    setToasts(prev => [toast, ...prev]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    show,
    dismiss,
    dismissAll,
  };
};
