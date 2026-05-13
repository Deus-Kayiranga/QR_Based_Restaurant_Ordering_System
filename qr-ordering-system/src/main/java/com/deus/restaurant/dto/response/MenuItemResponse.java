package com.deus.restaurant.dto.response;

import com.deus.restaurant.enums.StationType;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemResponse {
    private Long itemId;
    private String categoryName;
    private String itemName;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private StationType destinationStation;
    private Boolean isAvailable;
    private Boolean isVegetarian;
    private Boolean isVegan;
    private Boolean isGlutenFree;
    private String containsAllergens;
    private Integer displayOrder;
    private Boolean trackStock;
    private Integer stockQuantity;
    private Integer minStockLevel;
}

