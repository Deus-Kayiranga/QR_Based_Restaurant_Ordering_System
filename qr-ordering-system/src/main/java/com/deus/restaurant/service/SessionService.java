package com.deus.restaurant.service;

import com.deus.restaurant.dto.response.SessionResponse;

public interface SessionService {
    SessionResponse createSession(Long tableId, int customerCount);

    void endSession(String sessionToken);

    boolean validateSession(String sessionToken);

    SessionResponse getActiveSessionByTable(Long tableId);
}

