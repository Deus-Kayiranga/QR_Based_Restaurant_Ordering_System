package com.deus.restaurant.service;

import com.deus.restaurant.dto.request.LoginRequest;
import com.deus.restaurant.dto.request.RegisterRequest;
import com.deus.restaurant.dto.response.AuthResponse;
import com.deus.restaurant.dto.response.UserResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);

    UserResponse register(RegisterRequest request);

    UserResponse getCurrentUser();
}

