package com.deus.restaurant.controller;

import com.deus.restaurant.dto.request.QRValidationRequest;
import com.deus.restaurant.dto.response.ApiResponse;
import com.deus.restaurant.dto.response.SessionResponse;
import com.deus.restaurant.service.QRCodeService;
import com.deus.restaurant.service.SessionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qr")
public class QRCodeController {
    private final QRCodeService qrCodeService;
    private final SessionService sessionService;
    public QRCodeController(QRCodeService qrCodeService, SessionService sessionService) {
        this.qrCodeService = qrCodeService;
        this.sessionService = sessionService;
    }
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<SessionResponse>> validate(@Valid @RequestBody QRValidationRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("QR validated", qrCodeService.validateQRCode(req)));
    }
    @PostMapping("/sessions")
    public ResponseEntity<ApiResponse<SessionResponse>> createSession(@RequestParam Long tableId, @RequestParam(defaultValue = "1") int customerCount) {
        return ResponseEntity.ok(ApiResponse.ok("Session created", sessionService.createSession(tableId, customerCount)));
    }
    @DeleteMapping("/sessions/{token}") @PreAuthorize("hasAnyRole('WAITER','MANAGER')")
    public ResponseEntity<ApiResponse<Void>> endSession(@PathVariable String token) {
        sessionService.endSession(token);
        return ResponseEntity.ok(ApiResponse.ok("Session ended", null));
    }
}

