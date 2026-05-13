package com.deus.restaurant.service;

import com.deus.restaurant.dto.response.BillResponse;
import com.deus.restaurant.enums.BillStatus;
import java.util.List;

public interface BillService {
    BillResponse generateBill(Long orderId);

    BillResponse getBillById(Long id);

    BillResponse getBillByOrder(Long orderId);

    List<BillResponse> getPendingBills();

    void updateBillStatus(Long id, BillStatus status);
}

