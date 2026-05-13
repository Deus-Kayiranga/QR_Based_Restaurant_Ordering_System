package com.deus.restaurant.service.impl;

import com.deus.restaurant.dto.response.SessionResponse;
import com.deus.restaurant.exception.ResourceNotFoundException;
import com.deus.restaurant.mapper.SessionMapper;
import com.deus.restaurant.model.RestaurantTable;
import com.deus.restaurant.model.TableSession;
import com.deus.restaurant.repository.RestaurantTableRepository;
import com.deus.restaurant.repository.TableSessionRepository;
import com.deus.restaurant.service.QRCodeService;
import com.deus.restaurant.service.SessionService;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionServiceImpl implements SessionService {
    private final TableSessionRepository sessionRepository;
    private final RestaurantTableRepository tableRepository;
    private final QRCodeService qrCodeService;
    private final SessionMapper sessionMapper;

    public SessionServiceImpl(TableSessionRepository sessionRepository, RestaurantTableRepository tableRepository,
                              QRCodeService qrCodeService, SessionMapper sessionMapper) {
        this.sessionRepository = sessionRepository;
        this.tableRepository = tableRepository;
        this.qrCodeService = qrCodeService;
        this.sessionMapper = sessionMapper;
    }

    @Override
    @Transactional
    public SessionResponse createSession(Long tableId, int customerCount) {
        RestaurantTable table = tableRepository.findById(tableId).orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        sessionRepository.findByTableAndIsActiveTrue(table).ifPresent(existing -> {
            existing.setIsActive(false);
            existing.setEndedAt(LocalDateTime.now());
            sessionRepository.save(existing);
        });
        TableSession session = TableSession.builder()
                .table(table)
                .sessionToken(qrCodeService.generateQRToken())
                .customerCount(Math.max(customerCount, 1))
                .isActive(true)
                .startedAt(LocalDateTime.now())
                .build();
        return sessionMapper.toResponse(sessionRepository.save(session));
    }

    @Override
    @Transactional
    public void endSession(String sessionToken) {
        TableSession session = sessionRepository.findBySessionToken(sessionToken)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        session.setIsActive(false);
        session.setEndedAt(LocalDateTime.now());
        sessionRepository.save(session);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateSession(String sessionToken) {
        return sessionRepository.findBySessionToken(sessionToken)
                .map(TableSession::getIsActive)
                .orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public SessionResponse getActiveSessionByTable(Long tableId) {
        RestaurantTable table = tableRepository.findById(tableId).orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        TableSession session = sessionRepository.findByTableAndIsActiveTrue(table)
                .orElseThrow(() -> new ResourceNotFoundException("No active session found"));
        return sessionMapper.toResponse(session);
    }
}

