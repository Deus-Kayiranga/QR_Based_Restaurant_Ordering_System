package com.deus.restaurant.repository;

import com.deus.restaurant.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findTopByEmailAndOtpAndUsedFalseOrderByExpiryDateDesc(String email, String otp);
    Optional<PasswordResetToken> findByTokenAndUsedFalse(String token);
}
