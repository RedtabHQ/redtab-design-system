import { useEffect, useCallback, useState } from 'react';
import { socketService } from '@/lib/socketService';
import { notificationService } from '@/features/communication/services/notificationService';
import { useAuthStore } from '@/stores';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import type { Notification } from '@/types';

/**
 * Custom hook for managing persistent backend notifications
 * Handles Socket.IO connection and notification fetching
 *
 * Note: This is for PERSISTENT notifications from the backend
 * For UI-level toast notifications, use useToast instead
 */
export const useNotifications = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.accessToken);
  const { segmentId } = useMarketSegment();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(
    async (page = 1, pageSize = 30, isRead?: boolean) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await notificationService.getUserNotifications({
          page,
          pageSize,
          isRead,
          marketSegmentId: segmentId,
        });
        setNotifications(result.items ?? []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch notifications';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [segmentId],
  );

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount(segmentId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [segmentId]);

  /**
   * Initialize notification system and refetch when market segment changes
   */
  useEffect(() => {
    if (!user?.id || !token) return;

    const initializeNotifications = async () => {
      try {
        // Connect to Socket.IO with JWT token
        await socketService.connect({ token });

        // Fetch initial notifications
        await fetchNotifications(1, 30);
        await fetchUnreadCount();

        // Subscribe to real-time notifications
        const unsubscribe = socketService.onNotification(
          (notification: Notification) => {
            // Only add notification if it matches current market segment or is global
            const isRelevant =
              !notification.marketSegmentId || notification.marketSegmentId === segmentId;
            if (isRelevant) {
              setNotifications(prev => [notification, ...prev]);
              setUnreadCount(prev => (notification.isRead ? prev : prev + 1));
            }
          },
        );

        return () => {
          unsubscribe();
          socketService.disconnect();
        };
      } catch (err) {
        console.error('Failed to initialize notifications:', err);
      }
    };

    const cleanup = initializeNotifications();

    return () => {
      cleanup?.then((fn) => fn?.());
    };
  }, [user?.id, token, fetchNotifications, fetchUnreadCount, segmentId]);

  /**
   * Handle marking notification as read
   */
  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationService.markAsRead(notificationId);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        socketService.markAsRead(notificationId);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    [],
  );

  /**
   * Handle marking all as read
   */
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      socketService.markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  /**
   * Handle deleting notification
   */
  const handleDeleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  /**
   * Refresh notifications
   */
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications(1, 30);
    await fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    refreshNotifications,
    isConnected: socketService.isConnected(),
  };
};
