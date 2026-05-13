package com.deus.restaurant.service.impl;

import com.deus.restaurant.dto.response.BillResponse;
import com.deus.restaurant.enums.BillStatus;
import com.deus.restaurant.exception.BadRequestException;
import com.deus.restaurant.exception.ResourceNotFoundException;
import com.deus.restaurant.mapper.BillMapper;
import com.deus.restaurant.model.Bill;
import com.deus.restaurant.model.Order;
import com.deus.restaurant.model.RestaurantTable;
import com.deus.restaurant.model.TableSession;
import com.deus.restaurant.repository.BillRepository;
import com.deus.restaurant.repository.OrderRepository;
import com.deus.restaurant.repository.RestaurantTableRepository;
import com.deus.restaurant.repository.TableSessionRepository;
import com.deus.restaurant.enums.TableStatus;
import com.deus.restaurant.service.BillService;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BillServiceImpl implements BillService {
    private final BillRepository billRepository;
    private final OrderRepository orderRepository;
    private final RestaurantTableRepository tableRepository;
    private final TableSessionRepository sessionRepository;
    private final BillMapper billMapper;

    public BillServiceImpl(BillRepository billRepository, OrderRepository orderRepository, 
                           RestaurantTableRepository tableRepository, TableSessionRepository sessionRepository,
                           BillMapper billMapper) {
        this.billRepository = billRepository;
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
        this.sessionRepository = sessionRepository;
        this.billMapper = billMapper;
    }

    @Override
    @Transactional
    public BillResponse generateBill(Long orderId) {
        if (billRepository.findByOrderOrderId(orderId).isPresent()) throw new BadRequestException("Bill already exists for this order");
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        Bill bill = Bill.builder()
                .order(order)
                .billNumber("DEUS-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "-" + orderId)
                .subtotal(order.getSubtotal())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .billStatus(BillStatus.OPEN)
                .generatedAt(LocalDateTime.now())
                .build();
        return billMapper.toResponse(billRepository.save(bill));
    }

    @Override
    @Transactional(readOnly = true)
    public BillResponse getBillById(Long id) {
        return billMapper.toResponse(billRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bill not found")));
    }

    @Override
    @Transactional(readOnly = true)
    public BillResponse getBillByOrder(Long orderId) {
        return billMapper.toResponse(billRepository.findByOrderOrderId(orderId).orElseThrow(() -> new ResourceNotFoundException("Bill not found")));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillResponse> getPendingBills() {
        return billRepository.findByBillStatusIn(List.of(BillStatus.OPEN, BillStatus.READY))
                .stream().map(billMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public void updateBillStatus(Long id, BillStatus status) {
        Bill bill = billRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bill not found"));
        bill.setBillStatus(status);
        if (status == BillStatus.PAID) {
            bill.setPaidAt(LocalDateTime.now());
            // When bill is paid, mark order as COMPLETED, free table, and close session
            if (bill.getOrder() != null) {
                Order order = bill.getOrder();
                order.setOrderStatus(com.deus.restaurant.enums.OrderStatus.COMPLETED);
                order.setCompletedAt(LocalDateTime.now());
                orderRepository.save(order);

                // Free table
                if (order.getTable() != null) {
                    RestaurantTable table = order.getTable();
                    table.setStatus(TableStatus.AVAILABLE);
                    tableRepository.save(table);
                }

                // Close session
                if (order.getSession() != null) {
                    TableSession session = order.getSession();
                    session.setIsActive(false);
                    sessionRepository.save(session);
                }
            }
        }
        billRepository.save(bill);
    }
}

