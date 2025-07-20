// import { toast } from 'react-toastify';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  role: 'ADMIN' | 'WORKER' | 'KITCHEN';
  orderId?: string;
  tableNumber?: number;
}

class NotificationService {
  private notifications: Notification[] = [];

  // Get notifications filtered by role
  getNotifications(role: string): Notification[] {
    return this.notifications.filter(notification => 
      notification.role === role || notification.role === 'ADMIN'
    );
  }

  // Get unread count for a role
  getUnreadCount(role: string): number {
    return this.getNotifications(role).filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  // Add notification
  private addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    
    this.notifications.unshift(newNotification);
    
    // Show toast notification - temporarily disabled
    // toast(notification.message, {
    //   type: notification.type,
    //   position: 'top-right',
    //   autoClose: 5000,
    // });
    
    // For now, just log the notification
    console.log('Notification:', notification.message);
  }

  // Order received notification
  notifyOrderReceived(orderId: string, tableNumber: number, items: string[]): void {
    this.addNotification({
      title: 'New Order Received',
      message: `Order #${orderId} received for Table ${tableNumber} with ${items.length} items`,
      type: 'info',
      role: 'KITCHEN',
      orderId,
      tableNumber,
    });
  }

  // Order preparing notification
  notifyOrderPreparing(orderId: string, tableNumber: number): void {
    this.addNotification({
      title: 'Order Being Prepared',
      message: `Order #${orderId} from Table ${tableNumber} is now being prepared`,
      type: 'warning',
      role: 'WORKER',
      orderId,
      tableNumber,
    });
  }

  // Order ready notification
  notifyOrderReady(orderId: string, tableNumber: number): void {
    this.addNotification({
      title: 'Order Ready',
      message: `Order #${orderId} from Table ${tableNumber} is ready for pickup`,
      type: 'success',
      role: 'WORKER',
      orderId,
      tableNumber,
    });
  }

  // Order delivered notification
  notifyOrderDelivered(orderId: string, tableNumber: number): void {
    this.addNotification({
      title: 'Order Delivered',
      message: `Order #${orderId} has been delivered to Table ${tableNumber}`,
      type: 'success',
      role: 'WORKER',
      orderId,
      tableNumber,
    });
  }

  // Payment completed notification
  notifyPaymentCompleted(orderId: string, tableNumber: number, amount: number): void {
    this.addNotification({
      title: 'Payment Completed',
      message: `Payment of रू ${amount.toLocaleString()} received for Order #${orderId} from Table ${tableNumber}`,
      type: 'success',
      role: 'ADMIN',
      orderId,
      tableNumber,
    });
  }

  // Table booking notification
  notifyTableBooked(tableNumber: number, customerName: string): void {
    this.addNotification({
      title: 'Table Booked',
      message: `Table ${tableNumber} has been booked by ${customerName}`,
      type: 'info',
      role: 'WORKER',
      tableNumber,
    });
  }

  // Low inventory notification
  notifyLowInventory(itemName: string, currentStock: number): void {
    this.addNotification({
      title: 'Low Inventory Alert',
      message: `${itemName} is running low on stock (${currentStock} remaining)`,
      type: 'warning',
      role: 'ADMIN',
    });
  }

  // System error notification
  notifySystemError(error: string): void {
    this.addNotification({
      title: 'System Error',
      message: error,
      type: 'error',
      role: 'ADMIN',
    });
  }

  // Clear all notifications
  clearNotifications(): void {
    this.notifications = [];
  }

  // Clear notifications for a specific role
  clearNotificationsForRole(role: string): void {
    this.notifications = this.notifications.filter(n => n.role !== role);
  }
}

export const notificationService = new NotificationService(); 