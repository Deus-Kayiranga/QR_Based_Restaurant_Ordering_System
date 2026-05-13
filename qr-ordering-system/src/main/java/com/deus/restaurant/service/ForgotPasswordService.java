package com.deus.restaurant.service;

import com.deus.restaurant.model.PasswordResetToken;
import com.deus.restaurant.model.User;
import com.deus.restaurant.repository.PasswordResetTokenRepository;
import com.deus.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class ForgotPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void processForgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            String otp = generateOtp();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .email(email)
                    .otp(otp)
                    .token(UUID.randomUUID().toString()) // Initial token, replaced later
                    .expiryDate(LocalDateTime.now().plusMinutes(5))
                    .used(false)
                    .build();
            tokenRepository.save(resetToken);
            emailService.sendOtpEmail(email, otp);
        } else {
            throw new RuntimeException("Email not found");
        }
    }

    public String verifyOtp(String email, String otp) {
        if (email == null || otp == null) {
            throw new RuntimeException("Email and OTP are required");
        }
        
        String cleanEmail = email.trim().toLowerCase();
        String cleanOtp = otp.trim();

        System.out.println("DEBUG: Verifying OTP for [" + cleanEmail + "] with code [" + cleanOtp + "]");
        
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findTopByEmailAndOtpAndUsedFalseOrderByExpiryDateDesc(cleanEmail, cleanOtp);
        
        if (tokenOpt.isPresent()) {
            PasswordResetToken resetToken = tokenOpt.get();
            if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                System.out.println("DEBUG: OTP expired for " + cleanEmail);
                throw new RuntimeException("OTP has expired");
            }
            
            // Mark old OTP as used
            resetToken.setUsed(true);
            tokenRepository.save(resetToken);
            
            String finalResetToken = UUID.randomUUID().toString();
            PasswordResetToken secureToken = PasswordResetToken.builder()
                    .email(cleanEmail)
                    .otp("verified")
                    .token(finalResetToken)
                    .expiryDate(LocalDateTime.now().plusMinutes(10))
                    .used(false)
                    .build();
            tokenRepository.save(secureToken);
            System.out.println("DEBUG: OTP verified successfully for " + cleanEmail);
            return finalResetToken;
        } else {
            System.out.println("DEBUG: No unused token found for " + cleanEmail + " with OTP " + cleanOtp);
            throw new RuntimeException("Invalid OTP. Please ensure you are using the latest code sent.");
        }
    }

    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByTokenAndUsedFalse(token);
        if (tokenOpt.isPresent()) {
            PasswordResetToken resetToken = tokenOpt.get();
            if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Reset token has expired");
            }
            
            Optional<User> userOpt = userRepository.findByEmail(resetToken.getEmail());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setPasswordHash(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                
                resetToken.setUsed(true);
                tokenRepository.save(resetToken);
            } else {
                throw new RuntimeException("User not found");
            }
        } else {
            throw new RuntimeException("Invalid token");
        }
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
