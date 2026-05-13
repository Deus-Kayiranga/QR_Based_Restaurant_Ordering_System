package com.deus.restaurant.controller;

import com.deus.restaurant.dto.request.AddItemsRequest;
import com.deus.restaurant.dto.request.OrderRequest;
import com.deus.restaurant.dto.request.StatusUpdateRequest;
import com.deus.restaurant.dto.response.ApiResponse;
import com.deus.restaurant.dto.response.KitchenOrderResponse;
import com.deus.restaurant.dto.response.OrderItemResponse;
import com.deus.restaurant.dto.response.OrderResponse;
import com.deus.restaurant.enums.OrderStatus;
import com.deus.restaurant.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    public OrderController(OrderService orderService) { this.orderService = orderService; }

    @PostMapping public ResponseEntity<ApiResponse<OrderResponse>> place(@Valid @RequestBody OrderRequest req) { return ResponseEntity.ok(ApiResponse.ok("Order placed", orderService.placeOrder(req))); }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<OrderResponse>> byId(@PathVariable Long id) { return ResponseEntity.ok(ApiResponse.ok("Order", orderService.getOrderById(id))); }
    @GetMapping("/table/{tableId}") @PreAuthorize("hasAnyRole('WAITER','MANAGER')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> byTable(@PathVariable Long tableId) { return ResponseEntity.ok(ApiResponse.ok("Orders", orderService.getOrdersByTable(tableId))); }
    @GetMapping("/queue/kitchen") @PreAuthorize("hasAnyRole('KITCHEN_STAFF','MANAGER','SUPER_ADMIN','WAITER')")
    public ResponseEntity<ApiResponse<List<KitchenOrderResponse>>> kitchen() { return ResponseEntity.ok(ApiResponse.ok("Kitchen queue", orderService.getKitchenQueue())); }
    @GetMapping("/queue/bar") @PreAuthorize("hasAnyRole('BAR_STAFF','MANAGER','SUPER_ADMIN','WAITER')")
    public ResponseEntity<ApiResponse<List<KitchenOrderResponse>>> bar() { return ResponseEntity.ok(ApiResponse.ok("Bar queue", orderService.getBarQueue())); }
    @PatchMapping("/{id}/status") @PreAuthorize("hasAnyRole('KITCHEN_STAFF','BAR_STAFF','WAITER','MANAGER')")
    public ResponseEntity<ApiResponse<OrderResponse>> orderStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest req) { return ResponseEntity.ok(ApiResponse.ok("Order status updated", orderService.updateOrderStatus(id, req))); }
    @PatchMapping("/{orderId}/items/{itemId}/status") @PreAuthorize("hasAnyRole('KITCHEN_STAFF','BAR_STAFF','WAITER','MANAGER')")
    public ResponseEntity<ApiResponse<OrderItemResponse>> itemStatus(@PathVariable Long orderId, @PathVariable Long itemId, @Valid @RequestBody StatusUpdateRequest req) { return ResponseEntity.ok(ApiResponse.ok("Item status updated", orderService.updateItemStatus(itemId, req))); }
    @PostMapping("/{id}/add-items") public ResponseEntity<ApiResponse<OrderResponse>> add(@PathVariable Long id, @Valid @RequestBody AddItemsRequest req) { return ResponseEntity.ok(ApiResponse.ok("Items added", orderService.addItemsToOrder(id, req))); }
    @PatchMapping("/{id}/assign-waiter") @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> assign(@PathVariable Long id, @RequestParam Long waiterId) { return ResponseEntity.ok(ApiResponse.ok("Waiter assigned", orderService.assignWaiter(id, waiterId))); }
    @GetMapping("/waiter/{waiterId}") @PreAuthorize("hasAnyRole('WAITER','MANAGER')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> waiterOrders(@PathVariable Long waiterId) { return ResponseEntity.ok(ApiResponse.ok("Waiter orders", orderService.getWaiterOrders(waiterId))); }
    @GetMapping("/status/{status}") public ResponseEntity<ApiResponse<List<OrderResponse>>> byStatus(@PathVariable OrderStatus status) { return ResponseEntity.ok(ApiResponse.ok("Orders", orderService.getOrdersByStatus(status))); }
    @GetMapping("/all") @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<com.deus.restaurant.dto.response.PaginatedResponse<OrderResponse>>> all(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok("All orders", orderService.getAllOrders(page, size)));
    }
}

