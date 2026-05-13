package com.deus.restaurant.service;

import com.deus.restaurant.dto.response.DashboardResponse;
import java.util.Map;

public interface DashboardService {
    DashboardResponse getManagerDashboard();

    DashboardResponse getSuperAdminDashboard();

    Map<String, Object> getCashierDashboard();

    Map<String, Object> getKitchenStats();
    Map<String, Object> getBarStats();
}
