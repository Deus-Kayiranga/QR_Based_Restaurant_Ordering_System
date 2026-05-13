package com.deus.restaurant.dto.response;

import com.deus.restaurant.enums.TableStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableResponse {
    private Long tableId;
    private String tableNumber;
    private Integer seatingCapacity;
    private String section;
    private TableStatus status;
    private Boolean isActive;
    private String qrCodeToken;
    private String qrCodeImageUrl;
}

