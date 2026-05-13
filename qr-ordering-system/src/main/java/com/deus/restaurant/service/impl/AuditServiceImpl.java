package com.deus.restaurant.service.impl;

import com.deus.restaurant.model.AuditLog;
import com.deus.restaurant.repository.AuditLogRepository;
import com.deus.restaurant.service.AuditService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AuditServiceImpl implements AuditService {
    private final AuditLogRepository auditLogRepository;

    public AuditServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional
    public void log(String action, String module, String details, String performedBy, String userRole) {
        AuditLog entry = AuditLog.builder()
                .action(action)
                .module(module)
                .details(details)
                .performedBy(performedBy)
                .userRole(userRole)
                .build();
        auditLogRepository.save(entry);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
