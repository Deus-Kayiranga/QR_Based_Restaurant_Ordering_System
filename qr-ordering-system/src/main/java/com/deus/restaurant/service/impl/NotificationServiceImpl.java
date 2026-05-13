package com.deus.restaurant.service.impl;

import com.deus.restaurant.dto.response.NotificationResponse;
import com.deus.restaurant.enums.NotificationType;
import com.deus.restaurant.exception.ResourceNotFoundException;
import com.deus.restaurant.mapper.NotificationMapper;
import com.deus.restaurant.model.Notification;
import com.deus.restaurant.model.User;
import com.deus.restaurant.repository.NotificationRepository;
import com.deus.restaurant.repository.UserRepository;
import com.deus.restaurant.service.NotificationService;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository,
                                   NotificationMapper notificationMapper, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.notificationMapper = notificationMapper;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    @Transactional
    public void sendNotification(Long recipientId, NotificationType type, String title, String message, String refType, Long refId) {
        User recipient = userRepository.findById(recipientId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Notification n = notificationRepository.save(Notification.builder()
                .recipient(recipient)
                .type(type)
                .title(title)
                .message(message)
                .referenceType(refType)
                .referenceId(refId)
                .isRead(false)
                .build());
        messagingTemplate.convertAndSend("/topic/notifications/" + recipientId, notificationMapper.toResponse(n));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        User u = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(u).stream().map(notificationMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        User u = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByRecipientAndIsReadFalse(u).stream().map(notificationMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId).orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        n.setIsRead(true);
        notificationRepository.save(n);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        User u = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Notification> all = notificationRepository.findByRecipientAndIsReadFalse(u);
        all.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(all);
    }

    @Override
    public void sendOrderNotification(Long orderId, NotificationType type) {
        // Broadcast proper JSON to kitchen/bar stations and order dashboards
        java.util.Map<String, Object> payload = new java.util.LinkedHashMap<>();
        String title;
        switch (type) {
            case NEW_ORDER: title = "🍽️ New Order"; break;
            case ORDER_READY: title = "✅ Order Ready"; break;
            case ORDER_COMPLETED: title = "☑️ Order Completed"; break;
            case PAYMENT_RECEIVED: title = "💳 Payment Received"; break;
            default: title = "Order Update";
        }
        String message;
        switch (type) {
            case NEW_ORDER: message = "New order #" + orderId + " has been placed and requires attention."; break;
            case ORDER_READY: message = "Order #" + orderId + " is ready to be served."; break;
            case ORDER_COMPLETED: message = "Order #" + orderId + " has been completed."; break;
            case PAYMENT_RECEIVED: message = "Payment received for order #" + orderId + "."; break;
            default: message = "Order #" + orderId + " status changed: " + type.name();
        }
        payload.put("title", title);
        payload.put("message", message);
        payload.put("orderId", orderId);
        payload.put("type", type.name());
        // Broadcast to orders topic (kitchen, bar, managers, cashiers)
        messagingTemplate.convertAndSend("/topic/orders", payload);
        // Also broadcast to station topics
        if (type == NotificationType.NEW_ORDER) {
            messagingTemplate.convertAndSend("/topic/stations/kitchen", payload);
            messagingTemplate.convertAndSend("/topic/stations/bar", payload);
        }
    }

    @Override
    public void sendMenuUpdate(String title, String message) {
        java.util.Map<String, Object> payload = new java.util.LinkedHashMap<>();
        payload.put("title", title);
        payload.put("message", message);
        payload.put("type", "MENU_UPDATE");
        payload.put("timestamp", LocalDateTime.now().toString());
        
        // Broadcast to all relevant topics
        messagingTemplate.convertAndSend("/topic/menu", payload);
        messagingTemplate.convertAndSend("/topic/orders", payload);
    }
}

