import { io, Socket } from 'socket.io-client';
import type { Notification } from '@/types';

// Use VITE_WS_URL for dedicated WebSocket server
// Falls back to VITE_API_URL or window.location.origin
const WS_BASE_URL = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL || window.location.origin;

interface NotificationEvent {
  notification: Notification;
}

interface SocketServiceConfig {
  token: string;
}

type NotificationCallback = (notification: Notification) => void;

/**
 * Socket.IO Service for real-time notifications
 * Manages WebSocket connection and event handling
 */
class SocketService {
  private socket: Socket | null = null;
  private notificationCallbacks: Set<NotificationCallback> = new Set();
  private isConnecting = false;

  /**
   * Initialize Socket.IO connection
   */
  connect(config: SocketServiceConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;

      try {
        this.socket = io(WS_BASE_URL, {
          auth: {
            token: config.token,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
          console.log('Connected to notification service');
          this.isConnecting = false;
          resolve();
        });

        this.socket.on('notification', (notification: Notification) => {
          this.handleNotification(notification);
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from notification service');
        });

        this.socket.on('connect_error', (error: Error) => {
          console.error('Socket connection error:', error);
          this.isConnecting = false;
          reject(error);
        });

        this.socket.on('error', (error: unknown) => {
          console.error('Socket error:', error);
        });
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect Socket.IO
   */
  disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Subscribe to notification events
   */
  onNotification(callback: NotificationCallback): () => void {
    this.notificationCallbacks.add(callback);
    // Return unsubscribe function
    return () => {
      this.notificationCallbacks.delete(callback);
    };
  }

  /**
   * Emit mark-as-read event
   */
  markAsRead(notificationId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('mark-as-read', notificationId);
    }
  }

  /**
   * Emit mark-all-as-read event
   */
  markAllAsRead(): void {
    if (this.socket?.connected) {
      this.socket.emit('mark-all-as-read');
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Handle incoming notification
   */
  private handleNotification(notification: Notification): void {
    this.notificationCallbacks.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });
  }
}

export const socketService = new SocketService();
