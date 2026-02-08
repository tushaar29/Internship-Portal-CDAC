package com.intersify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendApplicationStatusUpdate(Long userId, String message, String applicationId, String newStatus) {
        // Send to specific user
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications",
            new NotificationMessage("APPLICATION_STATUS_UPDATE", message, applicationId, newStatus)
        );
    }

    public void broadcastToCompany(Long companyId, String message, String applicationId, String status) {
        // Send to all company users
        messagingTemplate.convertAndSend(
            "/topic/company/" + companyId + "/applications",
            new NotificationMessage("APPLICATION_UPDATE", message, applicationId, status)
        );
    }

    public void sendGlobalNotification(String message, String type) {
        messagingTemplate.convertAndSend(
            "/topic/notifications",
            new NotificationMessage(type, message, null, null)
        );
    }

    // Inner class for notification messages
    public static class NotificationMessage {
        private String type;
        private String message;
        private String applicationId;
        private String status;
        private long timestamp = System.currentTimeMillis();

        public NotificationMessage(String type, String message, String applicationId, String status) {
            this.type = type;
            this.message = message;
            this.applicationId = applicationId;
            this.status = status;
        }

        // Getters and setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getApplicationId() { return applicationId; }
        public void setApplicationId(String applicationId) { this.applicationId = applicationId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public long getTimestamp() { return timestamp; }
    }
}