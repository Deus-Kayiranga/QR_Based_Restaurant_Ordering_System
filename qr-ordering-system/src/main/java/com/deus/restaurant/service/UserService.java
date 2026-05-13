package com.deus.restaurant.service;

import com.deus.restaurant.dto.request.RegisterRequest;
import com.deus.restaurant.dto.response.UserResponse;
import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse createUser(RegisterRequest request);

    UserResponse updateUser(Long id, RegisterRequest request);

    void deactivateUser(Long id);

    void activateUser(Long id);
}

