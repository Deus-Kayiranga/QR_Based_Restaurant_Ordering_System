package com.deus.restaurant.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KitchenOrderResponse {
    private Long orderId;
    private Long tableId;
    private String tableNumber;
    private List<OrderItemResponse> items;
    private String timeSinceOrdered;
    private List<String> allergenWarnings;
}

