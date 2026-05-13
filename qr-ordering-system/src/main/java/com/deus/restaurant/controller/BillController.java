package com.deus.restaurant.controller;

import com.deus.restaurant.dto.response.ApiResponse;
import com.deus.restaurant.dto.response.BillResponse;
import com.deus.restaurant.service.BillService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('CASHIER', 'MANAGER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<BillResponse>>> getPendingBills() {
        return ResponseEntity.ok(ApiResponse.ok("Pending bills", billService.getPendingBills()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CASHIER', 'MANAGER', 'SUPER_ADMIN', 'WAITER')")
    public ResponseEntity<ApiResponse<BillResponse>> getBill(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Bill details", billService.getBillById(id)));
    }

    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasAnyRole('CASHIER', 'MANAGER', 'SUPER_ADMIN', 'WAITER')")
    public ResponseEntity<ApiResponse<BillResponse>> getBillByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok("Bill for order", billService.getBillByOrder(orderId)));
    }

    @PostMapping("/order/{orderId}")
    @PreAuthorize("hasAnyRole('WAITER', 'MANAGER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<BillResponse>> generateBill(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok("Bill generated", billService.generateBill(orderId)));
    }
}
