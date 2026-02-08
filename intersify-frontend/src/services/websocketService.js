import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }

      const socket = new SockJS('http://localhost:8080/ws');
      this.stompClient = Stomp.over(socket);
      
      // Disable debug logs in production
      this.stompClient.debug = () => {};

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      this.stompClient.connect(
        headers,
        (frame) => {
          this.connected = true;
          this.reconnectAttempts = 0;
          console.log('WebSocket connected:', frame);
          
          // Resubscribe to all previous subscriptions
          this.resubscribeAll();
          
          resolve();
        },
        (error) => {
          this.connected = false;
          console.error('WebSocket connection error:', error);
          this.scheduleReconnect(token, reject);
        }
      );

      this.stompClient.onDisconnect = () => {
        this.connected = false;
        console.log('WebSocket disconnected');
        this.scheduleReconnect(token);
      };
    });
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect();
      this.connected = false;
      this.subscriptions.clear();
    }
  }

  subscribeToUserNotifications(userId, callback) {
    if (!this.connected) {
      console.warn('WebSocket not connected');
      return null;
    }

    const destination = `/user/${userId}/queue/notifications`;
    const subscription = this.stompClient.subscribe(destination, (message) => {
      const notification = JSON.parse(message.body);
      callback(notification);
    });

    this.subscriptions.set(destination, subscription);
    return subscription;
  }

  subscribeToCompanyNotifications(companyId, callback) {
    if (!this.connected) {
      console.warn('WebSocket not connected');
      return null;
    }

    const destination = `/topic/company/${companyId}/applications`;
    const subscription = this.stompClient.subscribe(destination, (message) => {
      const notification = JSON.parse(message.body);
      callback(notification);
    });

    this.subscriptions.set(destination, subscription);
    return subscription;
  }

  subscribeToGlobalNotifications(callback) {
    if (!this.connected) {
      console.warn('WebSocket not connected');
      return null;
    }

    const destination = '/topic/notifications';
    const subscription = this.stompClient.subscribe(destination, (message) => {
      const notification = JSON.parse(message.body);
      callback(notification);
    });

    this.subscriptions.set(destination, subscription);
    return subscription;
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach((subscription, destination) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }

  resubscribeAll() {
    // This method should be implemented to resubscribe to all previous subscriptions
    // after a reconnection. The actual implementation would depend on how
    // the subscriptions are stored and managed in the React components.
    console.log('Resubscribing to all previous subscriptions...');
  }

  scheduleReconnect(token, originalReject) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      if (originalReject) {
        originalReject(new Error('Max reconnection attempts reached'));
      }
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect(token).catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  isConnected() {
    return this.connected;
  }

  // Helper method to send messages (if needed for two-way communication)
  sendMessage(destination, message) {
    if (!this.connected) {
      console.warn('WebSocket not connected');
      return false;
    }

    this.stompClient.send(destination, {}, JSON.stringify(message));
    return true;
  }
}

export default new WebSocketService();