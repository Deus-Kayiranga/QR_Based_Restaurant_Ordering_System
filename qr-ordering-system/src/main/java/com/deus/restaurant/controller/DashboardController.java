package com.deus.restaurant.controller;

import com.deus.restaurant.dto.response.ApiResponse;
import com.deus.restaurant.dto.response.DashboardResponse;
import com.deus.restaurant.service.DashboardService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;
    public DashboardController(DashboardService dashboardService) { this.dashboardService = dashboardService; }
    @GetMapping("/manager") @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<DashboardResponse>> manager() { return ResponseEntity.ok(ApiResponse.ok("Manager dashboard", dashboardService.getManagerDashboard())); }
    @GetMapping("/cashier") @PreAuthorize("hasAnyRole('CASHIER','MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cashier() { return ResponseEntity.ok(ApiResponse.ok("Cashier dashboard", dashboardService.getCashierDashboard())); }
    @GetMapping("/kitchen") @PreAuthorize("hasAnyRole('KITCHEN_STAFF','BAR_STAFF','MANAGER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> kitchen() { return ResponseEntity.ok(ApiResponse.ok("Kitchen stats", dashboardService.getKitchenStats())); }
    @GetMapping("/bar") @PreAuthorize("hasAnyRole('BAR_STAFF','MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> bar() { return ResponseEntity.ok(ApiResponse.ok("Bar stats", dashboardService.getBarStats())); }
    @GetMapping("/admin") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<DashboardResponse>> admin() { return ResponseEntity.ok(ApiResponse.ok("Admin dashboard", dashboardService.getSuperAdminDashboard())); }
}

