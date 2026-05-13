package com.deus.restaurant.controller;

import com.deus.restaurant.dto.request.CashPaymentRequest;
import com.deus.restaurant.dto.request.MobileMoneyPaymentRequest;
import com.deus.restaurant.dto.response.ApiResponse;
import com.deus.restaurant.dto.response.BillResponse;
import com.deus.restaurant.dto.response.PaymentResponse;
import com.deus.restaurant.enums.PaymentMethod;
import com.deus.restaurant.service.BillService;
import com.deus.restaurant.service.PaymentService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;
    private final BillService billService;
    public PaymentController(PaymentService paymentService, BillService billService) {
        this.paymentService = paymentService; this.billService = billService;
    }
    @PostMapping("/cash") @PreAuthorize("hasAnyRole('CASHIER','MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PaymentResponse>> cash(@Valid @RequestBody CashPaymentRequest req) { return ResponseEntity.ok(ApiResponse.ok("Cash payment processed", paymentService.processCashPayment(req))); }
    
    @GetMapping @PreAuthorize("hasAnyRole('CASHIER','MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> history(@RequestParam(required = false) String date) { 
        if (date == null) return ResponseEntity.ok(ApiResponse.ok("Today payments", paymentService.getTodayPayments()));
        return ResponseEntity.ok(ApiResponse.ok("Payments for " + date, paymentService.getPaymentsByDate(java.time.LocalDate.parse(date))));
    }
    @PostMapping("/momo") @PreAuthorize("hasRole('CASHIER')")
    public ResponseEntity<ApiResponse<PaymentResponse>> momo(@Valid @RequestBody MobileMoneyPaymentRequest req) { return ResponseEntity.ok(ApiResponse.ok("MoMo payment processed", paymentService.processMoMoPayment(req))); }
    @PostMapping("/airtel") @PreAuthorize("hasRole('CASHIER')")
    public ResponseEntity<ApiResponse<PaymentResponse>> airtel(@Valid @RequestBody MobileMoneyPaymentRequest req) { return ResponseEntity.ok(ApiResponse.ok("Airtel payment processed", paymentService.processAirtelPayment(req))); }
    
    @PostMapping("/customer")
    public ResponseEntity<ApiResponse<PaymentResponse>> customerPay(@Valid @RequestBody MobileMoneyPaymentRequest req) { 
        return ResponseEntity.ok(ApiResponse.ok("Payment processed", paymentService.processCustomerPayment(req))); 
    }
    @PostMapping("/verify-mobile") @PreAuthorize("hasRole('CASHIER')")
    public ResponseEntity<ApiResponse<Boolean>> verify(@RequestParam String reference) { return ResponseEntity.ok(ApiResponse.ok("Verification status", paymentService.verifyMobilePayment(reference))); }
    @GetMapping("/bills/pending") @PreAuthorize("hasAnyRole('CASHIER','MANAGER')")
    public ResponseEntity<ApiResponse<List<BillResponse>>> pendingBills() { return ResponseEntity.ok(ApiResponse.ok("Pending bills", billService.getPendingBills())); }
    @GetMapping("/bills/{id}") @PreAuthorize("hasAnyRole('CASHIER','MANAGER')")
    public ResponseEntity<ApiResponse<BillResponse>> bill(@PathVariable Long id) { return ResponseEntity.ok(ApiResponse.ok("Bill", billService.getBillById(id))); }
    @GetMapping("/today") @PreAuthorize("hasAnyRole('CASHIER','MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> today() { return ResponseEntity.ok(ApiResponse.ok("Today payments", paymentService.getTodayPayments())); }
    @GetMapping("/summary") @PreAuthorize("hasAnyRole('CASHIER','MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> summary() { return ResponseEntity.ok(ApiResponse.ok("Today summary", paymentService.getTodaySummary())); }
    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('CASHIER','MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PaymentResponse>> byId(@PathVariable Long id) { return ResponseEntity.ok(ApiResponse.ok("Payment", paymentService.getPaymentById(id))); }
    @GetMapping("/method/{method}") @PreAuthorize("hasAnyRole('CASHIER','MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> byMethod(@PathVariable PaymentMethod method) { return ResponseEntity.ok(ApiResponse.ok("Payments", paymentService.getPaymentsByMethod(method))); }
}

