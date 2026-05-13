package com.deus.restaurant.dto.request;

import com.deus.restaurant.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    @NotNull
    private Long billId;

    @NotNull
    private PaymentMethod paymentMethod;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;
}

