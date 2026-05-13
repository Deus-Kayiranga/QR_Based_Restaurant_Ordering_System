package com.deus.restaurant.controller;

import com.deus.restaurant.dto.response.ApiResponse;
import com.deus.restaurant.dto.response.NotificationResponse;
import com.deus.restaurant.service.AuthService;
import com.deus.restaurant.service.NotificationService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final AuthService authService;
    public NotificationController(NotificationService notificationService, AuthService authService) {
        this.notificationService = notificationService;
        this.authService = authService;
    }
    private Long currentUserId() { return authService.getCurrentUser().getUserId(); }
    @GetMapping public ResponseEntity<ApiResponse<List<NotificationResponse>>> all() { return ResponseEntity.ok(ApiResponse.ok("Notifications", notificationService.getUserNotifications(currentUserId()))); }
    @GetMapping("/unread") public ResponseEntity<ApiResponse<List<NotificationResponse>>> unread() { return ResponseEntity.ok(ApiResponse.ok("Unread notifications", notificationService.getUnreadNotifications(currentUserId()))); }
    @PatchMapping("/{id}/read") public ResponseEntity<ApiResponse<Void>> read(@PathVariable Long id) { notificationService.markAsRead(id); return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", null)); }
    @PatchMapping("/read-all") public ResponseEntity<ApiResponse<Void>> readAll() { notificationService.markAllAsRead(currentUserId()); return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", null)); }
}

