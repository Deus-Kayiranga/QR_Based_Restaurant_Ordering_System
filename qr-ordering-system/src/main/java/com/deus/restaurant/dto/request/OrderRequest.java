package com.deus.restaurant.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    @NotNull
    private Long tableId;

    @NotBlank
    @Size(max = 100)
    private String sessionToken;

    @NotEmpty
    private List<@Valid OrderItemRequest> items;

    @Size(max = 2000)
    private String specialInstructions;
}

