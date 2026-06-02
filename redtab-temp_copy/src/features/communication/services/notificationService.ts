import { apiClient } from '@/lib/api';
import type { PaginatedResponse } from '@types';
import type { Notification } from '@/types';

interface GetNotificationsParams {
  page?: number;
  pageSize?: number;
  isRead?: boolean;
  marketSegmentId?: string;
}

/**
 * Notification API Service
 * Handles all notification-related API calls
 */
export class NotificationService {
  private resourcePath = '/notifications';

  /**
   * Get current user's notifications
   */
  async getUserNotifications(
    params?: GetNotificationsParams,
  ): Promise<PaginatedResponse<Notification>> {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page !== undefined) {
        queryParams.append('page', String(params.page));
      }
      if (params.pageSize !== undefined) {
        queryParams.append('pageSize', String(params.pageSize));
      }
      if (params.isRead !== undefined) {
        queryParams.append('isRead', String(params.isRead));
      }
      if (params.marketSegmentId !== undefined) {
        queryParams.append('marketSegmentId', params.marketSegmentId);
      }
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.resourcePath}/user?${queryString}`
      : `${this.resourcePath}/user`;

    const response = await apiClient.get<PaginatedResponse<Notification>>(url);
    return response as PaginatedResponse<Notification>;
  }

  /**
   * Get unread notification count for current user, optionally filtered by market segment
   */
  async getUnreadCount(marketSegmentId?: string): Promise<number> {
    const queryParams = new URLSearchParams();
    if (marketSegmentId !== undefined) {
      queryParams.append('marketSegmentId', marketSegmentId);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.resourcePath}/user/unread-count?${queryString}`
      : `${this.resourcePath}/user/unread-count`;

    const response = await apiClient.get<{ unreadCount: number }>(url);
    return (response as { unreadCount: number }).unreadCount;
  }

  /**
   * Get single notification by ID
   */
  async getNotificationById(id: string): Promise<Notification> {
    const response = await apiClient.get<Notification>(
      `${this.resourcePath}/${id}`,
    );
    return response as Notification;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await apiClient.post<Notification>(
      `${this.resourcePath}/${notificationId}/mark-as-read`,
      {},
    );
    return response as Notification;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ status: string }> {
    const response = await apiClient.post<{ status: string }>(
      `${this.resourcePath}/user/mark-all-as-read`,
      {},
    );
    return response as { status: string };
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string): Promise<{ status: string }> {
    const response = await apiClient.delete<{ status: string }>(
      `${this.resourcePath}/${id}`,
    );
    return response as { status: string };
  }
}

export const notificationService = new NotificationService();
