import { toast } from 'react-toastify';
import io, { Socket } from 'socket.io-client';

class NotificationService {
  private socket: Socket | null = null;
  private isConnected = false;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      this.socket = io(process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000');
      
      this.socket.on('connect', () => {
        console.log('Connected to notification server');
        this.isConnected = true;
        
        // Join kitchen room for kitchen staff
        if (this.isKitchenStaff()) {
          this.socket?.emit('join-kitchen');
        }
        
        // Join waiter room for workers
        if (this.isWorker()) {
          this.socket?.emit('join-waiter');
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from notification server');
        this.isConnected = false;
      });

      // Listen for order updates
      this.socket.on('new-order-received', (data: any) => {
        if (this.isKitchenStaff()) {
          this.showNotification(
            'New Order Received',
            'info',
            `Order #${data.orderNumber} for Table ${data.tableNumber}`
          );
        }
      });

      this.socket.on('order-updated', (data: any) => {
        if (this.isWorker()) {
          this.showNotification(
            'Order Status Updated',
            'info',
            `Order #${data.orderId} is now ${data.status}`
          );
        }
      });

      this.socket.on('order-ready', (data: any) => {
        if (this.isWorker()) {
          this.showNotification(
            'Order Ready for Serving',
            'success',
            `Order #${data.orderId} is ready to be served`
          );
        }
      });

    } catch (error) {
      console.error('Failed to connect to notification server:', error);
    }
  }

  private isKitchenStaff(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'KITCHEN_STAFF';
  }

  private isWorker(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'WAITER' || user.role === 'WORKER';
  }

  public showNotification(title: string, type: 'success' | 'error' | 'info' | 'warning', message: string) {
    toast[type](`${title}: ${message}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  public sendOrderToKitchen(orderData: any) {
    if (this.isConnected && this.socket) {
      this.socket.emit('new-order', orderData);
    }
  }

  public updateOrderStatus(orderId: string, status: string) {
    if (this.isConnected && this.socket) {
      this.socket.emit('order-status-update', { orderId, status });
    }
  }

  public notifyPaymentCompleted(orderId: string, tableNumber: number, amount: number) {
    this.showNotification(
      'Payment Completed',
      'success',
      `Payment of ${amount} completed for Order #${orderId} at Table ${tableNumber}`
    );
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export const notificationService = new NotificationService(); 