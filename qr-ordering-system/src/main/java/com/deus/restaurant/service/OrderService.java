package com.deus.restaurant.service;

import com.deus.restaurant.dto.request.AddItemsRequest;
import com.deus.restaurant.dto.request.OrderRequest;
import com.deus.restaurant.dto.request.StatusUpdateRequest;
import com.deus.restaurant.dto.response.KitchenOrderResponse;
import com.deus.restaurant.dto.response.OrderItemResponse;
import com.deus.restaurant.dto.response.OrderResponse;
import com.deus.restaurant.dto.response.PaginatedResponse;
import com.deus.restaurant.enums.OrderStatus;
import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(OrderRequest request);

    OrderResponse getOrderById(Long id);

    List<OrderResponse> getOrdersByTable(Long tableId);

    List<OrderResponse> getOrdersByStatus(OrderStatus status);

    PaginatedResponse<OrderResponse> getAllOrders(int page, int size);

    List<KitchenOrderResponse> getKitchenQueue();

    List<KitchenOrderResponse> getBarQueue();

    OrderResponse updateOrderStatus(Long id, StatusUpdateRequest request);

    OrderItemResponse updateItemStatus(Long itemId, StatusUpdateRequest request);

    OrderResponse addItemsToOrder(Long orderId, AddItemsRequest request);

    void cancelOrder(Long id);

    OrderResponse assignWaiter(Long orderId, Long waiterId);

    List<OrderResponse> getWaiterOrders(Long waiterId);
    List<OrderResponse> getWaiterOrderHistory(Long waiterId);
}

