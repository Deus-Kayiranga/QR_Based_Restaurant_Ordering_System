package com.deus.restaurant.mapper;

import com.deus.restaurant.dto.response.BillResponse;
import com.deus.restaurant.dto.response.OrderItemResponse;
import com.deus.restaurant.model.Bill;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Component;

@Component
public class BillMapper {

    private final OrderMapper orderMapper;

    public BillMapper(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    public BillResponse toResponse(Bill bill) {
        if (bill == null) return null;
        List<OrderItemResponse> items = bill.getOrder() == null || bill.getOrder().getItems() == null
                ? Collections.emptyList()
                : bill.getOrder().getItems().stream().filter(Objects::nonNull).map(orderMapper::toItemResponse).toList();

        return BillResponse.builder()
                .billId(bill.getBillId())
                .billNumber(bill.getBillNumber())
                .orderId(bill.getOrder() != null ? bill.getOrder().getOrderId() : null)
                .tableNumber(bill.getOrder() != null && bill.getOrder().getTable() != null
                        ? bill.getOrder().getTable().getTableNumber()
                        : null)
                .items(items)
                .subtotal(bill.getSubtotal())
                .taxAmount(bill.getTaxAmount())
                .totalAmount(bill.getTotalAmount())
                .billStatus(bill.getBillStatus())
                .generatedAt(bill.getGeneratedAt())
                .build();
    }
}

