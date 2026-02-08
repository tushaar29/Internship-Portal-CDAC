import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import websocketService from '../services/websocketService';

export const useWebSocketNotifications = () => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token || !user) return;

    const connectWebSocket = async () => {
      try {
        await websocketService.connect(token);
        setIsConnected(true);

        // Subscribe to user-specific notifications
        websocketService.subscribeToUserNotifications(user.id, (notification) => {
          setNotifications(prev => [{
            ...notification,
            id: Date.now(),
            read: false,
            timestamp: new Date()
          }, ...prev]);

          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification('Intersify Update', {
              body: notification.message,
              icon: '/favicon.ico'
            });
          }
        });

        // Subscribe to company notifications if user is a company
        if (user.role === 'COMPANY') {
          websocketService.subscribeToCompanyNotifications(user.id, (notification) => {
            setNotifications(prev => [{
              ...notification,
              id: Date.now(),
              read: false,
              timestamp: new Date()
            }, ...prev]);
          });
        }

        // Subscribe to global notifications
        websocketService.subscribeToGlobalNotifications((notification) => {
          setNotifications(prev => [{
            ...notification,
            id: Date.now(),
            read: false,
            timestamp: new Date()
          }, ...prev]);
        });

        // Setup auto-reconnect
        websocketService.setupAutoReconnect(token);

      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      websocketService.disconnect();
      setIsConnected(false);
    };
  }, [token, user]);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isConnected,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
};

// Custom hook for application-specific notifications
export const useApplicationNotifications = (applicationId) => {
  const { token, user } = useAuth();
  const [applicationUpdates, setApplicationUpdates] = useState([]);

  useEffect(() => {
    if (!token || !user || !applicationId) return;

    const handleNotification = (notification) => {
      if (notification.applicationId === applicationId) {
        setApplicationUpdates(prev => [{
          ...notification,
          id: Date.now(),
          timestamp: new Date()
        }, ...prev]);
      }
    };

    // Subscribe to user notifications and filter for this application
    websocketService.subscribeToUserNotifications(user.id, handleNotification);

    return () => {
      // Cleanup subscription
      websocketService.unsubscribe(`/user/${user.id}/queue/notifications`);
    };
  }, [token, user, applicationId]);

  return applicationUpdates;
};