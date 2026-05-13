package com.deus.restaurant.mapper;

import com.deus.restaurant.dto.response.OrderItemResponse;
import com.deus.restaurant.dto.response.OrderResponse;
import com.deus.restaurant.model.ItemCustomization;
import com.deus.restaurant.model.Order;
import com.deus.restaurant.model.OrderItem;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        if (order == null) return null;
        List<OrderItemResponse> items = order.getItems() == null
                ? Collections.emptyList()
                : order.getItems().stream().filter(Objects::nonNull).map(this::toItemResponse).toList();

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .tableId(order.getTable() != null ? order.getTable().getTableId() : null)
                .tableNumber(order.getTable() != null ? order.getTable().getTableNumber() : null)
                .orderStatus(order.getOrderStatus())
                .items(items)
                .subtotal(order.getSubtotal())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .placedAt(order.getPlacedAt())
                .specialInstructions(order.getSpecialInstructions())
                .build();
    }

    public OrderItemResponse toItemResponse(OrderItem item) {
        if (item == null) return null;
        List<String> customizations = item.getCustomizations() == null
                ? Collections.emptyList()
                : item.getCustomizations().stream()
                .filter(Objects::nonNull)
                .map(ItemCustomization::getModificationName)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return OrderItemResponse.builder()
                .orderItemId(item.getOrderItemId())
                .itemName(item.getMenuItem() != null ? item.getMenuItem().getItemName() : null)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .itemStatus(item.getItemStatus())
                .specialNotes(item.getSpecialNotes())
                .destinationStation(item.getDestinationStation())
                .customizations(customizations)
                .build();
    }
}

