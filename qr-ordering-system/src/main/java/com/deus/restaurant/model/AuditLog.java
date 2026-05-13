package com.deus.restaurant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    private String action; // e.g., "LOGIN", "UPDATE_MENU", "PLACE_ORDER", "DELETE_STAFF"
    private String module; // e.g., "AUTH", "MENU", "ORDERS", "STAFF"
    
    @Column(columnDefinition = "TEXT")
    private String details;
    
    private String performedBy; // Username or Email
    private String userRole;
    private String ipAddress;
    
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
