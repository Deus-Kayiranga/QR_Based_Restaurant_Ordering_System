package com.deus.restaurant.repository;

import com.deus.restaurant.enums.UserRole;
import com.deus.restaurant.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByRoleAndIsActive(UserRole role, Boolean isActive);
}

