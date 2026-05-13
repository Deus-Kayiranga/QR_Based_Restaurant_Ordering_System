package com.deus.restaurant.repository;

import com.deus.restaurant.enums.PaymentMethod;
import com.deus.restaurant.model.Payment;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end);

    List<Payment> findByPaymentMethodAndPaymentDateBetween(
            PaymentMethod method,
            LocalDateTime start,
            LocalDateTime end
    );
}

