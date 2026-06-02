import React, { createContext, useContext, ReactNode } from 'react';
import { useToast, type Toast } from '@/hooks/useToast';
import { X } from 'lucide-react';
import { getNotificationTheme, getNotificationIcon } from '@/utils/notificationTheme';

/**
 * Toast Context for global access to toast functionality
 * Allows any component to show toasts without passing through props
 */
const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * ToastProvider - Wraps app and provides global toast context
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </ToastContext.Provider>
  );
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

/**
 * ToastItem - Individual toast notification UI
 */
const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const theme = getNotificationTheme(toast.type);

  return (
    <div
      className={`
        ${theme.bgColor} ${theme.borderColor}
        border rounded-lg shadow-lg p-4 flex gap-3 items-start
        animate-in slide-in-from-top-4 fade-in duration-300
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(toast.type, 20)}</div>
      <div className="flex-1 min-w-0">
        <h3 className={`${theme.textColor} font-semibold text-sm`}>{toast.title}</h3>
        <p className={`${theme.textColor} text-sm opacity-80 mt-1`}>{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className={`${theme.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Dismiss notification"
      >
        <X size={18} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

/**
 * ToastContainer - Renders all toasts in a fixed position
 */
const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};
