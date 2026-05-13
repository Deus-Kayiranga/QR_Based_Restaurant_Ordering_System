package com.deus.restaurant.service.impl;

import com.deus.restaurant.dto.request.CashPaymentRequest;
import com.deus.restaurant.dto.request.MobileMoneyPaymentRequest;
import com.deus.restaurant.dto.response.PaymentResponse;
import com.deus.restaurant.enums.BillStatus;
import com.deus.restaurant.enums.PaymentMethod;
import com.deus.restaurant.enums.PaymentStatus;
import com.deus.restaurant.exception.PaymentFailedException;
import com.deus.restaurant.exception.ResourceNotFoundException;
import com.deus.restaurant.mapper.PaymentMapper;
import com.deus.restaurant.model.Bill;
import com.deus.restaurant.model.Payment;
import com.deus.restaurant.repository.BillRepository;
import com.deus.restaurant.repository.OrderRepository;
import com.deus.restaurant.repository.PaymentRepository;
import com.deus.restaurant.service.BillService;
import com.deus.restaurant.service.PaymentService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import com.deus.restaurant.service.NotificationService;
import com.deus.restaurant.enums.NotificationType;
import com.deus.restaurant.enums.UserRole;
import com.deus.restaurant.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final BillRepository billRepository;
    private final BillService billService;
    private final OrderRepository orderRepository;
    private final PaymentMapper paymentMapper;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public PaymentServiceImpl(PaymentRepository paymentRepository, BillRepository billRepository, BillService billService, 
                              OrderRepository orderRepository, PaymentMapper paymentMapper, NotificationService notificationService, 
                              UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.paymentRepository = paymentRepository;
        this.billRepository = billRepository;
        this.billService = billService;
        this.orderRepository = orderRepository;
        this.paymentMapper = paymentMapper;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    private Bill findBill(Long id) {
        return billRepository.findById(id)
                .or(() -> billRepository.findByOrderOrderId(id))
                .orElseGet(() -> {
                    // Try to find by Order ID directly and generate if it exists
                    return orderRepository.findById(id)
                            .map(order -> {
                                billService.generateBill(order.getOrderId());
                                return billRepository.findByOrderOrderId(order.getOrderId())
                                        .orElseThrow(() -> new ResourceNotFoundException("Failed to generate bill for order: " + id));
                            })
                            .orElseThrow(() -> new ResourceNotFoundException("Bill or Order not found for ID: " + id));
                });
    }

    @Override
    @Transactional
    public PaymentResponse processCashPayment(CashPaymentRequest request) {
        Bill bill = findBill(request.getBillId());
        if (request.getAmountTendered().compareTo(bill.getTotalAmount()) < 0) throw new PaymentFailedException("Insufficient cash amount");
        Payment payment = Payment.builder()
                .bill(bill)
                .paymentMethod(PaymentMethod.CASH)
                .amount(bill.getTotalAmount())
                .paymentStatus(PaymentStatus.COMPLETED)
                .paymentDate(LocalDateTime.now())
                .notes("Cash tendered: " + request.getAmountTendered())
                .build();
        Payment saved = paymentRepository.save(payment);
        billService.updateBillStatus(bill.getBillId(), BillStatus.PAID);
        return paymentMapper.toResponse(saved, "RCPT-CASH-" + saved.getPaymentId());
    }

    @Override
    @Transactional
    public PaymentResponse processMoMoPayment(MobileMoneyPaymentRequest request) {
        return processMobile(request, PaymentMethod.MOMO);
    }

    @Override
    @Transactional
    public PaymentResponse processAirtelPayment(MobileMoneyPaymentRequest request) {
        return processMobile(request, PaymentMethod.AIRTEL_MONEY);
    }

    private PaymentResponse processMobile(MobileMoneyPaymentRequest request, PaymentMethod method) {
        Bill bill = findBill(request.getBillId());
        if (request.getAmount().compareTo(bill.getTotalAmount()) < 0) throw new PaymentFailedException("Payment amount is below bill total");
        
        String reference = request.getTransactionReference();
        if (reference == null || reference.isBlank()) {
            reference = "DEMO-" + System.currentTimeMillis();
        }

        Payment saved = paymentRepository.save(Payment.builder()
                .bill(bill)
                .paymentMethod(method)
                .amount(request.getAmount())
                .phoneNumber(request.getPhoneNumber())
                .transactionReference(reference)
                .paymentStatus(PaymentStatus.COMPLETED)
                .paymentDate(LocalDateTime.now())
                .build());
        billService.updateBillStatus(bill.getBillId(), BillStatus.PAID);
        return paymentMapper.toResponse(saved, "RCPT-" + method.name() + "-" + saved.getPaymentId());
    }

    @Override
    public boolean verifyMobilePayment(String reference) {
        // Simplified for demo: any non-null reference is valid, and we'll generate one if missing
        return true; 
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        Payment p = paymentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return paymentMapper.toResponse(p, "RCPT-" + p.getPaymentId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getTodayPayments() {
        return getPaymentsByDate(LocalDate.now());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = start.plusDays(1).minusSeconds(1);
        return paymentRepository.findByPaymentDateBetween(start, end).stream()
                .map(p -> paymentMapper.toResponse(p, "RCPT-" + p.getPaymentId())).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByMethod(PaymentMethod method) {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1).minusSeconds(1);
        return paymentRepository.findByPaymentMethodAndPaymentDateBetween(method, start, end).stream()
                .map(p -> paymentMapper.toResponse(p, "RCPT-" + p.getPaymentId())).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getTodaySummary() {
        List<PaymentResponse> all = getTodayPayments();
        BigDecimal total = all.stream().map(PaymentResponse::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal cash = all.stream().filter(p -> p.getPaymentMethod() == PaymentMethod.CASH).map(PaymentResponse::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal momo = all.stream().filter(p -> p.getPaymentMethod() == PaymentMethod.MOMO).map(PaymentResponse::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal airtel = all.stream().filter(p -> p.getPaymentMethod() == PaymentMethod.AIRTEL_MONEY).map(PaymentResponse::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, Object> m = new HashMap<>();
        m.put("total", total);
        m.put("cash", cash);
        m.put("momo", momo);
        m.put("airtel", airtel);
        m.put("count", all.size());
        return m;
    }

    @Override
    @Transactional
    public PaymentResponse processCustomerPayment(MobileMoneyPaymentRequest request) {
        // Determine payment method from request or fallback
        PaymentMethod method = PaymentMethod.MOMO;
        if (request.getPaymentMethod() != null) {
            try {
                method = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
            } catch (Exception e) {
                // fallback to MOMO
            }
        }

        PaymentResponse response;
        if (method == PaymentMethod.CASH) {
            Bill bill = findBill(request.getBillId());
            Payment saved = paymentRepository.save(Payment.builder()
                    .bill(bill)
                    .paymentMethod(PaymentMethod.CASH)
                    .amount(bill.getTotalAmount())
                    .paymentStatus(PaymentStatus.COMPLETED)
                    .paymentDate(LocalDateTime.now())
                    .notes("Customer requested cash payment")
                    .build());
            billService.updateBillStatus(bill.getBillId(), BillStatus.PAID);
            response = paymentMapper.toResponse(saved, "RCPT-CASH-" + saved.getPaymentId());
        } else {
            response = processMobile(request, method);
        }
        
        Bill bill = findBill(request.getBillId());
        String tableNum = bill != null && bill.getOrder() != null && bill.getOrder().getTable() != null 
                ? bill.getOrder().getTable().getTableNumber() : "Unknown";

        // Notify Waiters and Cashiers
        String message = String.format("Payment of %s (%s) received for Table %s (Bill #%d)", 
                request.getAmount(), method, tableNum, request.getBillId());
        
        notifyStaff(UserRole.WAITER, NotificationType.PAYMENT_RECEIVED, "Payment Received", message, "BILL", request.getBillId());
        notifyStaff(UserRole.CASHIER, NotificationType.PAYMENT_RECEIVED, "Payment Received", message, "BILL", request.getBillId());
        
        // Broadcast to /topic/payments for real-time cashier dashboard toasts
        Map<String, Object> wsPayload = new LinkedHashMap<>();
        wsPayload.put("title", "💳 Payment Received");
        wsPayload.put("message", message);
        wsPayload.put("type", "PAYMENT_RECEIVED");
        messagingTemplate.convertAndSend("/topic/payments", wsPayload);
        messagingTemplate.convertAndSend("/topic/orders", wsPayload);
        
        return response;
    }

    private void notifyStaff(UserRole role, NotificationType type, String title, String message, String refType, Long refId) {
        userRepository.findByRoleAndIsActive(role, true).forEach(user -> 
            notificationService.sendNotification(user.getUserId(), type, title, message, refType, refId)
        );
    }
}

