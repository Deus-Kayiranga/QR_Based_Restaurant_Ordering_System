package com.deus.restaurant.repository;

import com.deus.restaurant.enums.OrderStatus;
import com.deus.restaurant.model.Order;
import com.deus.restaurant.model.RestaurantTable;
import com.deus.restaurant.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByOrderStatusIn(List<OrderStatus> statuses);

    List<Order> findByAssignedWaiterAndOrderStatusIn(User waiter, List<OrderStatus> statuses);

    List<Order> findByTableAndOrderStatusNot(RestaurantTable table, OrderStatus status);
    List<Order> findByAssignedWaiterAndPlacedAtAfter(User waiter, java.time.LocalDateTime date);

    List<Order> findByOrderStatus(OrderStatus status);
}

