package com.deus.restaurant.service;

import com.deus.restaurant.dto.response.NotificationResponse;
import com.deus.restaurant.enums.NotificationType;
import java.util.List;

public interface NotificationService {
    void sendNotification(Long recipientId, NotificationType type, String title, String message, String refType, Long refId);

    List<NotificationResponse> getUserNotifications(Long userId);

    List<NotificationResponse> getUnreadNotifications(Long userId);

    void markAsRead(Long notificationId);

    void markAllAsRead(Long userId);

    void sendOrderNotification(Long orderId, NotificationType type);
    
    void sendMenuUpdate(String title, String message);
}

