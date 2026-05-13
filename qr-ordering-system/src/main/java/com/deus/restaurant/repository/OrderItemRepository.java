package com.deus.restaurant.repository;

import com.deus.restaurant.enums.OrderItemStatus;
import com.deus.restaurant.enums.StationType;
import com.deus.restaurant.model.OrderItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByDestinationStationAndItemStatusIn(StationType station, List<OrderItemStatus> statuses);

    List<OrderItem> findByOrderOrderId(Long orderId);
}

