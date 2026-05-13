package com.deus.restaurant.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MobileMoneyPaymentRequest {
    @NotNull
    private Long billId;

    @NotBlank
    @Size(max = 20)
    private String phoneNumber;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;

    @Size(max = 100)
    private String transactionReference;

    private String paymentMethod; // Added to support CASH, MOMO, AIRTEL_MONEY
}

