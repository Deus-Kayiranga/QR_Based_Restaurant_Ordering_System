package com.deus.restaurant.repository;

import com.deus.restaurant.enums.TableStatus;
import com.deus.restaurant.model.RestaurantTable;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    Optional<RestaurantTable> findByTableNumber(String tableNumber);

    Optional<RestaurantTable> findByQrCodeToken(String qrCodeToken);

    List<RestaurantTable> findByStatus(TableStatus status);
}

