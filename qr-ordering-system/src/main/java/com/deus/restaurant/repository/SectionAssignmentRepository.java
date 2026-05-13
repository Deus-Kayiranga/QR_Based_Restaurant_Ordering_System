package com.deus.restaurant.repository;

import com.deus.restaurant.model.SectionAssignment;
import com.deus.restaurant.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionAssignmentRepository extends JpaRepository<SectionAssignment, Long> {
    List<SectionAssignment> findByIsActiveTrue();
    Optional<SectionAssignment> findBySectionNameAndIsActiveTrue(String sectionName);
    List<SectionAssignment> findByWaiterAndIsActiveTrue(User waiter);
}
