package com.deus.restaurant.service;

import com.deus.restaurant.dto.request.CashPaymentRequest;
import com.deus.restaurant.dto.request.MobileMoneyPaymentRequest;
import com.deus.restaurant.dto.response.PaymentResponse;
import com.deus.restaurant.enums.PaymentMethod;
import java.util.List;
import java.util.Map;

public interface PaymentService {
    PaymentResponse processCashPayment(CashPaymentRequest request);

    PaymentResponse processMoMoPayment(MobileMoneyPaymentRequest request);

    PaymentResponse processAirtelPayment(MobileMoneyPaymentRequest request);

    boolean verifyMobilePayment(String reference);

    PaymentResponse getPaymentById(Long id);

    List<PaymentResponse> getTodayPayments();

    List<PaymentResponse> getPaymentsByDate(java.time.LocalDate date);

    List<PaymentResponse> getPaymentsByMethod(PaymentMethod method);

    Map<String, Object> getTodaySummary();

    PaymentResponse processCustomerPayment(MobileMoneyPaymentRequest request);
}
