package com.deus.restaurant.service.impl;

import com.deus.restaurant.dto.request.RegisterRequest;
import com.deus.restaurant.dto.response.UserResponse;
import com.deus.restaurant.exception.BadRequestException;
import com.deus.restaurant.exception.DuplicateResourceException;
import com.deus.restaurant.exception.ResourceNotFoundException;
import com.deus.restaurant.mapper.UserMapper;
import com.deus.restaurant.model.User;
import com.deus.restaurant.repository.UserRepository;
import com.deus.restaurant.service.UserService;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User u = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toResponse(u);
    }

    @Override
    @Transactional
    public UserResponse createUser(RegisterRequest request) {
        if (request == null) throw new BadRequestException("Request is required");
        String email = request.getEmail() == null ? null : request.getEmail().trim().toLowerCase();
        if (email == null || email.isBlank()) throw new BadRequestException("Email is required");
        if (userRepository.findByEmail(email).isPresent()) throw new DuplicateResourceException("Email already exists");

        User u = User.builder()
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(email)
                .phoneNumber(request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()
                        ? request.getPhoneNumber().trim()
                        : null)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)
                .build();
        return userMapper.toResponse(userRepository.save(u));
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, RegisterRequest request) {
        if (request == null) throw new BadRequestException("Request is required");
        User u = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String email = request.getEmail() == null ? null : request.getEmail().trim().toLowerCase();
        if (email != null && !email.isBlank() && !email.equalsIgnoreCase(u.getEmail())) {
            if (userRepository.findByEmail(email).isPresent()) throw new DuplicateResourceException("Email already exists");
            u.setEmail(email);
        }
        u.setFirstName(request.getFirstName().trim());
        u.setLastName(request.getLastName().trim());
        u.setRole(request.getRole());
        u.setPhoneNumber(request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()
                ? request.getPhoneNumber().trim()
                : null);
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            u.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        return userMapper.toResponse(userRepository.save(u));
    }

    @Override
    @Transactional
    public void deactivateUser(Long id) {
        User u = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        u.setIsActive(false);
        userRepository.save(u);
    }

    @Override
    @Transactional
    public void activateUser(Long id) {
        User u = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        u.setIsActive(true);
        userRepository.save(u);
    }
}

