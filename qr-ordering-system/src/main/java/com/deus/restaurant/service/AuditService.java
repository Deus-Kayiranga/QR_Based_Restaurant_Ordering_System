package com.deus.restaurant.service;

import com.deus.restaurant.model.AuditLog;
import java.util.List;

public interface AuditService {
    void log(String action, String module, String details, String performedBy, String userRole);
    List<AuditLog> getAllLogs();
}
