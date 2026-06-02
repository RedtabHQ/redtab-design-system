import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import type { ToastType } from '@/hooks/useToast';
import React from 'react';

/**
 * Unified notification type theming
 * Used by both toast notifications and persistent notifications
 */
export const notificationTypeConfig = {
  SUCCESS: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
    iconColor: 'text-green-600',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-600',
  },
  WARNING: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-900',
    iconColor: 'text-amber-600',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-600',
  },
  DANGER: {
    icon: AlertTriangle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    iconColor: 'text-red-600',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-600',
  },
  INFO: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    iconColor: 'text-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-600',
  },
} as const;

/**
 * Get theme config for a notification type
 */
export const getNotificationTheme = (type: ToastType) => {
  return notificationTypeConfig[type] || notificationTypeConfig.INFO;
};

/**
 * Get the icon component for a notification type
 */
export const getNotificationIcon = (type: ToastType, size: number = 20) => {
  const config = getNotificationTheme(type);
  const Icon = config.icon;
  return React.createElement(Icon, { size, className: config.iconColor });
};
