package com.deus.restaurant.mapper;

import com.deus.restaurant.dto.response.PaymentResponse;
import com.deus.restaurant.model.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {
    public PaymentResponse toResponse(Payment payment, String receiptNumber) {
        if (payment == null) return null;
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .billId(payment.getBill() != null ? payment.getBill().getBillId() : null)
                .paymentMethod(payment.getPaymentMethod())
                .amount(payment.getAmount())
                .phoneNumber(payment.getPhoneNumber())
                .transactionReference(payment.getTransactionReference())
                .paymentStatus(payment.getPaymentStatus())
                .paymentDate(payment.getPaymentDate())
                .receiptNumber(receiptNumber)
                .tableNumber(payment.getBill() != null && payment.getBill().getOrder() != null && payment.getBill().getOrder().getTable() != null 
                             ? payment.getBill().getOrder().getTable().getTableNumber() : "N/A")
                .build();
    }
}

