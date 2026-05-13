package com.deus.restaurant.mapper;

import com.deus.restaurant.dto.response.MenuCategoryResponse;
import com.deus.restaurant.model.MenuCategory;
import org.springframework.stereotype.Component;

@Component
public class MenuCategoryMapper {
    public MenuCategoryResponse toResponse(MenuCategory category) {
        if (category == null) return null;
        return MenuCategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .description(category.getDescription())
                .displayOrder(category.getDisplayOrder())
                .isActive(category.getIsActive())
                .build();
    }
}

