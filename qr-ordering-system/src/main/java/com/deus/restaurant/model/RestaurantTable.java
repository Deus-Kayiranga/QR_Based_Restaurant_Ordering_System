package com.deus.restaurant.model;

import com.deus.restaurant.enums.TableStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "restaurant_tables",
        indexes = {
                @Index(name = "idx_tables_status", columnList = "status"),
                @Index(name = "idx_tables_qr_token", columnList = "qr_code_token")
        }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "table_id", nullable = false, updatable = false)
    private Long tableId;

    @Column(name = "table_number", nullable = false, unique = true, length = 10)
    private String tableNumber;

    @Column(name = "qr_code_token", nullable = false, unique = true, length = 100)
    private String qrCodeToken;

    @Column(name = "qr_code_image_url", length = 1000)
    private String qrCodeImageUrl;

    @Builder.Default
    @Column(name = "seating_capacity", nullable = false)
    private Integer seatingCapacity = 4;

    @Column(name = "section", length = 50)
    private String section;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TableStatus status = TableStatus.AVAILABLE;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (seatingCapacity == null || seatingCapacity <= 0) seatingCapacity = 4;
        if (status == null) status = TableStatus.AVAILABLE;
        if (isActive == null) isActive = true;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
        if (seatingCapacity == null || seatingCapacity <= 0) seatingCapacity = 4;
        if (status == null) status = TableStatus.AVAILABLE;
        if (isActive == null) isActive = true;
    }
}

