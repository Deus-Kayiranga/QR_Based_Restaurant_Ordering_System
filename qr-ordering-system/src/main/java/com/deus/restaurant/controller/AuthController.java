package com.deus.restaurant.controller;

import com.deus.restaurant.dto.request.LoginRequest;
import com.deus.restaurant.dto.request.RegisterRequest;
import com.deus.restaurant.dto.response.ApiResponse;
import com.deus.restaurant.dto.response.AuthResponse;
import com.deus.restaurant.dto.response.UserResponse;
import com.deus.restaurant.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final com.deus.restaurant.service.ForgotPasswordService forgotPasswordService;

    public AuthController(AuthService authService, com.deus.restaurant.service.ForgotPasswordService forgotPasswordService) {
        this.authService = authService;
        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authService.login(request)));
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("User created", authService.register(request)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me() {
        return ResponseEntity.ok(ApiResponse.ok("Current user", authService.getCurrentUser()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        forgotPasswordService.processForgotPassword(email);
        return ResponseEntity.ok(ApiResponse.ok("OTP sent to email", null));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<java.util.Map<String, String>>> verifyOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String token = forgotPasswordService.verifyOtp(email, otp);
        java.util.Map<String, String> data = new java.util.HashMap<>();
        data.put("token", token);
        return ResponseEntity.ok(ApiResponse.ok("OTP verified", data));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        forgotPasswordService.resetPassword(token, newPassword);
        return ResponseEntity.ok(ApiResponse.ok("Password reset successful", null));
    }
}

