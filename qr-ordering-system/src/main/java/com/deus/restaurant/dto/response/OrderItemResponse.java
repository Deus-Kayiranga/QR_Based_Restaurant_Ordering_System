package com.deus.restaurant.dto.response;

import com.deus.restaurant.enums.OrderItemStatus;
import com.deus.restaurant.enums.StationType;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long orderItemId;
    private String itemName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private OrderItemStatus itemStatus;
    private String specialNotes;
    private StationType destinationStation;
    private List<String> customizations;
}

