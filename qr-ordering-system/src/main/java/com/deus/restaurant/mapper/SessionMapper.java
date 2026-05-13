package com.deus.restaurant.mapper;

import com.deus.restaurant.dto.response.SessionResponse;
import com.deus.restaurant.model.TableSession;
import org.springframework.stereotype.Component;

@Component
public class SessionMapper {
    public SessionResponse toResponse(TableSession session) {
        if (session == null) return null;
        return SessionResponse.builder()
                .tableId(session.getTable() != null ? session.getTable().getTableId() : null)
                .sessionToken(session.getSessionToken())
                .tableNumber(session.getTable() != null ? session.getTable().getTableNumber() : null)
                .isActive(session.getIsActive())
                .build();
    }
}

