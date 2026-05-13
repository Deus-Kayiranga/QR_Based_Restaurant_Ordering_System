package com.deus.restaurant.repository;

import com.deus.restaurant.model.ItemCustomization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCustomizationRepository extends JpaRepository<ItemCustomization, Long> {
}

