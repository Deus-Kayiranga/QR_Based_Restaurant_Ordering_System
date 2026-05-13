package com.deus.restaurant.controller;

import com.deus.restaurant.dto.response.ApiResponse;
import com.deus.restaurant.dto.response.OrderResponse;
import com.deus.restaurant.dto.response.TableResponse;
import com.deus.restaurant.model.User;
import com.deus.restaurant.repository.UserRepository;
import com.deus.restaurant.service.OrderService;
import com.deus.restaurant.service.TableService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/waiter")
@PreAuthorize("hasAnyRole('WAITER', 'MANAGER', 'SUPER_ADMIN')")
public class WaiterController {

    private final OrderService orderService;
    private final TableService tableService;
    private final UserRepository userRepository;

    public WaiterController(OrderService orderService, TableService tableService, UserRepository userRepository) {
        this.orderService = orderService;
        this.tableService = tableService;
        this.userRepository = userRepository;
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders() {
        User user = getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok("My orders", orderService.getWaiterOrders(user.getUserId())));
    }
    
    @GetMapping("/my-orders-history")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrdersHistory() {
        User user = getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok("My orders history", orderService.getWaiterOrderHistory(user.getUserId())));
    }

    @GetMapping("/my-tables")
    public ResponseEntity<ApiResponse<List<TableResponse>>> getMyTables() {
        // For simplicity, waiters see all tables or tables assigned to their section.
        // We'll return all tables for now, but we can filter by section if needed.
        return ResponseEntity.ok(ApiResponse.ok("My tables", tableService.getAllTables()));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
