import React, { useState } from 'react';
import { useWebSocketNotifications } from '../hooks/useWebSocketNotifications';
import styles from './NotificationBell.module.css';

const NotificationBell = () => {
  const { notifications, isConnected, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useWebSocketNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    // Handle different notification types
    switch (notification.type) {
      case 'APPLICATION_STATUS_UPDATE':
        if (notification.applicationId) {
          // Navigate to application details
          window.location.href = `/applications/${notification.applicationId}`;
        }
        break;
      case 'INTERVIEW_REMINDER':
        // Navigate to interview details
        window.location.href = '/interviews';
        break;
      default:
        break;
    }
    setShowDropdown(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'APPLICATION_STATUS_UPDATE':
        return '📋';
      case 'INTERVIEW_REMINDER':
        return '📅';
      case 'OFFER_RECEIVED':
        return '🎉';
      default:
        return '🔔';
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'APPLIED': 'badgeApplied',
      'SHORTLISTED': 'badgeShortlisted',
      'INTERVIEW_SCHEDULED': 'badgeInterview',
      'INTERVIEW_COMPLETED': 'badgeCompleted',
      'OFFER_MADE': 'badgeOffer',
      'ACCEPTED': 'badgeAccepted',
      'REJECTED': 'badgeRejected',
      'WITHDRAWN': 'badgeWithdrawn'
    };
    return statusMap[status] || 'badgeDefault';
  };

  return (
    <div className={styles.notificationContainer}>
      <div className={styles.bellWrapper} onClick={() => setShowDropdown(!showDropdown)}>
        <div className={styles.bellIcon}>
          {isConnected ? '🔔' : '🔕'}
        </div>
        {unreadCount > 0 && (
          <span className={styles.notificationBadge}>{unreadCount}</span>
        )}
      </div>

      {showDropdown && (
        <div className={styles.notificationDropdown}>
          <div className={styles.dropdownHeader}>
            <h3>Notifications</h3>
            <div className={styles.headerActions}>
              <button onClick={markAllAsRead} className={styles.actionButton}>Mark all read</button>
              <button onClick={clearNotifications} className={styles.actionButton}>Clear all</button>
            </div>
          </div>

          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No notifications</p>
                {!isConnected && <p className={styles.connectionStatus}>⚠️ Connection lost</p>}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className={styles.notificationContent}>
                    <p className={styles.notificationMessage}>{notification.message}</p>
                    {notification.status && (
                      <span className={`${styles.statusBadge} ${getStatusBadge(notification.status)}`}>
                        {notification.status}
                      </span>
                    )}
                    <span className={styles.notificationTime}>
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;