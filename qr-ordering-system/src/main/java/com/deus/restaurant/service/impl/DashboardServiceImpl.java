package com.deus.restaurant.service.impl;

import com.deus.restaurant.dto.response.DashboardResponse;
import com.deus.restaurant.enums.BillStatus;
import com.deus.restaurant.enums.OrderStatus;
import com.deus.restaurant.enums.TableStatus;
import com.deus.restaurant.repository.BillRepository;
import com.deus.restaurant.repository.MenuItemRepository;
import com.deus.restaurant.repository.OrderRepository;
import com.deus.restaurant.repository.PaymentRepository;
import com.deus.restaurant.repository.RestaurantTableRepository;
import com.deus.restaurant.repository.UserRepository;
import com.deus.restaurant.service.DashboardService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardServiceImpl implements DashboardService {
    private final RestaurantTableRepository tableRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final BillRepository billRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;

    public DashboardServiceImpl(RestaurantTableRepository tableRepository, OrderRepository orderRepository, PaymentRepository paymentRepository,
                                BillRepository billRepository, UserRepository userRepository, MenuItemRepository menuItemRepository) {
        this.tableRepository = tableRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.billRepository = billRepository;
        this.userRepository = userRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getManagerDashboard() {
        return buildCommonDashboard();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getSuperAdminDashboard() {
        return buildCommonDashboard();
    }

    private DashboardResponse buildCommonDashboard() {
        int activeTables = tableRepository.findByStatus(TableStatus.OCCUPIED).size();
        LocalDate today = LocalDate.now();
        
        int todayOrders = (int) orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().toLocalDate().equals(today))
                .count();
                
        BigDecimal revenue = paymentRepository.findAll().stream()
                .filter(p -> p.getPaymentDate() != null && p.getPaymentDate().toLocalDate().equals(today))
                .map(p -> p.getAmount() == null ? BigDecimal.ZERO : p.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        int pendingBills = billRepository.findByBillStatus(BillStatus.READY).size();
        int staffOnDuty = (int) userRepository.findAll().stream().filter(u -> Boolean.TRUE.equals(u.getIsActive())).count();
        
        List<Map<String, Object>> topItems = menuItemRepository.findAll().stream()
                .limit(5)
                .map(i -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("itemName", i.getItemName());
                    m.put("count", 0);
                    return m;
                }).toList();
        return DashboardResponse.builder()
                .activeTables(activeTables)
                .todayOrders(todayOrders)
                .todayRevenue(revenue)
                .pendingBills(pendingBills)
                .staffOnDuty(staffOnDuty)
                .topSellingItems(topItems)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getCashierDashboard() {
        Map<String, Object> m = new HashMap<>();
        m.put("pendingBills", billRepository.findByBillStatus(BillStatus.READY).size());
        m.put("todayPayments", paymentRepository.findAll().stream().filter(p -> p.getPaymentDate().toLocalDate().equals(LocalDate.now())).count());
        return m;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getKitchenStats() {
        Map<String, Object> m = new HashMap<>();
        m.put("placed", orderRepository.findByOrderStatus(OrderStatus.PLACED).size());
        m.put("preparing", orderRepository.findByOrderStatus(OrderStatus.PREPARING).size());
        m.put("ready", orderRepository.findByOrderStatus(OrderStatus.READY).size());
        
        LocalDate today = LocalDate.now();
        long todayTotal = orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().toLocalDate().equals(today))
                .count();
        m.put("todayTotal", todayTotal);
        return m;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getBarStats() {
        Map<String, Object> m = new HashMap<>();
        // For Bar, we filter by orders containing items for the BAR station
        // but for now we provide the same queue status as it's a global order status
        m.put("placed", orderRepository.findByOrderStatus(OrderStatus.PLACED).size());
        m.put("preparing", orderRepository.findByOrderStatus(OrderStatus.PREPARING).size());
        m.put("ready", orderRepository.findByOrderStatus(OrderStatus.READY).size());
        
        LocalDate today = LocalDate.now();
        long todayDrinks = orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().toLocalDate().equals(today))
                .count(); 
        
        m.put("todayDrinks", todayDrinks);
        return m;
    }
}

