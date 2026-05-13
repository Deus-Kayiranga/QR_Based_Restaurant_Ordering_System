package com.deus.restaurant.repository;

import com.deus.restaurant.enums.BillStatus;
import com.deus.restaurant.model.Bill;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByBillStatus(BillStatus status);

    List<Bill> findByBillStatusIn(List<BillStatus> statuses);

    Optional<Bill> findByOrderOrderId(Long orderId);
}
