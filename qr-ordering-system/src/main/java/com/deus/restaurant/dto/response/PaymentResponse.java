package com.deus.restaurant.dto.response;

import com.deus.restaurant.enums.PaymentMethod;
import com.deus.restaurant.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long paymentId;
    private Long billId;
    private PaymentMethod paymentMethod;
    private BigDecimal amount;
    private String phoneNumber;
    private String transactionReference;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
    private String receiptNumber;
    private String tableNumber;
}

