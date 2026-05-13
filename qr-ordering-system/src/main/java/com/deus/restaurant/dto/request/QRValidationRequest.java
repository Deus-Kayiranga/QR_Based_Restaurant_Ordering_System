package com.deus.restaurant.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QRValidationRequest {
    @NotBlank
    @Size(max = 10)
    private String tableNumber;

    @NotBlank
    @Size(max = 100)
    private String token;
}

