package com.deus.restaurant.dto.request;

import com.deus.restaurant.enums.StationType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemRequest {
    @NotNull
    private Long categoryId;

    @NotBlank
    @Size(max = 100)
    private String itemName;

    @Size(max = 5000)
    private String description;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal price;

    @Size(max = 500)
    private String imageUrl;

    @NotNull
    private StationType destinationStation;

    @NotNull
    private Boolean isVegetarian;

    @NotNull
    private Boolean isVegan;

    @NotNull
    private Boolean isGlutenFree;

    @Size(max = 255)
    private String containsAllergens;

    @NotNull
    private Integer displayOrder;

    @NotNull
    private Boolean trackStock;

    private Integer stockQuantity;

    private Integer minStockLevel;
}

