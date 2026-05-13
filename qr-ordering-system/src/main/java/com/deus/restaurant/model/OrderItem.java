package com.deus.restaurant.model;

import com.deus.restaurant.enums.OrderItemStatus;
import com.deus.restaurant.enums.StationType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "order_items",
        indexes = {
                @Index(name = "idx_order_items_order", columnList = "order_id"),
                @Index(name = "idx_order_items_status", columnList = "item_status"),
                @Index(name = "idx_order_items_station", columnList = "destination_station")
        }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id", nullable = false, updatable = false)
    private Long orderItemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Builder.Default
    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "item_status", nullable = false, length = 20)
    private OrderItemStatus itemStatus = OrderItemStatus.PENDING;

    @Lob
    @Column(name = "special_notes")
    private String specialNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "destination_station", nullable = false, length = 20)
    private StationType destinationStation;

    @Column(name = "prep_started_at")
    private LocalDateTime prepStartedAt;

    @Column(name = "prep_completed_at")
    private LocalDateTime prepCompletedAt;

    @Column(name = "served_at")
    private LocalDateTime servedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCustomization> customizations = new ArrayList<>();

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (quantity == null || quantity <= 0) quantity = 1;
        if (itemStatus == null) itemStatus = OrderItemStatus.PENDING;
        if (customizations == null) customizations = new ArrayList<>();
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
        if (quantity == null || quantity <= 0) quantity = 1;
        if (itemStatus == null) itemStatus = OrderItemStatus.PENDING;
        if (customizations == null) customizations = new ArrayList<>();
    }
}

