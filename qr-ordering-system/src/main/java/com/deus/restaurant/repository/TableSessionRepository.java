package com.deus.restaurant.repository;

import com.deus.restaurant.model.RestaurantTable;
import com.deus.restaurant.model.TableSession;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TableSessionRepository extends JpaRepository<TableSession, Long> {
    Optional<TableSession> findByTableAndIsActiveTrue(RestaurantTable table);

    Optional<TableSession> findBySessionToken(String sessionToken);
}

