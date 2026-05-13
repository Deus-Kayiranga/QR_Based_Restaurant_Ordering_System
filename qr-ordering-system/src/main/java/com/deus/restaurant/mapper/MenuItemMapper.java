package com.deus.restaurant.mapper;

import com.deus.restaurant.dto.response.MenuItemResponse;
import com.deus.restaurant.model.MenuItem;
import org.springframework.stereotype.Component;

@Component
public class MenuItemMapper {
    public MenuItemResponse toResponse(MenuItem item) {
        if (item == null) return null;
        return MenuItemResponse.builder()
                .itemId(item.getItemId())
                .categoryName(item.getCategory() != null ? item.getCategory().getCategoryName() : null)
                .itemName(item.getItemName())
                .description(item.getDescription())
                .price(item.getDiscountedPrice() != null ? item.getDiscountedPrice() : item.getPrice())
                .imageUrl(item.getImageUrl())
                .destinationStation(item.getDestinationStation())
                .isAvailable(item.getIsAvailable())
                .isVegetarian(item.getIsVegetarian())
                .isVegan(item.getIsVegan())
                .isGlutenFree(item.getIsGlutenFree())
                .containsAllergens(item.getContainsAllergens())
                .displayOrder(item.getDisplayOrder())
                .trackStock(item.getTrackStock())
                .stockQuantity(item.getStockQuantity())
                .minStockLevel(item.getMinStockLevel())
                .build();
    }
}

