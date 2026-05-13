package com.deus.restaurant.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        log.info("Sending PASSWORD RESET OTP to {}: {}", toEmail, otp);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Deus Restaurant - Password Reset OTP");
            message.setText(
                "Hello,\n\n" +
                "You requested a password reset for your Deus Restaurant account.\n\n" +
                "Your OTP code is: " + otp + "\n\n" +
                "This code expires in 5 minutes.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Thank you,\nDeus Restaurant Team\nKigali, Rwanda"
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("FAILED to send email to {}: {}", toEmail, e.getMessage());
            // We don't rethrow so the API call succeeds and the user can see the OTP in the console
        }
    }
}
