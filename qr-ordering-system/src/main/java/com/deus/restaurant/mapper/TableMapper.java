package com.deus.restaurant.mapper;

import com.deus.restaurant.dto.response.TableResponse;
import com.deus.restaurant.model.RestaurantTable;
import org.springframework.stereotype.Component;

@Component
public class TableMapper {
    public TableResponse toResponse(RestaurantTable table) {
        if (table == null) return null;
        return TableResponse.builder()
                .tableId(table.getTableId())
                .tableNumber(table.getTableNumber())
                .seatingCapacity(table.getSeatingCapacity())
                .section(table.getSection())
                .status(table.getStatus())
                .isActive(table.getIsActive())
                .qrCodeToken(table.getQrCodeToken())
                .qrCodeImageUrl(table.getQrCodeImageUrl())
                .build();
    }
}

