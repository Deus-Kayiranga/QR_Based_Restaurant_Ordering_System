package com.deus.restaurant.dto.response;

import com.deus.restaurant.enums.BillStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillResponse {
    private Long billId;
    private String billNumber;
    private Long orderId;
    private String tableNumber;
    private List<OrderItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private BillStatus billStatus;
    private LocalDateTime generatedAt;
}

