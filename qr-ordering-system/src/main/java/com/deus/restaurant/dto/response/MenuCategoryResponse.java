package com.deus.restaurant.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuCategoryResponse {
    private Long categoryId;
    private String categoryName;
    private String description;
    private Integer displayOrder;
    private Boolean isActive;
}

