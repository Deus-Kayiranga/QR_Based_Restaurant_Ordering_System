package com.deus.restaurant.model;

import com.deus.restaurant.enums.StationType;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "menu_items",
        indexes = {
                @Index(name = "idx_items_category", columnList = "category_id"),
                @Index(name = "idx_items_available", columnList = "is_available"),
                @Index(name = "idx_items_station", columnList = "destination_station")
        }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id", nullable = false, updatable = false)
    private Long itemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private MenuCategory category;

    @Column(name = "item_name", nullable = false, length = 100)
    private String itemName;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "discounted_price", precision = 10, scale = 2)
    private BigDecimal discountedPrice;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "destination_station", nullable = false, length = 20)
    private StationType destinationStation;

    @Builder.Default
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Builder.Default
    @Column(name = "is_vegetarian", nullable = false)
    private Boolean isVegetarian = false;

    @Builder.Default
    @Column(name = "is_vegan", nullable = false)
    private Boolean isVegan = false;

    @Builder.Default
    @Column(name = "is_gluten_free", nullable = false)
    private Boolean isGlutenFree = false;

    @Column(name = "contains_allergens", length = 255)
    private String containsAllergens;

    @Builder.Default
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Builder.Default
    @Column(name = "track_stock", nullable = false)
    private Boolean trackStock = false;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Builder.Default
    @Column(name = "min_stock_level")
    private Integer minStockLevel = 10;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (displayOrder == null) displayOrder = 0;
        if (isAvailable == null) isAvailable = true;
        if (isVegetarian == null) isVegetarian = false;
        if (isVegan == null) isVegan = false;
        if (isGlutenFree == null) isGlutenFree = false;
        if (trackStock == null) trackStock = false;
        if (trackStock && stockQuantity == null) stockQuantity = 0;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
        if (displayOrder == null) displayOrder = 0;
        if (isAvailable == null) isAvailable = true;
        if (isVegetarian == null) isVegetarian = false;
        if (isVegan == null) isVegan = false;
        if (isGlutenFree == null) isGlutenFree = false;
        if (trackStock == null) trackStock = false;
        if (trackStock && stockQuantity == null) stockQuantity = 0;
    }
}

