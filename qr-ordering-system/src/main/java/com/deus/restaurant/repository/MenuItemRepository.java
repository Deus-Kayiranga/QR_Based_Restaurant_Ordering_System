package com.deus.restaurant.repository;

import com.deus.restaurant.enums.StationType;
import com.deus.restaurant.model.MenuCategory;
import com.deus.restaurant.model.MenuItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategoryAndIsAvailableTrue(MenuCategory category);

    List<MenuItem> findByDestinationStationAndIsAvailableTrue(StationType station);

    List<MenuItem> findByItemNameContainingIgnoreCaseAndIsAvailableTrue(String name);
}

