package com.deus.restaurant.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Integer activeTables;
    private Integer todayOrders;
    private BigDecimal todayRevenue;
    private Integer pendingBills;
    private Integer staffOnDuty;
    private List<Map<String, Object>> topSellingItems;
}

