package com.deus.restaurant.repository;

import com.deus.restaurant.model.OrderActivityLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderActivityLogRepository extends JpaRepository<OrderActivityLog, Long> {
    List<OrderActivityLog> findByOrderOrderIdOrderByCreatedAtDesc(Long orderId);
}

